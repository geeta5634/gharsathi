const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  services: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  }],
  experience: {
    type: Number,
    default: 0,
    min: 0
  },
  bio: {
    type: String,
    default: '',
    maxlength: 500
  },
  trustScore: {
    type: Number,
    default: 50,
    min: 0,
    max: 100
  },
  totalJobs: {
    type: Number,
    default: 0
  },
  completedJobs: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  availability: {
    isAvailable: { type: Boolean, default: true },
    slots: [{
      day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
      startTime: { type: String },
      endTime: { type: String }
    }]
  },
  documents: {
    aadhar: { type: String, default: '' },
    pan: { type: String, default: '' },
    photo: { type: String, default: '' }
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  },
  serviceAreas: [{
    type: String
  }],
  earnings: {
    total: { type: Number, default: 0 },
    thisMonth: { type: Number, default: 0 },
    lastPayout: { type: Date }
  }
}, {
  timestamps: true
});

workerSchema.index({ location: '2dsphere' });
workerSchema.index({ services: 1, isApproved: 1 });
workerSchema.index({ trustScore: -1 });

module.exports = mongoose.model('Worker', workerSchema);
