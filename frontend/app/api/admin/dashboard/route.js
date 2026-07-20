import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { users, services, workers, bookings } from '@/lib/store';

const JWT_SECRET = process.env.JWT_SECRET || 'gharsathi-dev-secret-key';

export async function GET(request) {
  try {
    const auth = request.headers.get('authorization');
    if (!auth || !auth.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
    }
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.get(decoded.id);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
    }

    const allBookings = Array.from(bookings.values());
    const completed = allBookings.filter(b => b.status === 'completed');
    const totalRevenue = completed.reduce((sum, b) => sum + (b.price?.total || 0), 0);

    const data = {
      totalUsers: users.size,
      totalWorkers: workers.size,
      totalBookings: allBookings.length,
      totalRevenue,
      recentBookings: allBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5),
    };

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
  }
}
