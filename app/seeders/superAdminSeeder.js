// lib/seeders/superAdminSeeder.js
import User from '../../models/User'; // Import the User model
import bcrypt from 'bcryptjs'; // For password hashing

const createSuperAdmin = async () => {
  try {
    // Check if the super admin already exists
    const existingAdmin = await User.findOne({ where: { role: 'super_admin' } });

    if (existingAdmin) {
      console.log('Super admin already exists.');
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('admin', 10); // Super admin password

    // Create a new super admin
    await User.create({
      username: 'admin', // Super admin username
      email: 'admin@cms.com', // Super admin email
      password: hashedPassword, // Hashed password
      role: 'super_admin', // Role of super admin
      isActive: true, // Make sure it's active
      isBlocked: false, // Super admin is not blocked
      status: '1', // Approved status
      requestedAt: Math.floor(Date.now() / 1000), // Current timestamp
      registeredAt: Math.floor(Date.now() / 1000), // Current timestamp
      updatedAt: Math.floor(Date.now() / 1000), // Current timestamp
    });

    console.log('Super admin created successfully.');
  } catch (error) {
    console.error('Error creating super admin:', error);
  }
};

export default createSuperAdmin;
