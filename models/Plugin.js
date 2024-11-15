// models/Plugin.js
import { DataTypes } from 'sequelize';
import sequelize from '../lib/sequelize'; // Adjust path as needed

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

sequelize.sync({ force: false })

export default Plugin;
