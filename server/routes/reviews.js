import { Router } from 'express';
import { db, query } from '../db.js';
import { serializeReview } from '../serializers.js';

const router = Router();

// POST /api/reviews - Submit review after delivered order
router.post('/', (req, res) => {
  try {
    const { orderId, dishId, cookId, craverId, craverName, taste, onTime, text = '' } = req.body;

    if (!dishId || !taste || !onTime) {
      return res.status(400).json({ error: 'dishId, taste, and onTime are required' });
    }

    const reviewId = `rev-${Date.now()}`;

    const reviewTx = db.transaction(() => {
      // 1. Resolve cookId if not directly provided
      let resolvedCookId = cookId;
      if (!resolvedCookId) {
        const dish = query.get('SELECT cook_id FROM dishes WHERE id = ?', dishId);
        resolvedCookId = dish ? dish.cook_id : null;
      }

      // 2. Insert review
      query.run(
        `INSERT INTO reviews (
          id, dish_id, cook_id, craver_id, craver_name,
          taste_rating, on_time_rating, review_text, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
        reviewId,
        dishId,
        resolvedCookId,
        craverId || null,
        craverName || 'Craver',
        Number(taste),
        Number(onTime),
        text
      );

      // 3. Update order rating if orderId provided
      if (orderId) {
        query.run(
          'UPDATE orders SET taste_rating = ?, on_time_rating = ? WHERE id = ?',
          Number(taste),
          Number(onTime),
          orderId
        );
      }

      // 4. Update dish rating
      const dishReviews = query.all('SELECT taste_rating FROM reviews WHERE dish_id = ?', dishId);
      if (dishReviews.length > 0) {
        const avgRating =
          dishReviews.reduce((sum, r) => sum + Number(r.taste_rating), 0) / dishReviews.length;
        query.run(
          'UPDATE dishes SET rating = ? WHERE id = ?',
          Number(avgRating.toFixed(1)),
          dishId
        );
      }

      // 5. Update cook rating & rating_count
      if (resolvedCookId) {
        const cookReviews = query.all('SELECT taste_rating FROM reviews WHERE cook_id = ?', resolvedCookId);
        if (cookReviews.length > 0) {
          const cookAvg =
            cookReviews.reduce((sum, r) => sum + Number(r.taste_rating), 0) / cookReviews.length;
          query.run(
            'UPDATE cooks SET rating = ?, rating_count = ? WHERE id = ?',
            Number(cookAvg.toFixed(1)),
            cookReviews.length,
            resolvedCookId
          );
        }
      }
    });

    reviewTx();

    const created = query.get('SELECT * FROM reviews WHERE id = ?', reviewId);
    res.status(201).json(serializeReview(created));
  } catch (err) {
    console.error('Error submitting review:', err);
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

export default router;

