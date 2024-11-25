const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;
const jwtSecret = process.env.JWT_SECRET;

// Middleware
app.use(cors({
  origin: ['http://127.0.0.1:5501', 'https://korea-connect.onrender.com'] // Allow requests from this origin
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// PostgreSQL connection setup
const db = new Pool({
  connectionString: process.env.DB_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

db.connect()
  .then(() => console.log('Connected to PostgreSQL database.'))
  .catch((err) => console.error('Database connection error:', err));

// File upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to Korea Connect API');
});

// Create Event
app.post('/create-event', upload.single('eventPhoto'), (req, res) => {
  const { title, category, eventDate, eventTime, location, participants_limit, description } = req.body;
  const eventPhoto = req.file ? `/uploads/${req.file.filename}` : null;

  const query = `
    INSERT INTO events (title, event_photo, category, event_date, event_time, location, participants_limit, description)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
  `;
  db.query(query, [title, eventPhoto, category, eventDate, eventTime, location, participants_limit, description])
    .then((result) => res.status(201).json({ message: 'Event created successfully', event: result.rows[0] }))
    .catch((err) => {
      console.error('Error inserting event:', err);
      res.status(500).json({ message: 'Error creating event' });
    });
});

// Fetch Events
app.get('/events', (req, res) => {
  const query = 'SELECT * FROM events ORDER BY event_date, event_time';
  db.query(query)
    .then((results) => res.status(200).json(results.rows))
    .catch((err) => {
      console.error('Error fetching events:', err);
      res.status(500).json({ message: 'Error fetching events' });
    });
});

app.post('/signup', async (req, res) => {
  const { username, email, phone, country_code, nationality, password } = req.body;

  // Validate incoming data
  if (!username || !email || !phone || !country_code || !nationality || !password) {
    console.log('Validation failed'); 
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully')

    // Insert user into database
    const query = 'INSERT INTO users (username, email, phone, country_code, nationality, password) VALUES ($1, $2, $3, $4, $5, $6)';
     const result = await db.query(query, [username, email, phone, country_code, nationality, hashedPassword]);
    await db.query(query, [username, email, phone, country_code, nationality, hashedPassword]);
console.log('User inserted successfully:', result);
    // Send success response
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    console.error('Error during signup:', err);
    res.status(500).json({ message: 'Error registering user. Please try again.' });
  }
});




// Login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM users WHERE username = $1';
  db.query(query, [username])
    .then((results) => {
      if (results.rows.length === 0) {
        return res.status(401).json({ message: 'User not found' });
      }

      const user = results.rows[0];
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          console.error('Error comparing passwords:', err);
          return res.status(500).json({ message: 'Error checking password' });
        }

        if (!isMatch) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token, userProfile: user });
      });
    })
    .catch((err) => {
      console.error('Error during login:', err);
      res.status(500).json({ message: 'Error finding user' });
    });
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
