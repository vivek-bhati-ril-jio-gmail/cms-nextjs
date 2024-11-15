// app/api/auth/login/route.js
export const runtime = 'nodejs';  // Ensures the route uses Node.js runtime

import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import Users from '../../../../models/User';  // Adjust path as needed
import jwt from 'jsonwebtoken';

export async function POST(req) {
  const { password, email } = await req.json();

  // Ensure both email and password are provided
  if (!email || !password) {
    return NextResponse.json({ msg: 'Please provide both email and password' }, {
      status: 400,
    });
  }

  try {
    const user = await Users.findOne({
      where: {
        email,  // Directly use email as key-value pair
      },
    });

    // If the user doesn't exist, return an error
    if (!user) {
      return NextResponse.json({ msg: 'User does not exist' }, { status: 401 });
    }

    // Compare the hashed password with the provided password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ msg: 'Invalid credentials' }, { status: 401 });
    }

    const userData = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    // Create JWT with the user data to be used for authentication
    const token = jwt.sign(
      {userData: userData},  // Include only necessary user data
      process.env.JWT_SECRET,
      { expiresIn: '1d' }  // Token expiry
    );

    // Send the token in the response and set it in a secure cookie
    return NextResponse.json({ msg: 'Login successful', auth_token: token }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ msg: 'Error logging in' }, { status: 500 });
  }
}
