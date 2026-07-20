import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { users, bookings } from '@/lib/store';

const JWT_SECRET = process.env.JWT_SECRET || 'gharsathi-dev-secret-key';

export async function GET(request) {
  try {
    const auth = request.headers.get('authorization');
    if (!auth || !auth.startsWith('Bearer ')) return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.get(decoded.id);
    if (!user || user.role !== 'worker') return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });

    const result = Array.from(bookings.values()).filter(b => !b.worker && b.status === 'pending');
    return NextResponse.json({ success: true, count: result.length, data: result });
  } catch {
    return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
  }
}
