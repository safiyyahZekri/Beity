import { Router } from 'express';
import { query } from '../db.js';
import { serializeDish } from '../serializers.js';

const router = Router();

// GET /api/dishes - Search, filter, and list dishes
router.get('/', (req, res) => {
  try {
    const { q, category, taste, dietary, cookId } = req.query;

    let sql = `
      SELECT d.*, c.name_en as cook_name_en, c.name_ar as cook_name_ar
      FROM dishes d
      JOIN cooks c ON d.cook_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (cookId) {
      sql += ' AND d.cook_id = ?';
      params.push(cookId);
    }

    if (category) {
      sql += ' AND d.category = ?';
      params.push(category);
    }

    if (q && q.trim()) {
      const term = `%${q.trim().toLowerCase()}%`;
      sql += ` AND (
        LOWER(d.name_en) LIKE ? OR
        LOWER(d.name_ar) LIKE ? OR
        LOWER(d.description_en) LIKE ? OR
        LOWER(d.description_ar) LIKE ? OR
        LOWER(d.ingredients_en) LIKE ? OR
        LOWER(d.ingredients_ar) LIKE ? OR
        LOWER(c.name_en) LIKE ? OR
        LOWER(c.name_ar) LIKE ?
      )`;
      params.push(term, term, term, term, term, term, term, term);
    }

    sql += ' ORDER BY d.rating DESC, d.id ASC';

    let rows = query.all(sql, ...params);

    // Filter in-memory for JSON array fields if specified (taste and dietary)
    if (taste) {
      const tastes = Array.isArray(taste) ? taste : taste.split(',').map((t) => t.trim());
      rows = rows.filter((r) => {
        try {
          const tags = JSON.parse(r.taste_tags || '[]');
          return tastes.some((t) => tags.includes(t));
        } catch {
          return false;
        }
      });
    }

    if (dietary) {
      const dietaryList = Array.isArray(dietary) ? dietary : dietary.split(',').map((d) => d.trim());
      rows = rows.filter((r) => {
        try {
          const tags = JSON.parse(r.dietary_tags || '[]');
          return dietaryList.some((d) => tags.includes(d));
        } catch {
          return false;
        }
      });
    }

    // Attach reviews
    const allReviews = query.all('SELECT * FROM reviews ORDER BY id DESC');
    const serialized = rows.map((row) => {
      const dishReviews = allReviews.filter((rev) => rev.dish_id === row.id);
      return serializeDish(row, dishReviews);
    });

    res.json(serialized);
  } catch (err) {
    console.error('Error fetching dishes:', err);
    res.status(500).json({ error: 'Failed to fetch dishes' });
  }
});

// GET /api/dishes/:id
router.get('/:id', (req, res) => {
  try {
    const row = query.get('SELECT * FROM dishes WHERE id = ?', req.params.id);
    if (!row) {
      return res.status(404).json({ error: 'Dish not found' });
    }
    const reviews = query.all('SELECT * FROM reviews WHERE dish_id = ? ORDER BY id DESC', req.params.id);
    res.json(serializeDish(row, reviews));
  } catch (err) {
    console.error('Error fetching dish by id:', err);
    res.status(500).json({ error: 'Failed to fetch dish' });
  }
});

// POST /api/dishes - Add dish
router.post('/', (req, res) => {
  try {
    const {
      cookId,
      name,
      price,
      calories,
      category = 'Lunch',
      description = '',
      ingredients = '',
      taste = [],
      dietary = [],
    } = req.body;

    if (!cookId) {
      return res.status(400).json({ error: 'cookId is required' });
    }

    const id = `dish-${Date.now()}`;
    const nameEn = typeof name === 'object' ? name.en : (name || 'New Dish');
    const nameAr = typeof name === 'object' ? name.ar : (name || 'طبق جديد');
    const descEn = typeof description === 'object' ? description.en : (description || '');
    const descAr = typeof description === 'object' ? description.ar : (description || '');

    const ingList = Array.isArray(ingredients)
      ? ingredients.map((i) => (typeof i === 'object' ? i.en : i))
      : String(ingredients || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);

    query.run(
      `INSERT INTO dishes (
        id, cook_id, name_en, name_ar, photo, price, calories, category,
        taste_tags, dietary_tags, description_en, description_ar,
        ingredients_en, ingredients_ar, rating
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      id,
      cookId,
      nameEn,
      nameAr,
      null, // photo falls back to category-based placeholder
      Number(price) || 0,
      calories ? Number(calories) : null,
      category,
      JSON.stringify(taste),
      JSON.stringify(dietary),
      descEn,
      descAr,
      JSON.stringify(ingList),
      JSON.stringify(ingList),
      0
    );

    const created = query.get('SELECT * FROM dishes WHERE id = ?', id);
    res.status(201).json(serializeDish(created, []));
  } catch (err) {
    console.error('Error creating dish:', err);
    res.status(500).json({ error: 'Failed to create dish' });
  }
});

export default router;

