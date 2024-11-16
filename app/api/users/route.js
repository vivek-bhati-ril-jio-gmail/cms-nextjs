import User from '../../../models/User'; // Import the User model
import { NextResponse } from 'next/server'; // Import NextResponse

// Handle GET request - Get all users
export async function GET(req) {
  try {
    const users = await User.findAll(); // Get all users from the database
    return NextResponse.json(users); // Send the users data as a response
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching users' }, { status: 500 }); // Handle errors
  }
}

// Handle POST request - Create a new user
export async function POST(req) {
  const { username, email, password, role, isActive } = await req.json(); // Get data from request body

  // Validate the required fields
  if (!username || !email || !password || !role) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  try {
    const newUser = await User.create({
      username, email, password, role, isActive
    });
    return NextResponse.json(newUser, { status: 201 }); // Respond with the created user
  } catch (error) {
    return NextResponse.json({ error: 'Error creating user' }, { status: 500 }); // Handle errors
  }
}
