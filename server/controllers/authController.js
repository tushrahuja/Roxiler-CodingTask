import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { connectDB } from '../config/db.js';

const passwordRegex = /^(?=.{8,16}$)(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/]).*$/;

export async function signup(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, address, password } = req.body;
    const [existing] = await connectDB.promise().query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length) return res.status(400).json({ error: 'Email already used' });

    const hash = await bcrypt.hash(password, 10);
    const [result] = await connectDB.promise().query(
      'INSERT INTO users (name,email,password_hash,address,role) VALUES (?,?,?,?,?)',
      [name, email, hash, address, 'NORMAL_USER']
    );

    const userId = result.insertId;
    const token = jwt.sign({ id: userId, role: 'NORMAL_USER' }, process.env.JWT_SECRET);
    return res.json({ token, user: { id: userId, name, email, role: 'NORMAL_USER' } });
  } catch (err) {
    console.error('signup error', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

export async function login(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    const [rows] = await connectDB.promise().query('SELECT * FROM users WHERE email = ?', [email]);
    if (!rows.length) return res.status(400).json({ error: 'Invalid credentials' });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
    return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('login error', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
