const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

dotenv.config(); // Load environment variables
const app = express();
const port = process.env.PORT || 4000;
const jwtSecret = process.env.JWT_SECRET;

// Middleware
app.use(cors({ origin: ['http://127.0.0.1:5501', 'https://korea-connect.onrender.com'] }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// PostgreSQL connection
const db = new Pool({
  connectionString: process.env.DB_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

db.connect()
  .then(() => console.log('Connected to Neon PostgreSQL database.'))
  .catch((err) => console.error('Error connecting to the database:', err));

// File upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage: storage });

// Routes
app.get('/', (req, res) => res.send('Welcome to Korea Connect API'));

app.get('/test-db', async (req, res) => {
  try {
    const result = await db.query('SELECT 1;');
    res.status(200).json({ message: 'Database connection successful!', result: result.rows });
  } catch (err) {
    res.status(500).json({ message: 'Database connection failed.', error: err.message });
  }
});

app.post('/create-event', upload.single('eventPhoto'), (req, res) => {
  const { title, category, eventDate, eventTime, location, participants_limit, description } = req.body;
  const eventPhoto = req.file ? `/uploads/${req.file.filename}` : null;

  const query = `
    INSERT INTO events (title, event_photo, category, event_date, event_time, location, participants_limit, description)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
  `;
  db.query(query, [title, eventPhoto, category, eventDate, eventTime, location, participants_limit, description])
    .then((result) => res.status(201).json({ message: 'Event created successfully', event: result.rows[0] }))
    .catch((err) => res.status(500).json({ message: 'Error creating event', error: err.message }));
});

app.get('/events', (req, res) => {
  const query = 'SELECT * FROM events ORDER BY event_date, event_time';
  db.query(query)
    .then((results) => res.status(200).json({ message: 'Events fetched successfully', events: results.rows }))
    .catch((err) => res.status(500).json({ message: 'Error fetching events', error: err.message }));
});

app.post('/signup', async (req, res) => {
  const { username, email, phone, country_code, nationality, password } = req.body;

  if (!username || !email || !phone || !country_code || !nationality || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
      INSERT INTO users (username, email, phone, country_code, nationality, password)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, username, email;
    `;
    const result = await db.query(query, [username, email, phone, country_code, nationality, hashedPassword]);
    res.status(201).json({ message: 'User registered successfully!', user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user. Please try again.', error: err.message });
  }
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM users WHERE username = $1';
  db.query(query, [username])
    .then((results) => {
      if (results.rows.length === 0) {
        return res.status(401).json({ message: 'User not found' });
      }

      const user = results.rows[0];
      bcrypt.compare(password, user.password)
        .then((isMatch) => {
          if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
          }
          const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '1h' });
          res.status(200).json({ message: 'Login successful', token, userProfile: user });
        })
        .catch((err) => res.status(500).json({ message: 'Error during login', error: err.message }));
    })
    .catch((err) => res.status(500).json({ message: 'Error finding user', error: err.message }));
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log('Attempting to connect to the database...');
});

