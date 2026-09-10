import { Router } from 'express';
import { db, query } from '../db.js';
import { serializeCook, serializeDish } from '../serializers.js';

const router = Router();

// GET /api/cooks - List all cooks
router.get('/', (req, res) => {
  try {
    const rows = query.all('SELECT * FROM cooks ORDER BY rating DESC, rating_count DESC');
    res.json(rows.map(serializeCook));
  } catch (err) {
    console.error('Error fetching cooks:', err);
    res.status(500).json({ error: 'Failed to fetch cooks' });
  }
});

// GET /api/cooks/:id - Get single cook with their menu
router.get('/:id', (req, res) => {
  try {
    const cook = query.get('SELECT * FROM cooks WHERE id = ?', req.params.id);
    if (!cook) {
      return res.status(404).json({ error: 'Cook not found' });
    }

    const dishes = query.all('SELECT * FROM dishes WHERE cook_id = ? ORDER BY id ASC', req.params.id);
    const reviews = query.all('SELECT * FROM reviews WHERE cook_id = ?', req.params.id);

    const serializedCook = serializeCook(cook);
    const serializedDishes = dishes.map((d) => {
      const dishReviews = reviews.filter((r) => r.dish_id === d.id);
      return serializeDish(d, dishReviews);
    });

    res.json({ ...serializedCook, menu: serializedDishes });
  } catch (err) {
    console.error('Error fetching cook by id:', err);
    res.status(500).json({ error: 'Failed to fetch cook' });
  }
});

// POST /api/cooks - Sign up new cook
router.post('/', (req, res) => {
  try {
    const { name, location, bio, cuisineTags = [], starterItems = [] } = req.body;
    const id = `cook-${Date.now()}`;
    const nameEn = typeof name === 'object' ? name.en : (name || 'Home Cook');
    const nameAr = typeof name === 'object' ? name.ar : (name || 'طاهي بيتي');
    const bioEn = typeof bio === 'object' ? bio.en : (bio || 'Cooking fresh from my home kitchen.');
    const bioAr = typeof bio === 'object' ? bio.ar : (bio || 'أطبخ طازجاً من مطبخ بيتي.');

    const insertTransaction = db.transaction(() => {
      query.run(
        `INSERT INTO cooks (id, name_en, name_ar, location, bio_en, bio_ar, cuisine_tags, rating, rating_count, avatar_seed, joined)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        id,
        nameEn,
        nameAr,
        location || 'Cairo',
        bioEn,
        bioAr,
        JSON.stringify(cuisineTags.length ? cuisineTags : ['Egyptian Home Cooking']),
        0,
        0,
        nameEn.split(' ')[0],
        'Joined today'
      );

      // Add to demo_users so role switcher / login shows this account
      query.run(
        `INSERT INTO demo_users (id, role, name, avatar_seed, account_id)
         VALUES (?, 'cook', ?, ?, ?)`,
        `demo-${id}`,
        `${nameEn} (Cook)`,
        nameEn.split(' ')[0],
        id
      );

      // Insert any starter menu items entered during signup
      starterItems.forEach((item, index) => {
        const dishId = `dish-${Date.now()}-${index + 1}`;
        const itemNameEn = typeof item.name === 'object' ? item.name.en : item.name;
        const itemNameAr = typeof item.name === 'object' ? item.name.ar : item.name;
        const ingList = (item.ingredients || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);

        query.run(
          `INSERT INTO dishes (id, cook_id, name_en, name_ar, price, category, description_en, description_ar, ingredients_en, ingredients_ar, taste_tags, dietary_tags, rating)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '[]', '[]', 0)`,
          dishId,
          id,
          itemNameEn || 'Special Dish',
          itemNameAr || 'طبق خاص',
          Number(item.price) || 0,
          item.category || 'Lunch',
          item.description || '',
          item.description || '',
          JSON.stringify(ingList),
          JSON.stringify(ingList)
        );
      });
    });

    insertTransaction();

    const created = query.get('SELECT * FROM cooks WHERE id = ?', id);
    res.status(201).json(serializeCook(created));
  } catch (err) {
    console.error('Error creating cook:', err);
    res.status(500).json({ error: 'Failed to create cook' });
  }
});

export default router;

