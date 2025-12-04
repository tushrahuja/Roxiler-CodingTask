import { connectDB } from "../config/db.js";

export async function submitOrUpdateRating(req, res) {
  try {
    const storeId = parseInt(req.params.storeId);
    const userId = req.user.id;
    const rating = parseInt(req.body.rating);
    if (!rating || rating < 1 || rating > 5) return res.status(400).json({ error: 'Invalid rating' });

    const [existing] = await connectDB.promise().query('SELECT id FROM ratings WHERE user_id = ? AND store_id = ?', [userId, storeId]);
    if (existing.length) {
      await connectDB.promise().query('UPDATE ratings SET rating = ?, updated_at = NOW() WHERE id = ?', [rating, existing[0].id]);
      return res.json({ message: 'Rating updated' });
    } else {
      await connectDB.promise().query('INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)', [userId, storeId, rating]);
      return res.json({ message: 'Rating submitted' });
    }
  } catch (err) {
    console.error('submitOrUpdateRating', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

export async function getUserRatingForStore(req, res) {
  try {
    const storeId = parseInt(req.params.storeId);
    const userId = req.user.id;
    const [rows] = await connectDB.promise().query('SELECT rating FROM ratings WHERE store_id = ? AND user_id = ?', [storeId, userId]);
    return res.json({ rating: rows.length ? rows[0].rating : null });
  } catch (err) {
    console.error('getUserRatingForStore', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
