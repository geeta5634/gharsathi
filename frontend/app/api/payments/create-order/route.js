import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { bookings, users } from '@/lib/store';

const JWT_SECRET = process.env.JWT_SECRET || 'gharsathi-dev-secret-key';

export async function POST(request) {
  try {
    const auth = request.headers.get('authorization');
    if (!auth || !auth.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
    }
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.get(decoded.id);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
    }

    const { bookingId, amount } = await request.json();
    if (!bookingId) {
      return NextResponse.json({ success: false, errors: [{ msg: 'Booking ID is required' }] }, { status: 400 });
    }

    const booking = bookings.get(bookingId);
    if (!booking) {
      return NextResponse.json({ success: false, message: 'Booking not found' }, { status: 404 });
    }
    if (booking.customer !== user._id) {
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 403 });
    }

    const mockOrderId = 'mock_order_' + Date.now();
    booking.payment = { ...booking.payment, razorpayOrderId: mockOrderId, method: 'online' };
    bookings.set(bookingId, booking);

    return NextResponse.json({
      success: true,
      data: {
        orderId: mockOrderId,
        amount: Math.round((amount || booking.price?.total || 0) * 100),
        currency: 'INR',
        key: 'rzp_test_mock',
        mockMode: true,
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json({ success: false, message: 'Server error while creating payment order' }, { status: 500 });
  }
}
