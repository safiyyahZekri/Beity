import { Router } from 'express';
import { query } from '../db.js';
import { serializeDemoUser } from '../serializers.js';

const router = Router();

router.get('/', (req, res) => {
  try {
    const rows = query.all('SELECT * FROM demo_users ORDER BY id ASC');
    res.json(rows.map(serializeDemoUser));
  } catch (err) {
    console.error('Error fetching demo users:', err);
    res.status(500).json({ error: 'Failed to fetch demo users' });
  }
});

export default router;

