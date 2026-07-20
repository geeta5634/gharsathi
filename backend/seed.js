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
        name: 'Maid',
        icon: 'broom',
        description: 'Professional maid services for home cleaning, dusting, and daily household maintenance.',
        basePrice: 249,
        category: 'domestic'
      },
      {
        name: 'Cook',
        icon: 'fire',
        description: 'Experienced cooks for daily meal preparation, tiffin service, and special occasion cooking.',
        basePrice: 249,
        category: 'domestic'
      },
      {
        name: 'Driver',
        icon: 'car',
        description: 'Reliable drivers for personal & family transportation needs on daily or hourly basis.',
        basePrice: 249,
        category: 'domestic'
      },
      {
        name: 'Baby Sitter',
        icon: 'baby',
        description: 'Trusted baby sitters for child care, feeding, playtime, and ensuring child safety at home.',
        basePrice: 249,
        category: 'care'
      },
      {
        name: 'Elder Care',
        icon: 'heartbeat',
        description: 'Compassionate elder care services including medication reminders, companionship, and daily assistance.',
        basePrice: 249,
        category: 'care'
      },
      {
        name: 'Security Guard',
        icon: 'shield',
        description: 'Trained security guards for home, colony, and premises security with regular patrolling.',
        basePrice: 249,
        category: 'security'
      },
      {
        name: 'Plumber',
        icon: 'wrench',
        description: 'Expert plumbing services for pipe repairs, installations, leak fixes, and bathroom renovations.',
        basePrice: 249,
        category: 'home_repair'
      },
      {
        name: 'Electrician',
        icon: 'bolt',
        description: 'Professional electrical services for wiring, installations, repairs, and power backup solutions.',
        basePrice: 249,
        category: 'home_repair'
      },
      {
        name: 'Carpenter',
        icon: 'hammer',
        description: 'Skilled carpentry for furniture repair, woodwork, modular installations, and custom designs.',
        basePrice: 249,
        category: 'home_repair'
      },
      {
        name: 'Home Cleaning',
        icon: 'sparkles',
        description: 'Deep home cleaning services including full house, kitchen, bathroom, carpet, and sanitization.',
        basePrice: 249,
        category: 'cleaning'
      },
      {
        name: 'AC Repair',
        icon: 'snowflake',
        description: 'AC repair, servicing, gas refill, and installation for all brands — split, window & central.',
        basePrice: 249,
        category: 'home_repair'
      },
      {
        name: 'RO Service/Repair',
        icon: 'tint',
        description: 'RO water purifier installation, service, filter replacement, and repair for all brands.',
        basePrice: 249,
        category: 'home_repair'
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
    const workerServiceMap = [
      [6, 7],   // Rajesh: Plumber, Electrician
      [7, 8],   // Amit: Electrician, Carpenter
      [6, 9, 10] // Suresh: Plumber, Home Cleaning, AC Repair
    ];
    for (let wi = 0; wi < workersData.length; wi++) {
      const wd = workersData[wi];
      const user = await User.create(wd);
      const svcIds = workerServiceMap[wi].map(i => services[i]._id);
      const worker = await Worker.create({
        user: user._id,
        services: svcIds,
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
