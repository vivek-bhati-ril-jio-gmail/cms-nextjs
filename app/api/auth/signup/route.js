// app/api/auth/signup/route.js
export const runtime = 'nodejs';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import Users from '../../../../models/User';  // Adjust path as needed
import { Op } from 'sequelize';  // Import Sequelize operators

export async function POST(req) {
  const { username, password, email, role } = await req.json();

  // Ensure all required fields are provided
  if (!username || !email || !password || !role) {
    return NextResponse.json({ msg: 'Please provide all: username, email, and password' }, {
      status: 400,
    });
  }

  try {
    // Check if the user already exists (based on username or email)
    const existingUser = await Users.findOne({
      where: {
        [Op.or]: [{ username }, { email }],
      },
    });

    if (existingUser) {
      return NextResponse.json({ msg: 'User with this username or email already exists' }, {
        status: 400,
      });
    }

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await Users.create({
      username,
      email,
      password: hashedPassword,
      role,
      isActive: true,   // Assuming new users are active by default
      isBlocked: false, // Assuming new users are not blocked by default
    });

    // Return success response with the new user details
    return NextResponse.json({ msg: 'User created successfully', user: newUser }, { status: 201 });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ msg: 'Error creating user' }, { status: 500 });
  }
}