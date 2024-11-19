const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: 'http://127.0.0.1:5501' // Allow requests from this origin
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'korea_connect',
  port: process.env.DB_PORT || 3308
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to the database.');
  }
});

// Route: Signup
app.post('/signup', (req, res) => {
  const { username, email, phone, country_code, nationality, password } = req.body;

  // Hash the password
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ message: 'Error hashing password' });

    // Insert user into database
    const query = 'INSERT INTO users (username, email, phone, country_code, nationality, password) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [username, email, phone, country_code, nationality, hashedPassword], (err, result) => {
      if (err) {
        console.error('Error inserting user:', err);
        return res.status(500).json({ message: 'Error registering user' });
      }
      res.status(201).json({ message: 'User registered successfully' });
    });
  });
});

app.get('/', (req, res) => {
  res.send('Welcome to Korea Connect API');
});

// Route: Login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Log the incoming request data for debugging
  console.log("Received login request:", req.body);

  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: 'Error finding user' });
    }

    if (results.length === 0) {
      console.log("User not found with username:", username);
      return res.status(401).json({ message: 'User not found' });
    }

    const user = results[0];

    // Compare the provided password with the stored hashed password
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error("Error comparing passwords:", err);
        return res.status(500).json({ message: 'Error checking password' });
      }

      if (!isMatch) {
        console.log("Invalid credentials for username:", username);
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Successful login
      console.log("Login successful for user:", username);
      res.status(200).json({ message: 'Login successful', userProfile: user });
    });
  });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
