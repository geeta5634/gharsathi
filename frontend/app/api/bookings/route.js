import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { bookings, users, services, workers } from '@/lib/store';

const JWT_SECRET = process.env.JWT_SECRET || 'gharsathi-dev-secret-key';

function getUserFromToken(request) {
  const auth = request.headers.get('authorization');
  if (!auth || !auth.startsWith('Bearer ')) return null;
  try {
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    return users.get(decoded.id);
  } catch {
    return null;
  }
}

export async function GET(request) {
  const user = getUserFromToken(request);
  if (!user) {
    return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit')) || 50;

  let result = Array.from(bookings.values());

  if (user.role === 'customer') {
    result = result.filter(b => b.customer === user._id);
  } else if (user.role === 'worker') {
    const wp = Array.from(workers.values()).find(w => w.user === user._id);
    if (wp) result = result.filter(b => b.worker === wp._id);
  }

  const total = result.length;
  result = result.slice(0, limit);

  return NextResponse.json({ success: true, count: result.length, total, data: result });
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function toUTC(dateStr, timeStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const [hh, mm] = (timeStr || '00:00').split(':').map(Number);
  return new Date(Date.UTC(y, m - 1, d, hh, mm));
}

function hasSlotConflict(workerId, dateStr, timeStr) {
  const wp = Array.from(workers.values()).find(w => w._id === workerId);
  if (!wp) return 'Worker not found';

  if (!wp.availability?.isAvailable) return 'Worker is not available';

  const date = new Date(dateStr + 'T00:00:00');
  const dayName = DAYS[date.getDay()];

  const daySlots = wp.availability.slots?.filter(s => s.day === dayName);
  if (!daySlots || daySlots.length === 0) return 'Worker is not available on this day';

  const [hh, mm] = timeStr.split(':').map(Number);
  const bookingMinutes = hh * 60 + mm;

  const inAnySlot = daySlots.some(s => {
    const [sh, sm] = s.startTime.split(':').map(Number);
    const [eh, em] = s.endTime.split(':').map(Number);
    const startMin = sh * 60 + sm;
    const endMin = eh * 60 + em;
    return bookingMinutes >= startMin && bookingMinutes + 60 <= endMin;
  });

  if (!inAnySlot) return 'Selected time is outside worker\'s available hours';

  const bookingStart = toUTC(dateStr, timeStr);
  const bookingEnd = new Date(bookingStart.getTime() + 60 * 60 * 1000);

  for (const b of bookings.values()) {
    if (b.worker !== workerId || b.status === 'cancelled') continue;
    if (!b.scheduledDate || !b.scheduledTime) continue;

    const existingStart = toUTC(
      b.scheduledDate instanceof Date ? b.scheduledDate.toISOString().split('T')[0] : String(b.scheduledDate).split('T')[0],
      b.scheduledTime
    );
    const existingEnd = new Date(existingStart.getTime() + 60 * 60 * 1000);

    if (bookingStart < existingEnd && bookingEnd > existingStart) {
      return 'Worker already has a booking during this time slot';
    }
  }

  return null;
}

export async function POST(request) {
  const user = getUserFromToken(request);
  if (!user) {
    return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const serviceId = data.serviceId || data.service;
    const svc = services.get(serviceId);
    const basePrice = svc?.basePrice || 249;

    if (data.worker) {
      const conflict = hasSlotConflict(data.worker, data.scheduledDate, data.scheduledTime);
      if (conflict) {
        return NextResponse.json({ success: false, message: conflict }, { status: 409 });
      }
    }

    const id = crypto.randomUUID();
    const bookingDate = data.scheduledDate ? toUTC(data.scheduledDate, data.scheduledTime) : undefined;

    const booking = {
      _id: id,
      customer: user._id,
      worker: data.worker || null,
      service: serviceId,
      status: 'pending',
      address: data.address || {
        street: data.address || '',
        city: data.city || '',
        state: data.state || '',
        pincode: data.pincode || '',
      },
      description: data.description || '',
      scheduledDate: bookingDate,
      scheduledTime: data.scheduledTime || undefined,
      isEmergency: data.isEmergency || false,
      price: { basePrice, additionalCharges: 0, discount: 0, total: basePrice + (data.isEmergency ? 100 : 0) },
      payment: { method: data.paymentMethod || 'cash', status: 'pending' },
      createdAt: new Date(),
    };

    bookings.set(id, booking);
    return NextResponse.json({ success: true, data: booking }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, message: 'Booking failed' }, { status: 500 });
  }
}
