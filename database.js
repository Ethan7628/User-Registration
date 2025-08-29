const mysql = require('mysql2/promise');

// Use Railway's environment variables
const connection = mysql.createPool({
  host: process.env.MYSQLHOST,
  port: process.env.MYSQLPORT,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

connection.getConnection()
  .then(() => console.log('✅ Connected to MySQL on Railway'))
  .catch(err => console.error('❌ MySQL connection failed:', err));

module.exports = connection;