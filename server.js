const express = require('express');
const session = require('express-session');
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
// Middleware to parse JSON bodies (for login form submission)
app.use(express.json());

// PostgreSQL connection
const db = new Pool({
  connectionString: process.env.DATABASE_URL, // Supabase connection string
  ssl: {
    rejectUnauthorized: false, // Allow self-signed certificates
  },
});

const pgSession = require('connect-pg-simple')(session);
// Session middleware setup
app.use(session({
  store: new pgSession({
    pool: db, // Use your existing PostgreSQL pool
  }),
    secret: 'admin123', // Change this to a random secret key
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, sameSite: 'none',maxAge: 24 * 60 * 60 * 1000, httpOnly: true,},  // Set 'secure: true' if using https
}));


// Middleware
app.use(cors({ origin: ['http://127.0.0.1:5501', 'https://korea-connect.onrender.com'], credentials:true, }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Serve static files (HTML, CSS, images, etc.) from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));



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
// Serve the index page (as static file or route)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route for the login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Route for the signup page
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

// Route to get the currently logged-in user
app.get('/user', (req, res) => {
  if (req.session && req.session.user) {
    // If a session exists, return the user data
    res.status(200).json(req.session.user);
  } else {
    // If no session exists, return an unauthorized error
    res.status(401).json({ message: 'Unauthorized: No active session' });
  }
});


// Test database connection
app.get('/test-db', async (req, res) => {
  try {
    const result = await db.query('SELECT 1;');
    res.status(200).json({ message: 'Database connection successful!', result: result.rows });
  } catch (err) {
    res.status(500).json({ message: 'Database connection failed.', error: err.message });
  }
});

// Route to create an event
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

// Route to fetch all events
app.get('/events', (req, res) => {
  const query = 'SELECT * FROM events ORDER BY event_date, event_time';
  db.query(query)
    .then((results) => res.status(200).json({ message: 'Events fetched successfully', events: results.rows }))
    .catch((err) => res.status(500).json({ message: 'Error fetching events', error: err.message }));
});

// Route to signup a new user
app.post('/signup', async (req, res) => {
  const { username, email, phone, country_code, nationality, password } = req.body;

  if (!username || !email || !phone || !country_code || !nationality || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
      INSERT INTO public.users (username, email, phone, country_code, nationality, password)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, username, email;
    `;
    const result = await db.query(query, [username, email, phone, country_code, nationality, hashedPassword]);
    res.status(201).json({ message: 'User registered successfully!', user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user. Please try again.', error: err.message });
  }
});

// Route to login a user
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM public.users WHERE username = $1';
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
          // Store user information in the session
            req.session.user = { id: user.id, username: user.username, email: user.email };
          res.status(200).json({ message: 'Login successful', token, userProfile: user });
        })
        .catch((err) => res.status(500).json({ message: 'Error during login', error: err.message }));
    })
    .catch((err) => res.status(500).json({ message: 'Error finding user', error: err.message }));
});

app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Logout successful' });
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log('Attempting to connect to the database...');
});
