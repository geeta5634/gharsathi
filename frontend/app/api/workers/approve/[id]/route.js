import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { users, workers } from '@/lib/store';

const JWT_SECRET = process.env.JWT_SECRET || 'gharsathi-dev-secret-key';

export async function PUT(request, { params }) {
  try {
    const auth = request.headers.get('authorization');
    if (!auth || !auth.startsWith('Bearer ')) return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.get(decoded.id);
    if (!user || user.role !== 'admin') return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });

    const wp = workers.get(params.id);
    if (!wp) return NextResponse.json({ success: false, message: 'Worker not found' }, { status: 404 });

    wp.isApproved = true;
    workers.set(params.id, wp);

    return NextResponse.json({ success: true, data: wp });
  } catch {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
