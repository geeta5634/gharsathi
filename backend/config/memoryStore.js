const Datastore = require('nedb-promises');

let users, workers, services, bookings, memberships, reviews;

function init() {
  users = Datastore.create({ autoload: true, inMemoryOnly: true });
  workers = Datastore.create({ autoload: true, inMemoryOnly: true });
  services = Datastore.create({ autoload: true, inMemoryOnly: true });
  bookings = Datastore.create({ autoload: true, inMemoryOnly: true });
  memberships = Datastore.create({ autoload: true, inMemoryOnly: true });
  reviews = Datastore.create({ autoload: true, inMemoryOnly: true });
}

function getStore(name) {
  const stores = { users, workers, services, bookings, memberships, reviews };
  return stores[name];
}

async function seed() {
  init();

  const bcrypt = require('bcryptjs');

  const hash = (pw) => bcrypt.hashSync(pw, 10);

  // Admin
  await users.insert({
    _id: 'admin_1', name: 'GharSathi Admin', phone: '9999999999',
    email: 'admin@gharsathi.com', password: hash('admin123'),
    role: 'admin', isVerified: true, createdAt: new Date(),
    avatar: '', address: { street: '', city: '', state: '', pincode: '' }
  });

  // Services
  const svcData = [
    { _id: 'svc_1', name: 'Plumber', icon: 'wrench', description: 'Expert plumbing services for pipe repairs, installations, leak fixes.', basePrice: 299, isActive: true, category: 'home_repair', slug: 'plumber', createdAt: new Date() },
    { _id: 'svc_2', name: 'Electrician', icon: 'zap', description: 'Professional electrical services for wiring, installations, repairs.', basePrice: 349, isActive: true, category: 'home_repair', slug: 'electrician', createdAt: new Date() },
    { _id: 'svc_3', name: 'Carpenter', icon: 'hammer', description: 'Skilled carpentry for furniture repair, woodwork, modular installations.', basePrice: 399, isActive: true, category: 'home_repair', slug: 'carpenter', createdAt: new Date() },
    { _id: 'svc_4', name: 'House Painter', icon: 'paintbrush', description: 'Professional painting services for interior and exterior walls.', basePrice: 499, isActive: true, category: 'home_improvement', slug: 'house-painter', createdAt: new Date() },
    { _id: 'svc_5', name: 'House Cleaning', icon: 'sparkles', description: 'Deep home cleaning services including kitchen, bathroom, carpet.', basePrice: 599, isActive: true, category: 'cleaning', slug: 'house-cleaning', createdAt: new Date() },
    { _id: 'svc_6', name: 'Driver / Maid', icon: 'users', description: 'Trained domestic help for daily household chores.', basePrice: 449, isActive: true, category: 'domestic', slug: 'driver-maid', createdAt: new Date() },
  ];
  await services.insert(svcData);

  // Workers
  const workerUsers = [
    { _id: 'wu_1', name: 'Rajesh Kumar', phone: '8888888801', password: hash('worker123'), email: 'rajesh@gharsathi.com', role: 'worker', isVerified: true, createdAt: new Date() },
    { _id: 'wu_2', name: 'Amit Sharma', phone: '8888888802', password: hash('worker123'), email: 'amit@gharsathi.com', role: 'worker', isVerified: true, createdAt: new Date() },
    { _id: 'wu_3', name: 'Suresh Patel', phone: '8888888803', password: hash('worker123'), email: 'suresh@gharsathi.com', role: 'worker', isVerified: true, createdAt: new Date() },
  ];
  await users.insert(workerUsers);

  const workerProfiles = [
    { _id: 'wp_1', user: 'wu_1', services: ['svc_1', 'svc_2'], experience: 5, bio: 'Experienced professional with expertise in home repair services.', trustScore: 85, totalJobs: 35, completedJobs: 33, rating: 4.7, totalRatings: 28, isApproved: true, serviceAreas: ['Kathmandu', 'Lalitpur'], availability: { isAvailable: true, slots: [{ day: 'Monday', startTime: '09:00', endTime: '18:00' }, { day: 'Tuesday', startTime: '09:00', endTime: '18:00' }, { day: 'Wednesday', startTime: '09:00', endTime: '18:00' }, { day: 'Thursday', startTime: '09:00', endTime: '18:00' }, { day: 'Friday', startTime: '09:00', endTime: '18:00' }, { day: 'Saturday', startTime: '09:00', endTime: '14:00' }] }, earnings: { total: 45000, thisMonth: 8500 }, documents: {} },
    { _id: 'wp_2', user: 'wu_2', services: ['svc_2', 'svc_3'], experience: 3, bio: 'Dedicated worker specializing in electrical and carpentry work.', trustScore: 72, totalJobs: 22, completedJobs: 20, rating: 4.3, totalRatings: 18, isApproved: true, serviceAreas: ['Kathmandu', 'Bhaktapur'], availability: { isAvailable: true, slots: [{ day: 'Monday', startTime: '09:00', endTime: '18:00' }, { day: 'Tuesday', startTime: '09:00', endTime: '18:00' }, { day: 'Wednesday', startTime: '09:00', endTime: '18:00' }, { day: 'Thursday', startTime: '09:00', endTime: '18:00' }, { day: 'Friday', startTime: '09:00', endTime: '18:00' }] }, earnings: { total: 28000, thisMonth: 6200 }, documents: {} },
    { _id: 'wp_3', user: 'wu_3', services: ['svc_1', 'svc_4', 'svc_5'], experience: 8, bio: 'Master craftsman with over 8 years of experience.', trustScore: 91, totalJobs: 58, completedJobs: 56, rating: 4.9, totalRatings: 45, isApproved: true, serviceAreas: ['Lalitpur', 'Bhaktapur'], availability: { isAvailable: true, slots: [{ day: 'Monday', startTime: '09:00', endTime: '18:00' }, { day: 'Tuesday', startTime: '09:00', endTime: '18:00' }, { day: 'Wednesday', startTime: '09:00', endTime: '18:00' }, { day: 'Thursday', startTime: '09:00', endTime: '18:00' }, { day: 'Friday', startTime: '09:00', endTime: '18:00' }, { day: 'Saturday', startTime: '09:00', endTime: '14:00' }, { day: 'Sunday', startTime: '10:00', endTime: '14:00' }] }, earnings: { total: 72000, thisMonth: 12000 }, documents: {} },
  ];
  await workers.insert(workerProfiles);

  // Customers
  const customers = [
    { _id: 'cu_1', name: 'Priya Thapa', phone: '7777777701', password: hash('customer123'), email: 'priya@example.com', role: 'customer', isVerified: true, createdAt: new Date() },
    { _id: 'cu_2', name: 'Anita Gurung', phone: '7777777702', password: hash('customer123'), email: 'anita@example.com', role: 'customer', isVerified: true, createdAt: new Date() },
    { _id: 'cu_3', name: 'Bikash Rai', phone: '7777777703', password: hash('customer123'), email: 'bikash@example.com', role: 'customer', isVerified: true, createdAt: new Date() },
  ];
  await users.insert(customers);

  // Bookings
  const bookingData = [
    { _id: 'bk_1', customer: 'cu_1', worker: 'wp_1', service: 'svc_1', status: 'completed', address: { street: 'Baneshwor-10', city: 'Kathmandu', state: 'Bagmati', pincode: '44600' }, description: 'Kitchen sink pipe repair needed', scheduledDate: new Date(Date.now() - 86400000 * 3), scheduledTime: '10:00', price: { basePrice: 299, additionalCharges: 100, discount: 0, total: 399 }, payment: { method: 'online', status: 'completed' }, rating: { score: 5, review: 'Excellent work! Very professional.' }, isEmergency: false, createdAt: new Date(Date.now() - 86400000 * 3) },
    { _id: 'bk_2', customer: 'cu_2', worker: 'wp_2', service: 'svc_2', status: 'completed', address: { street: 'New Baneshwor-5', city: 'Kathmandu', state: 'Bagmati', pincode: '44600' }, description: 'Fan installation in bedroom', scheduledDate: new Date(Date.now() - 86400000 * 1), scheduledTime: '14:00', price: { basePrice: 349, additionalCharges: 200, discount: 0, total: 549 }, payment: { method: 'cash', status: 'completed' }, rating: { score: 4, review: 'Good work, but arrived a bit late.' }, isEmergency: false, createdAt: new Date(Date.now() - 86400000 * 1) },
    { _id: 'bk_3', customer: 'cu_3', worker: 'wp_3', service: 'svc_5', status: 'in_progress', address: { street: 'Patan-15', city: 'Lalitpur', state: 'Bagmati', pincode: '44700' }, description: 'Full house deep cleaning', scheduledDate: new Date(), scheduledTime: '09:00', price: { basePrice: 599, additionalCharges: 0, discount: 0, total: 599 }, payment: { method: 'online', status: 'pending' }, isEmergency: false, createdAt: new Date() },
    { _id: 'bk_4', customer: 'cu_1', service: 'svc_3', status: 'pending', address: { street: 'Kathmandu-22', city: 'Kathmandu', state: 'Bagmati', pincode: '44600' }, description: 'Wardrobe door hinge replacement', scheduledDate: new Date(Date.now() + 86400000 * 2), scheduledTime: '11:00', price: { basePrice: 399, additionalCharges: 0, discount: 0, total: 399 }, payment: { method: 'cash', status: 'pending' }, isEmergency: false, createdAt: new Date() },
  ];
  await bookings.insert(bookingData);

  console.log('\n--- In-Memory Store Seeded ---');
  console.log('Admin: 9999999999 / admin123');
  console.log('Workers: 8888888801-03 / worker123');
  console.log('Customers: 7777777701-03 / customer123');
}

async function getStoreByName(name) {
  const stores = { users, workers, services, bookings, memberships, reviews };
  if (!stores[name]) throw new Error(`Store ${name} not found`);
  return stores[name];
}

module.exports = { init, getStore, getStoreByName, seed };
