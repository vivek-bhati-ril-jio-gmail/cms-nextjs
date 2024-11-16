// app/api/auth/login/route.js
export const runtime = 'nodejs';  // Ensures the route uses Node.js runtime

import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import Users from '../../../../models/User';  // Adjust path as needed
import { Op } from 'sequelize';  // Import Sequelize operators
import jwt from 'jsonwebtoken';

export async function POST(req) {
  const { password, email } = await req.json();

  // Ensure at least one of username or email is provided along with password
  if (!email || !password) {
    return NextResponse.json({ msg: 'Please provide both email and password' }, {
      status: 400,
    });
  }

  try {
    // Find the user by username or email
    const user = await Users.findOne({
      where: {
        email,
      },
    });

    // If the user doesn't exist, return an error
    if (!user) {
      return NextResponse.json({ msg: 'User does not exist' }, { status: 401 });
    }

    // Compare the hashed password with the provided password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // If the password doesn't match, return an error
    if (!isPasswordValid) {
      return NextResponse.json({ msg: 'Invalid credentials' }, { status: 401 });
    }

    // Create JWT token with user data
    const token = jwt.sign(
      { user },  // User data to include in the token
      process.env.JWT_SECRET,  // Secret key for signing the JWT
      { expiresIn: '1d' }  // Expiry time for the token (1 day)
    );

    return NextResponse.json({ msg: 'Login successful', auth_token: token }, { status: 200 });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ msg: 'Error logging in' }, { status: 500 });
  }
}
