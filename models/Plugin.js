import { DataTypes } from 'sequelize';
import sequelize from '../lib/sequelize'; // Make sure to configure sequelize

const Plugin = sequelize.define('Plugin', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  version: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  timestamps: true,
});

// Create related tables for the plugin
Plugin.prototype.createRelatedTables = async function() {
  const pluginName = this.name;

  // Example: Dynamically create a plugin-specific table
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS ${pluginName}PluginData (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT NOT NULL,
      data JSON,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `;
  
  await sequelize.query(createTableQuery);
};

// Drop related tables for the plugin
Plugin.prototype.dropRelatedTables = async function() {
  const pluginName = this.name;

  // Example: Dynamically drop the plugin-specific table
  const dropTableQuery = `DROP TABLE IF EXISTS ${pluginName}PluginData;`;

  await sequelize.query(dropTableQuery);
};

// Activate the plugin (create related tables)
Plugin.prototype.activate = async function() {
  await this.createRelatedTables();
  this.isActive = true;
  await this.save();
};

// Deactivate the plugin (drop related tables)
Plugin.prototype.deactivate = async function() {
  await this.dropRelatedTables();
  this.isActive = false;
  await this.save();
};

sequelize.sync({ force: false });

export default Plugin;
