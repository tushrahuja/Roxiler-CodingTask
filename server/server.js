// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import storeRoutes from './routes/storeRoutes.js';
import ratingRoutes from './routes/ratingRoutes.js';
import { connectDB } from './config/db.js';
import auth from './middleware/auth.js';
import { permit } from './middleware/roles.js';

const app = express();
app.use(cors());
app.use(express.json());


app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);


//for testing purposes only
app.get('/api/test/protected', auth, (req, res) => {
  return res.json({ ok: true, msg: 'Protected route OK', user: req.user });
});
app.get('/api/test/admin', auth, permit('SYSTEM_ADMIN'), (req, res) => {
  return res.json({ ok: true, msg: 'Admin route OK', user: req.user });
});

const PORT = process.env.PORT || 8080;

connectDB.getConnection((err, conn) => {
  if (err) {
    console.error('DB connection failed', err.message || err);
    process.exit(1);
  } else {
    if (conn) conn.release();
    console.log('Connected to MySQL, starting server...');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  }
});
