// lib/sequelize.js
import { Sequelize } from 'sequelize';
import createSuperAdmin from './seeders/superAdminSeeder'

// Initialize Sequelize with MySQL connection details
const sequelize = new Sequelize(
  process.env.DB_NAME || 'cms',  // Database name
  process.env.DB_USER || 'root',  // Database username
  process.env.DB_PASSWORD || '',  // Database password
  {
    host: process.env.DB_HOST || 'localhost',  // Database host
    dialect: 'mysql',  // Use MySQL dialect
    logging: false,     // Disable query logging
  }
);

// Function to test the connection to the database
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Successfully connected to the MySQL database.');
  } catch (error) {
    console.error('Error connecting to MySQL:', error);
  }
};

// Function to sync the database (create tables if they don't exist)
const syncDatabase = async () => {
  try {
    // Sync all defined models to the database
    await sequelize.sync({ force: false });  // Set force: true to reset the table on every start
    console.log('Database synced!');
  } catch (error) {
    console.error('Error syncing the database:', error);
  }
};

// Execute functions to ensure connection, sync, and seeding happen when the file is imported
const initializeDatabase = async () => {
  await testConnection();
  await syncDatabase();
  await createSuperAdmin();  // Add seeding after syncing the database
};

// Initialize the database connection, sync, and seed on import
initializeDatabase();

// Export the sequelize instance for use in other modules
export default sequelize;
