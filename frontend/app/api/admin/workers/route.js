import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { users, workers } from '@/lib/store';

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

    const { searchParams } = new URL(request.url);
    const approved = searchParams.get('approved');

    let result = Array.from(workers.values());
    if (approved === 'false') result = result.filter(w => w.isApproved !== true);

    return NextResponse.json({ success: true, count: result.length, data: result });
  } catch {
    return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
  }
}
