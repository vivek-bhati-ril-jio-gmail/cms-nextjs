import { DataTypes } from 'sequelize';
import sequelize from '../connection'; // Import the Sequelize instance

// Define the User model
const User = sequelize.define('User', {
  // ID of the user, who has approved this user.
  approved_by: {
    type: DataTypes.INTEGER,
    allowNull: false, // cannot be null
    defaultValue: -1, // Default value is -1 (indicating not approved yet)
    comment: 'The ID of the user who has approved this user.',
  },

  // The username of the user. This should be unique and cannot be empty.
  username: {
    type: DataTypes.STRING,
    allowNull: false, // Username cannot be null
    unique: true, // Ensures the username is unique across the table
    validate: {
      notEmpty: true, // Prevents empty username
    },
    comment: 'The unique identifier for the user, cannot be empty and must be unique.',
  },

  // The email of the user. This is also unique and cannot be empty.
  email: {
    type: DataTypes.STRING,
    allowNull: false, // Email cannot be null
    unique: true, // Ensures the email is unique across the table
    validate: {
      notEmpty: true, // Prevents empty email
    },
    comment: 'The unique email address of the user, must be unique and cannot be empty.',
  },

  // The password of the user. It cannot be null or empty.
  password: {
    type: DataTypes.STRING,
    allowNull: false, // Password cannot be null
    validate: {
      notEmpty: true, // Prevents empty password
    },
    comment: 'The password for the user account, cannot be empty.',
  },

  // The role of the user. This is an ENUM with specific allowed values.
  role: {
    type: DataTypes.ENUM('authenticated', 'content_editor', 'admin', 'super_admin'),
    allowNull: false, // Role cannot be null
    comment: 'The role of the user. Can be "authenticated", "content_editor", "admin", or "super_admin".',
  },

  // Boolean field indicating if the user's account is active. Default value is true (active).
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false, // isActive cannot be null
    defaultValue: true, // Default value is true, meaning the user is active by default
    comment: 'Indicates if the user is active. Defaults to true (active).',
  },

  // Boolean field indicating if the user is blocked. Default value is false (not blocked).
  isBlocked: {
    type: DataTypes.BOOLEAN,
    allowNull: false, // isBlocked cannot be null
    defaultValue: false, // Default value is false, meaning the user is not blocked
    comment: 'Indicates if the user is blocked. Defaults to false (not blocked).',
  },

  // Status of the user, represented by an ENUM with values 0, 1, 2, and 3.
  status: {
    type: DataTypes.ENUM('0', '1', '2', '3'), // ENUM for status
    allowNull: false, // status cannot be null
    defaultValue: '0', // Default value is '0' (pending)
    comment: 'Status of the user. 0 - Pending, 1 - Approved, 2 - Rejected, 3 - Suspended.',
  },

  // Timestamp for when the request was made (in Unix timestamp format). Can be null.
  requestedAt: {
    type: DataTypes.INTEGER,
    allowNull: true, // Can be null if not set
    comment: 'Unix timestamp when the request was made (null if not set).',
  },

  // Timestamp for when the user was registered (in Unix timestamp format). Cannot be null.
  registeredAt: {
    type: DataTypes.INTEGER,
    allowNull: false, // Must be set when registering the user
    defaultValue: () => Math.floor(Date.now() / 1000), // Default to current Unix timestamp
    comment: 'Unix timestamp when the user registered (cannot be null).',
  },

  // Timestamp for when the user details were last updated (in Unix timestamp format). Can be null.
  updatedAt: {
    type: DataTypes.INTEGER,
    allowNull: true, // Can be null if not updated
    comment: 'Unix timestamp when the user was last updated (null if not updated).',
  },
});

// Adding hooks to automatically update the timestamps
User.beforeCreate((user) => {
  const currentUnixTimestamp = Math.floor(Date.now() / 1000); // Get current Unix timestamp
  if (!user.requestedAt) {
    user.requestedAt = currentUnixTimestamp; // Set requested timestamp if not provided
  }
  if (!user.registeredAt) {
    user.registeredAt = currentUnixTimestamp; // Set registered timestamp if not provided
  }
});

User.beforeUpdate((user) => {
  const currentUnixTimestamp = Math.floor(Date.now() / 1000); // Get current Unix timestamp
  user.updatedAt = currentUnixTimestamp; // Set the updated timestamp to current timestamp
});

// Export the User model
export default User;
