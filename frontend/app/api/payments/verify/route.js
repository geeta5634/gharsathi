import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
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

    const { razorpayOrderId, razorpayPaymentId, bookingId } = await request.json();
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

    booking.payment = {
      ...booking.payment,
      status: 'completed',
      razorpayPaymentId,
      razorpaySignature: razorpayOrderId,
    };
    bookings.set(bookingId, booking);

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      data: { bookingId: booking._id, amount: booking.price?.total, status: 'completed' }
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    return NextResponse.json({ success: false, message: 'Server error while verifying payment' }, { status: 500 });
  }
}
