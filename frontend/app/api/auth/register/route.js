import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { users, hashPassword } from '@/lib/store';

const JWT_SECRET = process.env.JWT_SECRET || 'gharsathi-dev-secret-key';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

export async function POST(request) {
  try {
    const { name, email, phone, password, role } = await request.json();

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, errors: [{ msg: 'Name is required' }] }, { status: 400 });
    }
    if (!password || password.length < 6) {
      return NextResponse.json({ success: false, errors: [{ msg: 'Password must be at least 6 characters' }] }, { status: 400 });
    }

    if (phone) {
      const normalizedPhone = phone.replace(/[\s\-\+\(\)]/g, '').replace(/^91/, '');
      const existing = Array.from(users.values()).find(u => u.phone === normalizedPhone);
      if (existing) {
        return NextResponse.json({ success: false, message: 'User with this phone number already exists' }, { status: 400 });
      }
    }

    if (email) {
      const existing = Array.from(users.values()).find(u => u.email === email);
      if (existing) {
        return NextResponse.json({ success: false, message: 'User with this email already exists' }, { status: 400 });
      }
    }

    const id = crypto.randomUUID();
    const userData = {
      _id: id,
      name,
      phone: phone ? phone.replace(/[\s\-\+\(\)]/g, '').replace(/^91/, '') : '',
      password: hashPassword(password),
      role: role || 'customer',
      email: email || undefined,
      isVerified: true,
      avatar: '',
      address: { street: '', city: '', state: '', pincode: '' },
      createdAt: new Date(),
    };

    users.set(id, userData);

    const token = jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });

    const { password: _, ...safeUser } = userData;

    return NextResponse.json({
      success: true,
      data: { user: safeUser, token }
    }, { status: 201 });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ success: false, message: 'Server error during registration' }, { status: 500 });
  }
}
