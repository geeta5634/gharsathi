import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { services, users } from '@/lib/store';

const JWT_SECRET = process.env.JWT_SECRET || 'gharsathi-dev-secret-key';

export async function GET(request, { params }) {
  const service = services.get(params.id);
  if (!service) {
    return NextResponse.json({ success: false, message: 'Service not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: service });
}

export async function PUT(request, { params }) {
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

    const existing = services.get(params.id);
    if (!existing) {
      return NextResponse.json({ success: false, message: 'Service not found' }, { status: 404 });
    }

    const updates = await request.json();
    const updated = { ...existing, ...updates };
    services.set(params.id, updated);
    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
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

    const existing = services.get(params.id);
    if (!existing) {
      return NextResponse.json({ success: false, message: 'Service not found' }, { status: 404 });
    }

    services.delete(params.id);
    return NextResponse.json({ success: true, message: 'Service deleted successfully' });
  } catch {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
