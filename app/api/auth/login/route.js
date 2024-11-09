// app/api/auth/login/route.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Users from '../../../lib/models/User';

export async function POST(req) {
  const { username, email, password } = await req.json();

  try {
    const user = await Users.findOne({ where: { username } });

    if (!user) {
      user = await Users.findOne({ where: { username } });
      if (!user) {
        return new Response(JSON.stringify({ msg: 'No user exists' }), { status: 401 });
      }
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return new Response(JSON.stringify({ msg: 'Invalid password' }), { status: 401 });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return new Response(
      JSON.stringify({ jwt: token, role: user.role }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ msg: 'Server error' }), { status: 500 });
  }
}
