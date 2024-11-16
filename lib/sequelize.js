import { Sequelize } from 'sequelize';

// Initialize Sequelize with MySQL connection details
const sequelize = new Sequelize(
  process.env.DB_NAME || 'cms',  // Database name
  process.env.DB_USER || 'root',  // Database username
  process.env.DB_PASSWORD || '',  // Database password
  {
    host: process.env.DB_HOST || 'localhost',  // Database host
    dialect: 'mysql',  // Use MySQL dialect
    timezone: '+00:00',
    dialectModule: require('mysql2'),
    logging: console.log,     // Enable logging for Sequelize queries
  }
);

// Function to test the connection to the database
const testConnection = async () => {
  try {
    console.log('Attempting to connect to MySQL...');
    await sequelize.authenticate();
    console.log('Successfully connected to the MySQL database.');
  } catch (error) {
    console.error('Error connecting to MySQL:', error);
  }
};

// Function to sync the database (create tables if they don't exist)
// Optionally clear the User table or reset all tables
const syncDatabase = async () => {
  try {
    console.log('Syncing the database...');
    await sequelize.sync({ force: false });  // Change to 'true' for reset on every run
    console.log('Database synced!');
  } catch (error) {
    console.error('Error syncing the database:', error);
  }
};

// Initialize the database connection, sync, and seed on import
const initializeDatabase = async () => {
  try {
    console.log('Initializing database...');
    await testConnection();  // Test DB connection
    await syncDatabase();    // Sync database, clearing User table if necessary
    console.log('Database initialization completed.');
  } catch (error) {
    console.error('Error initializing the database:', error);
  }
};

// Initialize the database connection, sync, and seed on import
await initializeDatabase();

// Export the sequelize instance for use in other modules
export default sequelize;
