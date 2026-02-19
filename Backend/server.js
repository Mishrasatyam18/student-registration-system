const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
require('dotenv').config();   // Load environment variables

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL connection using environment variables
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL Connected...');
});

// Create table if not exists
db.query(`CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fullname VARCHAR(100),
  roll VARCHAR(50),
  email VARCHAR(100),
  password VARCHAR(255),
  address TEXT
)`, (err) => {
  if (err) throw err;
});

// Registration route
app.post('/register', async (req, res) => {
  const { fullname, roll, email, password, address } = req.body;

  if (!fullname || !roll || !email || !password || !address) {
    return res.send('All fields are required!');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.send('Invalid email format!');
  }

  // Hash password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    'INSERT INTO students (fullname, roll, email, password, address) VALUES (?, ?, ?, ?, ?)',
    [fullname, roll, email, hashedPassword, address],
    (err) => {
      if (err) throw err;
      res.send('Registration successful!');
    }
  );
});

// Start server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});