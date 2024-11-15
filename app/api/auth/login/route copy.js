// app/api/auth/login/route.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Users from '../../../../models/User';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { msg: 'Please provide both email and password' },
      { status: 400 }
    );
  }

  try {
    const user = await Users.findOne({ where: { email } });

    if (!user) {
      return NextResponse.json({ msg: 'User does not exist' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ msg: 'Invalid credentials' }, { status: 401 });
    }

    // Generate the JWT token (you can add more info to the payload as needed)
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    const cookie = `auth_token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=3600`;

    const response = NextResponse.json({ msg: 'Login successful' });
    response.headers.set('Set-Cookie', cookie);

    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ msg: 'Error logging in' }, { status: 500 });
  }
}
