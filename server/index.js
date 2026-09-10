import express from 'express';
import cors from 'cors';
import { query, initSchema } from './db.js';
import { seedDatabase } from './seed.js';

import demoUsersRouter from './routes/demoUsers.js';
import cooksRouter from './routes/cooks.js';
import craversRouter from './routes/cravers.js';
import dishesRouter from './routes/dishes.js';
import ordersRouter from './routes/orders.js';
import requestsRouter from './routes/requests.js';
import threadsRouter from './routes/threads.js';
import reviewsRouter from './routes/reviews.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize schema and auto-seed if empty
initSchema();
const existingCooks = query.get('SELECT COUNT(*) as count FROM cooks');
if (!existingCooks || existingCooks.count === 0) {
  console.log('Database empty on startup — running seed script...');
  seedDatabase();
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'Beity Backend API', time: new Date().toISOString() });
});

// Mount routes
app.use('/api/demo-users', demoUsersRouter);
app.use('/api/cooks', cooksRouter);
app.use('/api/cravers', craversRouter);
app.use('/api/dishes', dishesRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/requests', requestsRouter);
app.use('/api/threads', threadsRouter);
app.use('/api/reviews', reviewsRouter);

// 404 handler for unmatched API routes
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

// Start listening
app.listen(PORT, () => {
  console.log(`🥘 Beity Backend Server running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
});
