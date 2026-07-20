import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { users } from '@/lib/store';

const JWT_SECRET = process.env.JWT_SECRET || 'gharsathi-dev-secret-key';

export async function PUT(request) {
  try {
    const auth = request.headers.get('authorization');
    if (!auth || !auth.startsWith('Bearer ')) return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.get(decoded.id);
    if (!user) return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });

    const updates = await request.json();
    Object.assign(user, updates);
    users.set(user._id, user);

    const { password: _, ...safeUser } = user;
    return NextResponse.json({ success: true, data: safeUser });
  } catch {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
