import { Router } from 'express';
import { db, query } from '../db.js';
import { serializeOrder } from '../serializers.js';

const router = Router();

// GET /api/orders - List orders (optionally filtered by craverId or cookId)
router.get('/', (req, res) => {
  try {
    const { craverId, cookId } = req.query;
    let sql = 'SELECT * FROM orders WHERE 1=1';
    const params = [];

    if (craverId) {
      sql += ' AND craver_id = ?';
      params.push(craverId);
    }
    if (cookId) {
      sql += ' AND cook_id = ?';
      params.push(cookId);
    }

    sql += ' ORDER BY id DESC';
    const rows = query.all(sql, ...params);
    res.json(rows.map(serializeOrder));
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// POST /api/orders - Place an order
router.post('/', (req, res) => {
  try {
    const { dishId, cookId, craverId, craverName, qty = 1, recurring = false, recurringDay = null } = req.body;

    if (!dishId || !cookId || !craverId) {
      return res.status(400).json({ error: 'dishId, cookId, and craverId are required' });
    }

    const dish = query.get('SELECT * FROM dishes WHERE id = ?', dishId);
    const dishPrice = dish ? Number(dish.price) : 0;
    const dishName = dish ? dish.name_en : 'Meal';
    const total = dishPrice * Number(qty);

    const orderId = `order-${Date.now()}`;
    const threadId = `thread-${orderId}`;

    const orderTx = db.transaction(() => {
      // 1. Create chat thread for this order
      query.run(
        `INSERT INTO threads (id, order_id, request_id, cook_id, craver_id, craver_name, subject, created_at)
         VALUES (?, ?, NULL, ?, ?, ?, ?, datetime('now'))`,
        threadId,
        orderId,
        cookId,
        craverId,
        craverName || 'Craver',
        `${dishName} × ${qty}`
      );

      // 2. Insert order
      query.run(
        `INSERT INTO orders (
          id, dish_id, cook_id, craver_id, craver_name, quantity, total,
          status, is_recurring, recurring_day, thread_id, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending', ?, ?, ?, datetime('now'))`,
        orderId,
        dishId,
        cookId,
        craverId,
        craverName || 'Craver',
        Number(qty),
        total,
        recurring ? 1 : 0,
        recurring ? recurringDay : null,
        threadId
      );
    });

    orderTx();

    const created = query.get('SELECT * FROM orders WHERE id = ?', orderId);
    res.status(201).json(serializeOrder(created));
  } catch (err) {
    console.error('Error placing order:', err);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

// PATCH /api/orders/:id/status - Update order status
router.patch('/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'status is required' });
    }

    const existing = query.get('SELECT * FROM orders WHERE id = ?', req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Order not found' });
    }

    query.run('UPDATE orders SET status = ? WHERE id = ?', status, req.params.id);
    const updated = query.get('SELECT * FROM orders WHERE id = ?', req.params.id);
    res.json(serializeOrder(updated));
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

export default router;

