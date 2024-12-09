const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors({ origin: ['https://korea-connect.onrender.com'], credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));

// PostgreSQL connection
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

db.connect()
  .then(() => console.log('Connected to Supabase PostgreSQL database.'))
  .catch((err) => console.error('Error connecting to the database:', err));

// File upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage: storage });

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

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

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
