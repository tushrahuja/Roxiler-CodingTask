import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import { connectDB } from '../config/db.js';

export async function createUserByAdmin(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password, address, role } = req.body;
    const [exists] = await connectDB.promise().query('SELECT id FROM users WHERE email = ?', [email]);
    if (exists.length) return res.status(400).json({ error: 'Email exists' });

    const h = await bcrypt.hash(password, 10);
    const [result] = await connectDB.promise().query(
      'INSERT INTO users (name,email,password_hash,address,role) VALUES (?,?,?,?,?)',
      [name, email, h, address, role]
    );
    return res.json({ id: result.insertId });
  } catch (err) {
    console.error('createUserByAdmin', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

export async function listUsers(req, res) {
  try {
    const q = req.query.q || '';
    const sort = req.query.sort || 'name';
    const order = (req.query.order || 'asc').toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    const allowedSort = { name: 'name', email: 'email', address: 'address', role: 'role' };
    const sortExpr = allowedSort[sort] || 'name';
    const like = `%${q}%`;

    const sql = `SELECT id, name, email, address, role FROM users WHERE name LIKE ? OR email LIKE ? OR address LIKE ? ORDER BY ${sortExpr} ${order} LIMIT 1000;`;
    const [rows] = await connectDB.promise().query(sql, [like, like, like]);
    return res.json({ users: rows });
  } catch (err) {
    console.error('listUsers', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

export async function updatePassword(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    const [rows] = await connectDB.promise().query('SELECT password_hash FROM users WHERE id = ?', [userId]);
    if (!rows.length) return res.status(404).json({ error: 'User not found' });

    const match = await bcrypt.compare(oldPassword, rows[0].password_hash);
    if (!match) return res.status(400).json({ error: 'Incorrect old password' });

    const h = await bcrypt.hash(newPassword, 10);
    await connectDB.promise().query('UPDATE users SET password_hash = ? WHERE id = ?', [h, userId]);
    return res.json({ message: 'Password updated' });
  } catch (err) {
    console.error('updatePassword', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
