# 🚀 RateGenius — Store Rating Platform

A full-stack web application built with **React + Vite + Tailwind CSS**, **Express.js**, and **MySQL**, allowing users to rate stores and providing dashboards for Admins, Store Owners, and Normal Users.

---

## 📂 Project Structure

```
roxiler-task/
├── server/          → Express backend (Node.js + MySQL)
├── client/          → React frontend (Vite + Tailwind CSS)
└── README.md
```

---

## ⚙️ Backend Setup (Express + MySQL)

### 1️⃣ Install dependencies
```bash
cd server
npm install
```

### 2️⃣ Create `.env` in `/server`
```ini
PORT=8080
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=rating_app
JWT_SECRET=super-secret-demo-key
```

### 3️⃣ Create database
```sql
CREATE DATABASE rating_app;
```

Then run the schema to create tables:
```sql
USE rating_app;

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  address TEXT,
  role ENUM('SYSTEM_ADMIN', 'NORMAL_USER', 'STORE_OWNER') DEFAULT 'NORMAL_USER',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE stores (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  address TEXT,
  owner_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE ratings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  store_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_store (user_id, store_id)
);
```

### 4️⃣ Seed database
```bash
node seed.js
```

This creates:
- ✅ Admin account
- ✅ Store owner account  
- ✅ 2 normal users
- ✅ Demo stores
- ✅ Demo ratings

### 5️⃣ Start backend
```bash
npm run dev
```

**Runs at:**
```
http://localhost:8080
```

**Health check:**
```
http://localhost:8080/api/health
```

---

## 🖥️ Frontend Setup (React + Vite + Tailwind CSS)

### 1️⃣ Install dependencies
```bash
cd client
npm install
```

### 2️⃣ Create `.env` in `/client` (Optional)
```bash
VITE_API_URL=http://localhost:8080/api
```

### 3️⃣ Start frontend
```bash
npm run dev
```

**Runs at:**
```
http://localhost:5173
```

---

## 🔐 Demo Login Credentials (from seed.js)

### 👑 System Admin
```
Email: admin@local.test
Password: Admin@123
```

### 🏪 Store Owner
```
Email: owner1@example.com
Password: Owner@123
```

### 👤 Normal User 1
```
Email: testuser1@example.com
Password: Abcd@1234
```

### 👤 Normal User 2
```
Email: testuser2@example.com
Password: Abcd@2345
```

---

## 🎯 Features

### 👑 System Administrator
- ✅ Add new users (Admin / Store Owner / Normal User)
- ✅ Add new stores
- ✅ Dashboard displaying:
  - Total number of users
  - Total number of stores
  - Total number of submitted ratings
- ✅ View + filter all users (by name, email, address, role)
- ✅ View + filter all stores (by name, email, address)
- ✅ Pagination (10 items per page)
- ✅ View store owner ratings
- ✅ Change password
- ✅ Logout

### 👤 Normal User
- ✅ Sign up with validation
- ✅ Login to platform
- ✅ View all registered stores
- ✅ Search stores by name and address
- ✅ Submit ratings (1–5 stars) for stores
- ✅ Modify their submitted ratings
- ✅ Interactive rating modal with star selection
- ✅ Toast notifications for success/error
- ✅ Pagination (10 stores per page)
- ✅ Change password
- ✅ Logout

### 🏪 Store Owner
- ✅ Login to platform
- ✅ Dashboard showing:
  - List of owned stores with average ratings
  - List of users who rated their stores
  - Individual ratings per store
- ✅ View average rating for each store
- ✅ Change password
- ✅ Logout

---

## 🧱 Tech Stack

### Frontend
- ⚛️ **React** - UI library
- ⚡ **Vite** - Build tool
- 🎨 **Tailwind CSS** - Styling framework
- 🔄 **Axios** - HTTP client
- 🔐 **Context API** - State management
- 🎭 **Material-UI** - Avatar component

### Backend
- 🟢 **Node.js** - Runtime
- 🚀 **Express.js** - Web framework
- 🗄️ **MySQL** (mysql2) - Database
- 🔒 **JWT** - Authentication
- 🛡️ **Bcrypt** - Password hashing
- ✅ **Express Validator** - Input validation

---

## 🧪 How Reviewers Can Test

### Admin Testing
1. Login with admin credentials
2. Test creating new users and stores
3. Test filtering & sorting users/stores
4. View dashboard totals
5. Navigate through paginated results
6. Change password functionality

### Normal User Testing
1. Sign up with new account (follow validation rules)
2. Browse stores with pagination
3. Search stores by name/address
4. Submit ratings using star modal
5. Modify existing ratings
6. Check toast notifications
7. Change password

### Store Owner Testing
1. Login with store owner credentials
2. View owned stores and their ratings
3. Check list of raters
4. Verify average rating calculations
5. Change password

---

## 📜 Validation Rules

### User Registration
- **Name**: 20–60 characters
- **Email**: Valid email format
- **Address**: Maximum 400 characters
- **Password**: 8–16 characters + uppercase letter + special character

### Rating
- Must be between 1 and 5 (inclusive)
- One rating per user per store
- Can be modified after submission

---

## ✅ Run Order

1. **Start MySQL server**
   ```bash
   # Make sure MySQL is running
   ```

2. **Setup & start backend**
   ```bash
   cd server
   npm install
   # Create .env file
   # Create database and tables
   node seed.js
   npm run dev
   ```

3. **Setup & start frontend**
   ```bash
   cd client
   npm install
   # Create .env file (optional)
   npm run dev
   ```

4. **Login using demo accounts**
   - Open `http://localhost:5173`
   - Use credentials from the demo accounts section above

---

## 🎨 UI Theme

- **Dark Mode Design** - Modern dark theme with `#1a1a1a` background
- **Accent Color** - Soft yellow/beige (`#d4d4a8`) for buttons and highlights
- **Responsive Layout** - Mobile-friendly design
- **Interactive Elements** - Smooth transitions and hover effects
- **Toast Notifications** - Success/error feedback
- **Modal Dialogs** - For ratings and password changes

---

## 📁 Key Files

### Backend
```
server/
├── config/db.js           → MySQL connection pool
├── controllers/           → Business logic
├── middleware/            → Auth & role checks
├── routes/                → API endpoints
├── seed.js                → Demo data script
└── server.js              → Express app entry
```

### Frontend
```
client/
├── src/
│   ├── components/        → Reusable UI components
│   ├── contexts/          → React Context (Auth)
│   ├── pages/             → Route components
│   ├── services/          → API calls
│   └── lib/               → Axios instance
└── index.css              → Tailwind config
```

---

## 🔒 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Protected routes with role-based access
- ✅ Input validation on both client and server
- ✅ SQL injection prevention (parameterized queries)
- ✅ CORS configuration

---

