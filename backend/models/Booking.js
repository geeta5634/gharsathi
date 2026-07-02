const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId: { type: String, unique: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true },
  service: { type: String, required: true },
  description: { type: String },
  address: { type: String, required: true },
  city: { type: String },
  scheduledDate: { type: Date, required: true },
  scheduledTime: { type: String },
  isEmergency: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'],
    default: 'pending',
  },
  amount: { type: Number, required: true },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending',
  },
  paymentId: { type: String },
  rating: { type: Number },
  review: { type: String },
  tracking: {
    workerLat: { type: Number },
    workerLng: { type: Number },
    estimatedArrival: { type: String },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

bookingSchema.pre('save', function (next) {
  if (!this.bookingId) {
    this.bookingId = 'GS' + Date.now().toString().slice(-8);
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
