import { connectDB } from "../config/db.js";

export async function addStoreByAdmin(req, res) {
  try {
    const { name, email, address, owner_id } = req.body;
    const [result] = await connectDB.promise().query(
      'INSERT INTO stores (name,email,address,owner_id) VALUES (?,?,?,?)',
      [name, email, address, owner_id || null]
    );
    return res.json({ id: result.insertId });
  } catch (err) {
    console.error('addStoreByAdmin', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

export async function listStores(req, res) {
  try {
    const q = req.query.q || '';
    const sortField = req.query.sort || 'name';
    const order = (req.query.order || 'asc').toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '20');
    const offset = (page - 1) * limit;
    const userId = req.user?.id;

    const allowedSorts = { name: 's.name', address: 's.address', rating: 'avg_rating' };
    const sortExpr = allowedSorts[sortField] || 's.name';

    const sql = `
      SELECT s.id, s.name, s.address, s.email,
        IFNULL(ROUND(AVG(r.rating),2),0) AS avg_rating,
        (SELECT rating FROM ratings WHERE store_id = s.id AND user_id = ? LIMIT 1) AS user_rating
      FROM stores s
      LEFT JOIN ratings r ON r.store_id = s.id
      WHERE s.name LIKE ? OR s.address LIKE ?
      GROUP BY s.id
      ORDER BY ${sortExpr} ${order}
      LIMIT ? OFFSET ?;
    `;
    const like = `%${q}%`;
    const [results] = await connectDB.promise().query(sql, [userId, like, like, limit, offset]);
    return res.json({ stores: results });
  } catch (err) {
    console.error('listStores', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

export async function ownerDashboard(req, res) {
  try {
    const ownerId = parseInt(req.params.ownerId);
    // fetch stores for owner
    const sql = `
      SELECT s.id, s.name, s.address, IFNULL(ROUND(AVG(r.rating),2),0) AS avg_rating
      FROM stores s
      LEFT JOIN ratings r ON r.store_id = s.id
      WHERE s.owner_id = ?
      GROUP BY s.id;
    `;
    const [stores] = await connectDB.promise().query(sql, [ownerId]);
    if (!stores.length) return res.json({ stores: [], ratings: [] });

    const storeIds = stores.map(s => s.id);
    const sql2 = `
      SELECT r.user_id, r.rating, u.name, u.email, r.store_id
      FROM ratings r
      JOIN users u ON u.id = r.user_id
      WHERE r.store_id IN (?)
      ORDER BY r.created_at DESC;
    `;
    const [ratings] = await connectDB.promise().query(sql2, [storeIds]);
    return res.json({ stores, ratings });
  } catch (err) {
    console.error('ownerDashboard', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
