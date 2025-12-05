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
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '10');
    const offset = (page - 1) * limit;
    const allowedSort = { name: 'name', email: 'email', address: 'address', role: 'role' };
    const sortExpr = allowedSort[sort] || 'name';
    const like = `%${q}%`;

    const countSql = `SELECT COUNT(*) as total FROM users WHERE name LIKE ? OR email LIKE ? OR address LIKE ? OR role LIKE ?`;
    const [countResult] = await connectDB.promise().query(countSql, [like, like, like, like]);
    const total = countResult[0].total;

    const sql = `
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        u.address, 
        u.role,
        CASE 
          WHEN u.role = 'STORE_OWNER' THEN (
            SELECT ROUND(AVG(r.rating), 2)
            FROM stores s
            LEFT JOIN ratings r ON r.store_id = s.id
            WHERE s.owner_id = u.id
          )
          ELSE NULL
        END AS avg_rating
      FROM users u
      WHERE u.name LIKE ? OR u.email LIKE ? OR u.address LIKE ? OR u.role LIKE ?
      ORDER BY ${sortExpr} ${order} 
      LIMIT ? OFFSET ?;
    `;
    const [rows] = await connectDB.promise().query(sql, [like, like, like, like, limit, offset]);
    return res.json({ users: rows, total, page, limit, totalPages: Math.ceil(total / limit) });
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
