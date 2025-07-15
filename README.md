# 🛏️ Mattress Ledger

A full-stack ledger and inventory management system for mattress businesses, supporting multiple users with secure login, per-user data separation, inventory tracking, and export features.

---

## 🔧 Tech Stack

**Frontend:** React (Vite)  
**Backend:** Node.js, Express.js  
**Database:** MySQL  
**Authentication:** JWT  
**Export:** Excel (via `exceljs`, `file-saver`, `xlsx`)  

---

## 🚀 Features

- 🔐 **User Authentication** (Register/Login)
- 📊 **Summary Dashboard** (Sales, Purchases, Credits, Debits, Profit, Net Cash Flow)
- 🧾 **Transaction Management** (Purchase/Sale entries)
- 💼 **Ledger Management** (Credit/Debit entries)
- 📦 **Inventory Tracking** (real-time stock levels per product)
- 📥 **Export to Excel** (combined transaction + ledger data by date)
- 🎨 **Responsive UI/UX** (tab-based interface, hover effects, color-coded metrics)

---

## 📁 Folder Structure


---

## 🛠️ Setup Instructions

### 📦 Backend Setup

1. Navigate to `backend/`
2. Install dependencies:
   ```bash
   npm install

PORT=5000
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=ledger
JWT_SECRET_KEY=your_secure_secret

run server
npm run dev

frontend
npm install


dataschema 
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password_hash VARCHAR(255)
);

CREATE TABLE transactions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  type ENUM('purchase', 'sale'),
  product VARCHAR(100),
  quantity INT,
  buy_price DECIMAL(10,2),
  sell_price DECIMAL(10,2),
  notes TEXT,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE ledger_entries (
  id INT PRIMARY KEY AUTO_INCREMENT,
  type VARCHAR(100),
  description TEXT,
  amount DECIMAL(10,2),
  direction ENUM('credit', 'debit'),
  notes TEXT,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
