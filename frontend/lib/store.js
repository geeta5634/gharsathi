import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const users = new Map();
const services = new Map();
const workers = new Map();
const bookings = new Map();

export function hashPassword(pw) {
  return bcrypt.hashSync(pw, 10);
}

export function comparePassword(candidate, hash) {
  return bcrypt.compareSync(candidate, hash);
}

function seed() {
  if (users.size > 0) return;

  const adminId = crypto.randomUUID();
  users.set(adminId, { _id: adminId, name: 'GharSathi Admin', phone: '9999999999', email: 'admin@gharsathi.com', password: hashPassword('admin123'), role: 'admin', isVerified: true, avatar: '', address: { street: '', city: '', state: '', pincode: '' }, createdAt: new Date() });

  const svcData = [
    { name: 'Maid', icon: 'broom', description: 'Professional maid services for home cleaning, dusting, and daily household maintenance.', basePrice: 249, category: 'domestic', isActive: true },
    { name: 'Cook', icon: 'fire', description: 'Experienced cooks for daily meal preparation, tiffin service, and special occasion cooking.', basePrice: 249, category: 'domestic', isActive: true },
    { name: 'Driver', icon: 'car', description: 'Reliable drivers for personal & family transportation needs on daily or hourly basis.', basePrice: 249, category: 'domestic', isActive: true },
    { name: 'Baby Sitter', icon: 'baby', description: 'Trusted baby sitters for child care, feeding, playtime, and ensuring child safety at home.', basePrice: 249, category: 'care', isActive: true },
    { name: 'Elder Care', icon: 'heartbeat', description: 'Compassionate elder care services including medication reminders, companionship, and daily assistance.', basePrice: 249, category: 'care', isActive: true },
    { name: 'Security Guard', icon: 'shield', description: 'Trained security guards for home, colony, and premises security with regular patrolling.', basePrice: 249, category: 'security', isActive: true },
    { name: 'Plumber', icon: 'wrench', description: 'Expert plumbing services for pipe repairs, installations, leak fixes, and bathroom renovations.', basePrice: 249, category: 'home_repair', isActive: true },
    { name: 'Electrician', icon: 'bolt', description: 'Professional electrical services for wiring, installations, repairs, and power backup solutions.', basePrice: 249, category: 'home_repair', isActive: true },
    { name: 'Carpenter', icon: 'hammer', description: 'Skilled carpentry for furniture repair, woodwork, modular installations, and custom designs.', basePrice: 249, category: 'home_repair', isActive: true },
    { name: 'Home Cleaning', icon: 'magic', description: 'Deep home cleaning services including full house, kitchen, bathroom, carpet, and sanitization.', basePrice: 249, category: 'cleaning', isActive: true },
    { name: 'AC Repair', icon: 'snowflake', description: 'AC repair, servicing, gas refill, and installation for all brands — split, window & central.', basePrice: 249, category: 'home_repair', isActive: true },
    { name: 'RO Service/Repair', icon: 'tint', description: 'RO water purifier installation, service, filter replacement, and repair for all brands.', basePrice: 249, category: 'home_repair', isActive: true },
  ];

  const svcIds = [];
  svcData.forEach(s => {
    const id = crypto.randomUUID();
    svcIds.push(id);
    services.set(id, { _id: id, ...s, slug: s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''), createdAt: new Date() });
  });

  // Seed customer
  const custId = crypto.randomUUID();
  users.set(custId, { _id: custId, name: 'Priya Thapa', phone: '7777777701', email: 'priya@example.com', password: hashPassword('customer123'), role: 'customer', isVerified: true, avatar: '', address: { street: 'Baneshwor-10', city: 'Kathmandu', state: 'Bagmati', pincode: '44600' }, createdAt: new Date() });

  // Seed worker users
  const workerUsers = [
    { name: 'Anil Prajapat', phone: '9660002869', email: 'anil@gharsathi.com' },
    { name: 'Ranveer Singh', phone: '8619257871', email: 'ranveer@gharsathi.com' },
    { name: 'Mohan Prajapat', phone: '9928275858', email: 'mohan@gharsathi.com' },
    { name: 'Keval Das', phone: '9660419761', email: 'keval@gharsathi.com' },
    { name: 'Daulat Bhati', phone: '7976265177', email: 'daulat@gharsathi.com' },
    { name: 'Jagdish', phone: '9460465489', email: 'jagdish@gharsathi.com' },
    { name: 'Amit', phone: '9828342449', email: 'amit@gharsathi.com' },
    { name: 'Faizal Khan', phone: '9352775912', email: 'faizal@gharsathi.com' },
    { name: 'Shaitan Singh', phone: '9571075310', email: 'shaitan@gharsathi.com' },
    { name: 'Ajay', phone: '9929153507', email: 'ajay1@gharsathi.com' },
    { name: 'Mahesh', phone: '8386851307', email: 'mahesh@gharsathi.com' },
    { name: 'Sanjay', phone: '9784725920', email: 'sanjay@gharsathi.com' },
    { name: 'Ajay', phone: '8290349332', email: 'ajay2@gharsathi.com' },
    { name: 'Nandu', phone: '8387048880', email: 'nandu@gharsathi.com' },
  ];

  const workerUserIds = [];
  workerUsers.forEach(w => {
    const id = crypto.randomUUID();
    workerUserIds.push(id);
    users.set(id, { _id: id, ...w, password: hashPassword('worker123'), role: 'worker', isVerified: true, avatar: '', address: { street: '', city: '', state: '', pincode: '' }, createdAt: new Date() });
  });

  // serviceIndices: 0=Maid,1=Cook,2=Driver,3=BabySitter,4=ElderCare,5=SecurityGuard,6=Plumber,7=Electrician,8=Carpenter,9=HomeCleaning,10=ACRepair,11=ROService
  const workerProfiles = [
    { user: workerUserIds[0], serviceIndices: [6], name: 'Anil Prajapat', experience: 6, trustScore: 88, totalJobs: 40, completedJobs: 38, rating: 4.6, totalRatings: 30 },
    { user: workerUserIds[1], serviceIndices: [7], name: 'Ranveer Singh', experience: 5, trustScore: 82, totalJobs: 28, completedJobs: 26, rating: 4.4, totalRatings: 20 },
    { user: workerUserIds[2], serviceIndices: [8], name: 'Mohan Prajapat', experience: 7, trustScore: 90, totalJobs: 50, completedJobs: 48, rating: 4.8, totalRatings: 40 },
    { user: workerUserIds[3], serviceIndices: [9], name: 'Keval Das', experience: 4, trustScore: 75, totalJobs: 18, completedJobs: 16, rating: 4.2, totalRatings: 12 },
    { user: workerUserIds[4], serviceIndices: [7], name: 'Daulat Bhati', experience: 8, trustScore: 86, totalJobs: 45, completedJobs: 42, rating: 4.5, totalRatings: 35 },
    { user: workerUserIds[5], serviceIndices: [8], name: 'Jagdish', experience: 6, trustScore: 78, totalJobs: 30, completedJobs: 28, rating: 4.3, totalRatings: 22 },
    { user: workerUserIds[6], serviceIndices: [7], name: 'Amit', experience: 5, trustScore: 80, totalJobs: 25, completedJobs: 23, rating: 4.4, totalRatings: 18 },
    { user: workerUserIds[7], serviceIndices: [6, 11], name: 'Faizal Khan', experience: 9, trustScore: 92, totalJobs: 60, completedJobs: 58, rating: 4.9, totalRatings: 48 },
    { user: workerUserIds[8], serviceIndices: [9], name: 'Shaitan Singh', experience: 3, trustScore: 70, totalJobs: 15, completedJobs: 13, rating: 4.1, totalRatings: 10 },
    { user: workerUserIds[9], serviceIndices: [9], name: 'Ajay', experience: 4, trustScore: 74, totalJobs: 20, completedJobs: 18, rating: 4.2, totalRatings: 14 },
    { user: workerUserIds[10], serviceIndices: [7], name: 'Mahesh', experience: 6, trustScore: 83, totalJobs: 32, completedJobs: 30, rating: 4.5, totalRatings: 25 },
    { user: workerUserIds[11], serviceIndices: [6], name: 'Sanjay', experience: 5, trustScore: 79, totalJobs: 22, completedJobs: 20, rating: 4.3, totalRatings: 16 },
    { user: workerUserIds[12], serviceIndices: [7], name: 'Ajay', experience: 4, trustScore: 73, totalJobs: 18, completedJobs: 16, rating: 4.1, totalRatings: 12 },
    { user: workerUserIds[13], serviceIndices: [6], name: 'Nandu', experience: 7, trustScore: 87, totalJobs: 38, completedJobs: 36, rating: 4.6, totalRatings: 28 },
  ];

  const serviceNames = ['Maid','Cook','Driver','Baby Sitter','Elder Care','Security Guard','Plumber','Electrician','Carpenter','Home Cleaning','AC Repair','RO Service/Repair'];

  workerProfiles.forEach(wp => {
    const id = crypto.randomUUID();
    const svcList = wp.serviceIndices.map(i => serviceNames[i]).join(', ');
    workers.set(id, {
      _id: id, user: wp.user, services: wp.serviceIndices.map(i => svcIds[i]),
      name: wp.name, experience: wp.experience,
      bio: `Experienced ${svcList} specialist with ${wp.experience}+ years in the field.`,
      trustScore: wp.trustScore,
      totalJobs: wp.totalJobs, completedJobs: wp.completedJobs, rating: wp.rating,
      totalRatings: wp.totalRatings, isApproved: true, serviceAreas: ['Jodhpur', 'Pali', 'Nagaur'],
      earnings: { total: Math.floor(Math.random() * 50000) + 10000, thisMonth: Math.floor(Math.random() * 10000) + 2000 }, availability: { isAvailable: true, slots: [
        { day: 'Monday', startTime: '09:00', endTime: '18:00' },
        { day: 'Tuesday', startTime: '09:00', endTime: '18:00' },
        { day: 'Wednesday', startTime: '09:00', endTime: '18:00' },
        { day: 'Thursday', startTime: '09:00', endTime: '18:00' },
        { day: 'Friday', startTime: '09:00', endTime: '18:00' },
        { day: 'Saturday', startTime: '09:00', endTime: '14:00' },
      ]}, documents: {}, createdAt: new Date(),
    });
  });
}

seed();

export { users, services, workers, bookings };
