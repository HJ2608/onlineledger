const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET_KEY; // store this in .env in production

// Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  try {
    await db.query('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)', [name, email, hash]);
    res.send({ success: true });
  } catch (err) {
    res.status(500).send('Registration failed');
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  const user = users[0];
  if (!user) return res.status(401).send('Invalid credentials');

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return res.status(401).send('Invalid credentials');

  const token = jwt.sign({ userId: user.id }, JWT_SECRET);
  res.send({ token });
});

module.exports = router;
