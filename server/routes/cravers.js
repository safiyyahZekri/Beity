import { Router } from 'express';
import { db, query } from '../db.js';
import { serializeCraver } from '../serializers.js';

const router = Router();

// GET /api/cravers/:id
router.get('/:id', (req, res) => {
  try {
    const craver = query.get('SELECT * FROM cravers WHERE id = ?', req.params.id);
    if (!craver) {
      return res.status(404).json({ error: 'Craver not found' });
    }
    res.json(serializeCraver(craver));
  } catch (err) {
    console.error('Error fetching craver:', err);
    res.status(500).json({ error: 'Failed to fetch craver' });
  }
});

// POST /api/cravers - Sign up craver
router.post('/', (req, res) => {
  try {
    const { name, location, preferences = [], favoriteFoods = '', allergies = '' } = req.body;
    const id = `craver-${Date.now()}`;
    const craverName = name?.trim() || 'Craver';

    const insertTx = db.transaction(() => {
      query.run(
        `INSERT INTO cravers (id, name, location, preferences, favorite_foods, allergies, avatar_seed)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        id,
        craverName,
        location?.trim() || 'Cairo',
        JSON.stringify(preferences),
        favoriteFoods?.trim() || '',
        allergies?.trim() || '',
        craverName.split(' ')[0]
      );

      // Add to demo_users
      query.run(
        `INSERT INTO demo_users (id, role, name, avatar_seed, account_id)
         VALUES (?, 'craver', ?, ?, ?)`,
        `demo-${id}`,
        `${craverName} (Craver)`,
        craverName.split(' ')[0],
        id
      );
    });

    insertTx();

    const created = query.get('SELECT * FROM cravers WHERE id = ?', id);
    res.status(201).json(serializeCraver(created));
  } catch (err) {
    console.error('Error creating craver:', err);
    res.status(500).json({ error: 'Failed to create craver' });
  }
});

// PATCH /api/cravers/:id - Update profile details
router.patch('/:id', (req, res) => {
  try {
    const { name, location, preferences, favoriteFoods, allergies } = req.body;
    const existing = query.get('SELECT * FROM cravers WHERE id = ?', req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Craver not found' });
    }

    query.run(
      `UPDATE cravers SET
        name = COALESCE(?, name),
        location = COALESCE(?, location),
        preferences = COALESCE(?, preferences),
        favorite_foods = COALESCE(?, favorite_foods),
        allergies = COALESCE(?, allergies)
       WHERE id = ?`,
      name,
      location,
      preferences !== undefined ? JSON.stringify(preferences) : null,
      favoriteFoods,
      allergies,
      req.params.id
    );

    const updated = query.get('SELECT * FROM cravers WHERE id = ?', req.params.id);
    res.json(serializeCraver(updated));
  } catch (err) {
    console.error('Error updating craver:', err);
    res.status(500).json({ error: 'Failed to update craver' });
  }
});

export default router;

