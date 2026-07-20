import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { users, workers, bookings } from '@/lib/store';

const JWT_SECRET = process.env.JWT_SECRET || 'gharsathi-dev-secret-key';

export async function GET(request) {
  try {
    const auth = request.headers.get('authorization');
    if (!auth || !auth.startsWith('Bearer ')) return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.get(decoded.id);
    if (!user || user.role !== 'worker') return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });

    const wp = Array.from(workers.values()).find(w => w.user === user._id);
    if (!wp) return NextResponse.json({ success: false, data: null });

    const workerBookings = Array.from(bookings.values()).filter(b => b.worker === wp._id);
    const completed = workerBookings.filter(b => b.status === 'completed');

    const data = {
      ...wp,
      user: { _id: user._id, name: user.name, phone: user.phone, email: user.email, role: user.role },
      bookings: { total: workerBookings.length, completed: completed.length, pending: workerBookings.filter(b => b.status === 'pending').length, active: workerBookings.filter(b => b.status === 'in_progress').length },
      earnings: wp.earnings || { total: 0, thisMonth: 0, lastPayout: 0 },
    };

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
  }
}
