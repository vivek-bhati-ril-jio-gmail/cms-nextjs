const { Sequelize } = require('sequelize');

// Initialize Sequelize with MySQL connection details
const sequelize = new Sequelize(
  process.env.DB_NAME || 'cms', // Database name
  process.env.DB_USER || 'root', // Database username
  process.env.DB_PASSWORD || '', // Database password
  {
    host: process.env.DB_HOST || 'localhost', // Database host
    dialect: 'mysql', // Using MySQL
  }
);

// Test the connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Successfully connected to the MySQL database.');
  } catch (error) {
    console.error('Error connecting to MySQL:', error);
  }
}

testConnection();