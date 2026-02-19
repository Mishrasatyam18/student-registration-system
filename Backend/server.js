const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',       
  password: 'satyaM@123',       
  database: 'studentdb'
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL Connected...');
});

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


app.post('/register', async (req, res) => {
  const { fullname, roll, email, password, address } = req.body;


  if (!fullname || !roll || !email || !password || !address) {
    return res.send('All fields are required!');
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.send('Invalid email format!');
  }

  
  const hashedPassword = await bcrypt.hash(password, 10);

 
  db.query('INSERT INTO students (fullname, roll, email, password, address) VALUES (?, ?, ?, ?, ?)',
    [fullname, roll, email, hashedPassword, address],
    (err) => {
      if (err) throw err;
      res.send('Registration successful!');
    }
  );
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});