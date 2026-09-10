import { Router } from 'express';
import { db, query } from '../db.js';
import { serializeRequest } from '../serializers.js';

const router = Router();

// GET /api/requests - List requests
router.get('/', (req, res) => {
  try {
    const { craverId, cookId } = req.query;
    let sql = 'SELECT * FROM requests WHERE 1=1';
    const params = [];

    if (craverId) {
      sql += ' AND craver_id = ?';
      params.push(craverId);
    }
    if (cookId) {
      // Cook can see requests accepted by them OR pending
      sql += ' AND (accepted_by = ? OR status = "pending")';
      params.push(cookId);
    }

    sql += ' ORDER BY id DESC';
    const rows = query.all(sql, ...params);
    res.json(rows.map(serializeRequest));
  } catch (err) {
    console.error('Error fetching requests:', err);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

// POST /api/requests - Create special request
router.post('/', (req, res) => {
  try {
    const { craverId, craverName, description, date, budget, tags = [] } = req.body;

    if (!craverId || !description) {
      return res.status(400).json({ error: 'craverId and description are required' });
    }

    const reqId = `req-${Date.now()}`;
    const threadId = `thread-${reqId}`;
    const distanceKm = Number((Math.random() * 5 + 1.2).toFixed(1));

    const requestTx = db.transaction(() => {
      // Create thread
      query.run(
        `INSERT INTO threads (id, order_id, request_id, cook_id, craver_id, craver_name, subject, created_at)
         VALUES (?, NULL, ?, NULL, ?, ?, ?, datetime('now'))`,
        threadId,
        reqId,
        craverId,
        craverName || 'Craver',
        'Special request'
      );

      // Create request
      query.run(
        `INSERT INTO requests (
          id, craver_id, craver_name, description, desired_date, budget,
          tags, status, accepted_by, distance_km, thread_id, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', NULL, ?, ?, datetime('now'))`,
        reqId,
        craverId,
        craverName || 'Craver',
        description,
        date || 'Flexible',
        budget || '300 – 600 EGP',
        JSON.stringify(tags),
        distanceKm,
        threadId
      );
    });

    requestTx();

    const created = query.get('SELECT * FROM requests WHERE id = ?', reqId);
    res.status(201).json(serializeRequest(created));
  } catch (err) {
    console.error('Error creating request:', err);
    res.status(500).json({ error: 'Failed to create request' });
  }
});

// PATCH /api/requests/:id/status - Accept or decline request
router.patch('/:id/status', (req, res) => {
  try {
    const { status, cookId } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'status is required' });
    }

    const existing = query.get('SELECT * FROM requests WHERE id = ?', req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const updateTx = db.transaction(() => {
      query.run(
        `UPDATE requests SET
          status = ?,
          accepted_by = ?
         WHERE id = ?`,
        status,
        status === 'accepted' ? cookId : null,
        req.params.id
      );

      // If accepted, connect cook to the thread
      if (status === 'accepted' && cookId) {
        query.run('UPDATE threads SET cook_id = ? WHERE id = ?', cookId, existing.thread_id);
      }
    });

    updateTx();

    const updated = query.get('SELECT * FROM requests WHERE id = ?', req.params.id);
    res.json(serializeRequest(updated));
  } catch (err) {
    console.error('Error updating request status:', err);
    res.status(500).json({ error: 'Failed to update request status' });
  }
});

export default router;

