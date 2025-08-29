const express = require('express');
const bcrypt = require('bcryptjs');
const connection = require('./database');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


app.use(express.static('public'));


app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// 1. CREATE USER ENDPOINT
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Please provide username, email, and password' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    
    const [results] = await connection.execute(sql, [username, email, hashedPassword]);
    res.status(201).json({ 
      message: 'User created successfully', 
      userId: results.insertId 
    });

  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// 2. GET ALL USERS ENDPOINT
app.get('/users', async (req, res) => {
  try {
    const sql = 'SELECT id, username, email FROM users';
    const [results] = await connection.execute(sql);
    res.json(results);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error fetching users' });
  }
});

// Serve frontend for all other routes (React Router support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Test database connection on startup
  connection.getConnection()
    .then(() => console.log('✅ Connected to MySQL database'))
    .catch(err => console.error('❌ Database connection failed:', err));
});