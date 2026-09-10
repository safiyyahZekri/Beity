import { Router } from 'express';
import { query } from '../db.js';
import { serializeMessage, serializeThread } from '../serializers.js';

const router = Router();

// GET /api/threads/:id - Thread details with messages
router.get('/:id', (req, res) => {
  try {
    const thread = query.get('SELECT * FROM threads WHERE id = ?', req.params.id);
    if (!thread) {
      return res.status(404).json({ error: 'Thread not found' });
    }

    const messages = query.all(
      'SELECT * FROM messages WHERE thread_id = ? ORDER BY id ASC',
      req.params.id
    );

    res.json(serializeThread(thread, messages));
  } catch (err) {
    console.error('Error fetching thread:', err);
    res.status(500).json({ error: 'Failed to fetch thread' });
  }
});

// GET /api/threads/:id/messages - Poll messages
router.get('/:id/messages', (req, res) => {
  try {
    const messages = query.all(
      'SELECT * FROM messages WHERE thread_id = ? ORDER BY id ASC',
      req.params.id
    );
    res.json(messages.map(serializeMessage));
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// POST /api/threads/:id/messages - Send message
router.post('/:id/messages', (req, res) => {
  try {
    const { from, senderName, type = 'text', body = '', price, date, note } = req.body;

    if (!from) {
      return res.status(400).json({ error: 'from (role) is required' });
    }

    const thread = query.get('SELECT * FROM threads WHERE id = ?', req.params.id);
    if (!thread) {
      return res.status(404).json({ error: 'Thread not found' });
    }

    const messageId = `m-${Date.now()}`;
    const isProposal = type === 'proposal';

    query.run(
      `INSERT INTO messages (
        id, thread_id, sender_role, sender_name, type, body,
        proposed_price, proposed_date, proposal_note, proposal_status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
      messageId,
      req.params.id,
      from,
      senderName || (from === 'cook' ? 'Cook' : 'Craver'),
      type,
      body,
      isProposal ? (price != null ? Number(price) : null) : null,
      isProposal ? (date || null) : null,
      isProposal ? (note || null) : null,
      isProposal ? 'pending' : null
    );

    const created = query.get('SELECT * FROM messages WHERE id = ?', messageId);
    res.status(201).json(serializeMessage(created));
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// PATCH /api/threads/:id/messages/:messageId - Accept / decline proposal
router.patch('/:id/messages/:messageId', (req, res) => {
  try {
    const { status } = req.body;
    if (!status || !['accepted', 'declined'].includes(status)) {
      return res.status(400).json({ error: 'Valid status (accepted or declined) is required' });
    }

    const message = query.get(
      'SELECT * FROM messages WHERE id = ? AND thread_id = ?',
      req.params.messageId,
      req.params.id
    );

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    query.run(
      'UPDATE messages SET proposal_status = ? WHERE id = ?',
      status,
      req.params.messageId
    );

    const updated = query.get('SELECT * FROM messages WHERE id = ?', req.params.messageId);
    res.json(serializeMessage(updated));
  } catch (err) {
    console.error('Error updating proposal message:', err);
    res.status(500).json({ error: 'Failed to update proposal message' });
  }
});

export default router;

