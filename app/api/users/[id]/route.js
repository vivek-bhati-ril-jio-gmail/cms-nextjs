import User from '../../../../models/User'; // Import the User model
import { NextResponse } from 'next/server'; // Import NextResponse
import bcrypt from 'bcryptjs'; // For password hashing

// Handle GET request - Get user by ID
export async function GET(req) {
  const urlParts = req.url.split('/'); // Split the URL by slashes
  const id = urlParts[urlParts.length - 1]; // Get the last value

  try {
    const user = await User.findByPk(id); // Find the user by primary key
    user.password = "";
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(user); // Return the user data
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching user' }, { status: 500 });
  }
}

// Handle PUT request - Update user by ID
export async function PUT(req) {
  const urlParts = req.url.split('/'); // Split the URL by slashes
  const id = urlParts[urlParts.length - 1]; // Get the last value
  const { username, email, password, role, isActive } = await req.json(); // Parse the request body

  try {
    const user = await User.findByPk(id); // Find the user by primary key
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update the user with the provided data
    user.username = username || user.username;
    user.email = email || user.email;
    // Check if the new password is provided (not empty)
    if (password) {
      // Hash the password only if it's not empty
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword; // Update the user's password with the hashed value
    } else {
      // Don't update the password if it's empty, retain the old password
      user.password = user.password; // Keep the current password
    }
    user.role = role || user.role;
    user.isActive = isActive !== undefined ? isActive : user.isActive;

    await user.save(); // Save the updated user
    return NextResponse.json(user); // Return the updated user
  } catch (error) {
    return NextResponse.json({ error: 'Error updating user' }, { status: 500 });
  }
}

// Handle DELETE request - Delete user by ID
export async function DELETE(req) {
  const urlParts = req.url.split('/'); // Split the URL by slashes
  const id = urlParts[urlParts.length - 1]; // Get the last value

  try {
    const user = await User.findByPk(id); // Find the user by primary key
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await user.destroy(); // Delete the user from the database
    return NextResponse.json({ message: 'User deleted successfully' }); // Confirm deletion
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting user' }, { status: 500 });
  }
}
