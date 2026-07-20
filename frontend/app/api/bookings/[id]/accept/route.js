import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { users, workers, bookings } from '@/lib/store';

const JWT_SECRET = process.env.JWT_SECRET || 'gharsathi-dev-secret-key';

export async function PUT(request, { params }) {
  try {
    const auth = request.headers.get('authorization');
    if (!auth || !auth.startsWith('Bearer ')) return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.get(decoded.id);
    if (!user || user.role !== 'worker') return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });

    const booking = bookings.get(params.id);
    if (!booking) return NextResponse.json({ success: false, message: 'Booking not found' }, { status: 404 });

    const wp = Array.from(workers.values()).find(w => w.user === user._id);
    booking.worker = wp?._id;
    booking.status = 'in_progress';
    bookings.set(params.id, booking);

    return NextResponse.json({ success: true, data: booking });
  } catch {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
