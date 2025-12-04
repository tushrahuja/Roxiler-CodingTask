/**
 * seed.js
 * Usage: node seed.js
 *
 * This script is for testing: 
 * - create SYSTEM_ADMIN, STORE_OWNER, 2 NORMAL_USERs
 * - create 2 stores and assign one to the owner
 * - create a few ratings so averages are non-zero
 *
 */

import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from './config/db.js'; 

async function query(sql, params = []) {
  return connectDB.promise().query(sql, params);
}

async function ensureUser(email, name, passPlain, role = 'NORMAL_USER', address = 'Demo address') {
  const [rows] = await query('SELECT id FROM users WHERE email = ?', [email]);
  if (rows.length) return rows[0].id;
  const hash = await bcrypt.hash(passPlain, 10);
  const [res] = await query(
    'INSERT INTO users (name,email,password_hash,address,role) VALUES (?,?,?,?,?)',
    [name, email, hash, address, role]
  );
  console.log(`Inserted user ${email} as id ${res.insertId} role=${role}`);
  return res.insertId;
}

async function ensureStore(name, email, address = 'Demo address', owner_id = null) {
  const [rows] = await query('SELECT id FROM stores WHERE email = ?', [email]);
  if (rows.length) return rows[0].id;
  const [res] = await query('INSERT INTO stores (name,email,address,owner_id) VALUES (?,?,?,?)', [name, email, address, owner_id]);
  console.log(`Inserted store ${name} id=${res.insertId}`);
  return res.insertId;
}

async function ensureRating(user_id, store_id, rating) {
  const [rows] = await query('SELECT id FROM ratings WHERE user_id = ? AND store_id = ?', [user_id, store_id]);
  if (rows.length) {
    await query('UPDATE ratings SET rating = ?, updated_at = NOW() WHERE id = ?', [rating, rows[0].id]);
    console.log(`Updated rating user ${user_id} store ${store_id} => ${rating}`);
    return rows[0].id;
  } else {
    const [res] = await query('INSERT INTO ratings (user_id, store_id, rating) VALUES (?,?,?)', [user_id, store_id, rating]);
    console.log(`Inserted rating id=${res.insertId} user ${user_id} store ${store_id} => ${rating}`);
    return res.insertId;
  }
}

async function main() {
  try {
    console.log('Seeding demo data...');

    // Users
    const adminId = await ensureUser('admin@local.test', 'Administrator Name With 20 Chars', 'Admin@123', 'SYSTEM_ADMIN', 'HQ address');
    const ownerId = await ensureUser('owner1@example.com', 'Store Owner Long Name 20 chars', 'Owner@123', 'STORE_OWNER', 'Owner street address');
    const user1 = await ensureUser('testuser1@example.com', 'This is a long name more than 20 chars', 'Abcd@1234', 'NORMAL_USER', 'User1 address');
    const user2 = await ensureUser('testuser2@example.com', 'Another long name sample 20 chars', 'Abcd@2345', 'NORMAL_USER', 'User2 address');

    // Stores
    const store1 = await ensureStore('The Corner Grocery Store', 'corner@grocery.com', '12 Market Lane, City', null);
    const store2 = await ensureStore('Sunny Bakery and Cafe', 'hello@sunnybakes.com', '45 Baker Street, City', ownerId);

    // Ratings
    await ensureRating(user1, store2, 4);
    await ensureRating(user2, store2, 5);
    await ensureRating(user1, store1, 3);

    console.log('Seeding complete. Admin credentials: admin@local.test / Admin@123');
    console.log('Owner credentials: owner1@example.com / Owner@123');
    console.log('User1 credentials: testuser1@example.com / Abcd@1234');
    console.log('User2 credentials: testuser2@example.com / Abcd@2345');

    process.exit(0);
  } catch (err) {
    console.error('Seeding error', err);
    process.exit(1);
  }
}

main();
