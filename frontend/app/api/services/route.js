import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { services, users } from '@/lib/store';

const JWT_SECRET = process.env.JWT_SECRET || 'gharsathi-dev-secret-key';

export async function GET() {
  const active = Array.from(services.values())
    .filter(s => s.isActive !== false)
    .sort((a, b) => (a.name || '').localeCompare(b.name || ''));

  return NextResponse.json({
    success: true,
    count: active.length,
    data: active
  });
}

export async function POST(request) {
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

    const { name, icon, description, basePrice, category } = await request.json();

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, errors: [{ msg: 'Service name is required' }] }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const id = crypto.randomUUID();
    const service = { _id: id, name, icon, description, basePrice: parseFloat(basePrice), category, slug, isActive: true, createdAt: new Date() };

    services.set(id, service);

    return NextResponse.json({ success: true, data: service }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
