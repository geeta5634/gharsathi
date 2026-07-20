import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { users, comparePassword } from '@/lib/store';

const JWT_SECRET = process.env.JWT_SECRET || 'gharsathi-dev-secret-key';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!password) {
      return NextResponse.json({ success: false, message: 'Password is required' }, { status: 400 });
    }

    let user = null;
    if (email) {
      user = Array.from(users.values()).find(u => u.email === email);
    }

    if (!user) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    const isMatch = comparePassword(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });

    const { password: _, ...safeUser } = user;

    return NextResponse.json({
      success: true,
      data: { user: safeUser, token }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, message: 'Server error during login' }, { status: 500 });
  }
}
