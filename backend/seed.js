const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Service = require('./models/Service');
const Worker = require('./models/Worker');
const Booking = require('./models/Booking');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding...');

    await User.deleteMany({});
    await Service.deleteMany({});
    await Worker.deleteMany({});
    await Booking.deleteMany({});

    console.log('Cleared existing data...');

    // Create admin
    const admin = await User.create({
      name: 'GharSathi Admin',
      phone: '9999999999',
      password: 'admin123',
      email: 'admin@gharsathi.com',
      role: 'admin',
      isVerified: true
    });
    console.log('Admin created:', admin.phone);

    // Create services
    const servicesData = [
      {
        name: 'Plumber',
        icon: 'droplet',
        description: 'Expert plumbing services for pipe repairs, installations, leak fixes, and bathroom renovations.',
        basePrice: 299,
        category: 'home_repair'
      },
      {
        name: 'Electrician',
        icon: 'zap',
        description: 'Professional electrical services for wiring, installations, repairs, and power backup solutions.',
        basePrice: 349,
        category: 'home_repair'
      },
      {
        name: 'Carpenter',
        icon: 'hammer',
        description: 'Skilled carpentry for furniture repair, woodwork, modular installations, and custom designs.',
        basePrice: 399,
        category: 'home_repair'
      },
      {
        name: 'House Painter',
        icon: 'paintbrush',
        description: 'Professional painting services for interior and exterior walls with premium quality paints.',
        basePrice: 499,
        category: 'home_improvement'
      },
      {
        name: 'House Cleaning',
        icon: 'sparkles',
        description: 'Deep home cleaning services including kitchen, bathroom, carpet, and full home sanitization.',
        basePrice: 599,
        category: 'cleaning'
      },
      {
        name: 'Driver/Maid',
        icon: 'users',
        description: 'Trained domestic help for daily household chores, cooking, cleaning, and driving services.',
        basePrice: 449,
        category: 'domestic'
      }
    ];

    const services = await Service.insertMany(servicesData);
    console.log(`${services.length} services created`);

    // Create workers
    const workersData = [
      {
        name: 'Rajesh Kumar',
        phone: '8888888801',
        password: 'worker123',
        email: 'rajesh@gharsathi.com',
        role: 'worker',
        isVerified: true
      },
      {
        name: 'Amit Sharma',
        phone: '8888888802',
        password: 'worker123',
        email: 'amit@gharsathi.com',
        role: 'worker',
        isVerified: true
      },
      {
        name: 'Suresh Patel',
        phone: '8888888803',
        password: 'worker123',
        email: 'suresh@gharsathi.com',
        role: 'worker',
        isVerified: true
      }
    ];

    const createdWorkers = [];
    for (const wd of workersData) {
      const user = await User.create(wd);
      const worker = await Worker.create({
        user: user._id,
        services: [services[0]._id, services[1]._id],
        experience: Math.floor(Math.random() * 10) + 2,
        bio: `Experienced professional with expertise in home repair services.`,
        trustScore: Math.floor(Math.random() * 30) + 70,
        totalJobs: Math.floor(Math.random() * 50) + 10,
        completedJobs: Math.floor(Math.random() * 40) + 10,
        rating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10,
        totalRatings: Math.floor(Math.random() * 30) + 5,
        availability: {
          isAvailable: true,
          slots: [
            { day: 'Monday', startTime: '09:00', endTime: '18:00' },
            { day: 'Tuesday', startTime: '09:00', endTime: '18:00' },
            { day: 'Wednesday', startTime: '09:00', endTime: '18:00' },
            { day: 'Thursday', startTime: '09:00', endTime: '18:00' },
            { day: 'Friday', startTime: '09:00', endTime: '18:00' },
            { day: 'Saturday', startTime: '09:00', endTime: '14:00' }
          ]
        },
        isApproved: true,
        serviceAreas: ['Kathmandu', 'Lalitpur', 'Bhaktapur'],
        earnings: {
          total: Math.floor(Math.random() * 50000) + 10000,
          thisMonth: Math.floor(Math.random() * 10000) + 2000
        }
      });
      createdWorkers.push(worker);
    }
    console.log(`${createdWorkers.length} workers created`);

    // Create customers
    const customersData = [
      {
        name: 'Priya Thapa',
        phone: '7777777701',
        password: 'customer123',
        email: 'priya@example.com',
        role: 'customer',
        isVerified: true
      },
      {
        name: 'Anita Gurung',
        phone: '7777777702',
        password: 'customer123',
        email: 'anita@example.com',
        role: 'customer',
        isVerified: true
      },
      {
        name: 'Bikash Rai',
        phone: '7777777703',
        password: 'customer123',
        email: 'bikash@example.com',
        role: 'customer',
        isVerified: true
      }
    ];

    const customers = await User.insertMany(customersData);
    console.log(`${customers.length} customers created`);

    // Create sample bookings
    const bookingsData = [
      {
        customer: customers[0]._id,
        worker: createdWorkers[0]._id,
        service: services[0]._id,
        status: 'completed',
        address: {
          street: 'Baneshwor-10',
          city: 'Kathmandu',
          state: 'Bagmati',
          pincode: '44600',
          lat: 27.7172,
          lng: 85.324
        },
        description: 'Kitchen sink pipe repair needed',
        scheduledDate: new Date(Date.now() - 86400000 * 3),
        scheduledTime: '10:00',
        actualStartTime: new Date(Date.now() - 86400000 * 3),
        actualEndTime: new Date(Date.now() - 86400000 * 3 + 3600000),
        price: {
          basePrice: 299,
          additionalCharges: 100,
          discount: 0,
          total: 399
        },
        payment: {
          method: 'online',
          status: 'completed'
        },
        rating: { score: 5, review: 'Excellent work! Very professional.' }
      },
      {
        customer: customers[1]._id,
        worker: createdWorkers[1]._id,
        service: services[1]._id,
        status: 'completed',
        address: {
          street: 'New Baneshwor-5',
          city: 'Kathmandu',
          state: 'Bagmati',
          pincode: '44600',
          lat: 27.715,
          lng: 85.322
        },
        description: 'Fan installation in bedroom',
        scheduledDate: new Date(Date.now() - 86400000 * 1),
        scheduledTime: '14:00',
        actualStartTime: new Date(Date.now() - 86400000),
        actualEndTime: new Date(Date.now() - 86400000 + 5400000),
        price: {
          basePrice: 349,
          additionalCharges: 200,
          discount: 0,
          total: 549
        },
        payment: {
          method: 'cash',
          status: 'completed'
        },
        rating: { score: 4, review: 'Good work, but arrived a bit late.' }
      },
      {
        customer: customers[2]._id,
        worker: createdWorkers[2]._id,
        service: services[4]._id,
        status: 'in_progress',
        address: {
          street: 'Patan-15',
          city: 'Lalitpur',
          state: 'Bagmati',
          pincode: '44700',
          lat: 27.68,
          lng: 85.318
        },
        description: 'Full house deep cleaning',
        scheduledDate: new Date(),
        scheduledTime: '09:00',
        actualStartTime: new Date(),
        price: {
          basePrice: 599,
          additionalCharges: 0,
          discount: 0,
          total: 599
        },
        payment: {
          method: 'online',
          status: 'pending'
        }
      },
      {
        customer: customers[0]._id,
        service: services[2]._id,
        status: 'pending',
        address: {
          street: 'Kathmandu-22',
          city: 'Kathmandu',
          state: 'Bagmati',
          pincode: '44600',
          lat: 27.72,
          lng: 85.33
        },
        description: 'Wardrobe door hinge replacement',
        scheduledDate: new Date(Date.now() + 86400000 * 2),
        scheduledTime: '11:00',
        price: {
          basePrice: 399,
          total: 399
        },
        payment: {
          method: 'cash',
          status: 'pending'
        }
      }
    ];

    const bookings = await Booking.insertMany(bookingsData);
    console.log(`${bookings.length} bookings created`);

    // Update worker stats based on bookings
    for (const worker of createdWorkers) {
      const completedBookings = bookings.filter(
        b => b.worker && b.worker.toString() === worker._id.toString() && b.status === 'completed'
      );

      let totalRevenue = 0;
      for (const b of completedBookings) {
        totalRevenue += b.price.total;
      }

      await Worker.findByIdAndUpdate(worker._id, {
        totalJobs: completedBookings.length + Math.floor(Math.random() * 20),
        completedJobs: completedBookings.length + Math.floor(Math.random() * 15),
        'earnings.total': totalRevenue + Math.floor(Math.random() * 30000),
        'earnings.thisMonth': totalRevenue + Math.floor(Math.random() * 8000)
      });
    }

    console.log('\n--- Seed Complete ---');
    console.log('Admin: 9999999999 / admin123');
    console.log('Workers: 8888888801-03 / worker123');
    console.log('Customers: 7777777701-03 / customer123');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
