// app/api/auth/signup/route.js
import bcrypt from 'bcryptjs';
import Users from '../../../lib/models/User';

export async function POST(req) {
  const { username, password, email, role } = await req.json();

  if (!username || !email || !password || !role) {
    return new Response(JSON.stringify({ msg: 'Please provide all: username, email, and password' }), {
      status: 400,
    });
  }

  try {
    // Check if the member already exists
    const existingMember = await Users.findOne({
      where: { [Op.or]: [{ username }, { email }] },
    });

    if (existingMember) {
      return new Response(JSON.stringify({ msg: 'User with this username or email already exists' }), {
        status: 400,
      });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new member
    const member = await Users.create({
      username: username,
      email: email,
      password: hashedPassword,
      role: role,
      isActive: true,
      isBlocked: false,
    });

    return new Response(JSON.stringify({ msg: 'User creation requested successfully', member }), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ msg: 'Error creating user' }), { status: 500 });
  }
}
