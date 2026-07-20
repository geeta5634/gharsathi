import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { users, bookings } from '@/lib/store';

const JWT_SECRET = process.env.JWT_SECRET || 'gharsathi-dev-secret-key';

export async function PUT(request, { params }) {
  try {
    const auth = request.headers.get('authorization');
    if (!auth || !auth.startsWith('Bearer ')) return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.get(decoded.id);
    if (!user) return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });

    const booking = bookings.get(params.id);
    if (!booking) return NextResponse.json({ success: false, message: 'Booking not found' }, { status: 404 });

    booking.status = 'cancelled';
    bookings.set(params.id, booking);

    return NextResponse.json({ success: true, data: booking });
  } catch {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
