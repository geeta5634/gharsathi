const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker'
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'accepted', 'en_route', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, default: '' },
    pincode: { type: String, required: true },
    lat: { type: Number },
    lng: { type: Number }
  },
  description: {
    type: String,
    default: ''
  },
  scheduledDate: {
    type: Date
  },
  scheduledTime: {
    type: String
  },
  actualStartTime: {
    type: Date
  },
  actualEndTime: {
    type: Date
  },
  price: {
    basePrice: { type: Number, default: 0 },
    additionalCharges: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  },
  payment: {
    method: { type: String, enum: ['cash', 'online', 'wallet'], default: 'cash' },
    status: { type: String, enum: ['pending', 'completed', 'refunded'], default: 'pending' },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String }
  },
  rating: {
    score: { type: Number, min: 1, max: 5 },
    review: { type: String },
    createdAt: { type: Date }
  },
  isEmergency: {
    type: Boolean,
    default: false
  },
  trustScore: {
    type: Number
  }
}, {
  timestamps: true
});

bookingSchema.index({ customer: 1, status: 1 });
bookingSchema.index({ worker: 1, status: 1 });
bookingSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Booking', bookingSchema);
