require('dotenv').config();
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { getDb, initSchema, query, queryOne, execute } = require('./database');

const SEED_PASSWORD = process.env.SEED_PASSWORD || 'password123';

async function seed() {
  getDb();
  await initSchema();

  if ((await queryOne('SELECT COUNT(*) as c FROM services')).c > 0) {
    return console.log('Database already seeded.');
  }

  const svc = [
    ['s1', 'Plumber', 'droplet', 'blue', 'Pipe fitting, leak, blockage etc.'],
    ['s2', 'Electrician', 'zap', 'yellow', 'Wiring, repair, fan, light etc.'],
    ['s3', 'Driver', 'car', 'green', 'Personal driver, outstation etc.'],
    ['s4', 'Maid / Bai', 'user', 'pink', 'Cooking, cleaning, washing etc.'],
    ['s5', 'Carpenter', 'hammer', 'orange', 'Furniture, door, window etc.'],
    ['s6', 'House Painter', 'paintbrush', 'purple', 'Wall painting, texture etc.'],
    ['s7', 'Cleaning', 'sparkles', 'teal', 'Home, office, deep cleaning etc.'],
  ];
  for (const s of svc) await execute('INSERT INTO services (id, name, icon, color, description) VALUES (?, ?, ?, ?, ?)', ...s);

  const pwd = await bcrypt.hash(SEED_PASSWORD, 10);
  const users = [
    ['u1', 'Amit Sharma', '9876543210', pwd, 'customer'],
    ['u2', 'Priya Singh', '9876543211', pwd, 'customer'],
    ['u3', 'Ramesh Kumar', '9876543212', pwd, 'worker'],
    ['u4', 'Mahendra Singh', '9876543213', pwd, 'worker'],
    ['u5', 'Suresh Prajapat', '9876543214', pwd, 'worker'],
    ['u6', 'Admin', '9876543200', pwd, 'admin'],
  ];
  for (const u of users) {
    await execute('INSERT INTO users (id, name, phone, password, role, location, avatar) VALUES (?, ?, ?, ?, ?, ?, ?)',
      u[0], u[1], u[2], u[3], u[4], 'Jodhpur, Rajasthan', `https://i.pravatar.cc/200?u=${u[0]}`);
  }

  await execute('INSERT INTO workers (id, user_id, service_id, experience, rating, reviews_count, visit_charge, about, trust_score) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    'w1', 'u3', 's1', '8 Years', 4.8, 120, 299, 'I have 8 years of experience in plumbing work.', 98);
  await execute('INSERT INTO workers (id, user_id, service_id, experience, rating, reviews_count, visit_charge, about, trust_score) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    'w2', 'u4', 's1', '6 Years', 4.6, 85, 299, 'Expert in pipe fitting and water tank installation.', 95);
  await execute('INSERT INTO workers (id, user_id, service_id, experience, rating, reviews_count, visit_charge, about, trust_score) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    'w3', 'u5', 's1', '10 Years', 4.7, 95, 299, 'Senior plumber with expertise in all plumbing systems.', 97);

  const skills = [
    ['w1', 'Pipe Fitting'], ['w1', 'Leakage Fixing'], ['w1', 'Bathroom Fitting'],
    ['w2', 'Pipe Fitting'], ['w2', 'Water Tank Installation'],
    ['w3', 'Pipe Fitting'], ['w3', 'Leakage Fixing'],
  ];
  for (const sk of skills) await execute('INSERT INTO worker_skills (worker_id, skill) VALUES (?, ?)', ...sk);

  await execute('INSERT INTO bookings (id, customer_id, worker_id, service_id, status, booking_date, booking_time, address, visit_charge, service_charge, platform_fee, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    'GSABC001', 'u1', 'w1', 's1', 'completed', '2024-05-25', '10:00 AM', 'Shastri Nagar, Jodhpur', 299, 500, 49, 848);
  await execute('INSERT INTO bookings (id, customer_id, worker_id, service_id, status, booking_date, booking_time, address, visit_charge, service_charge, platform_fee, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    'GSABC002', 'u2', null, 's2', 'pending', '2024-05-28', '11:00 AM', 'Ratanada, Jodhpur', 299, 400, 49, 748);

  const eid = uuidv4();
  await execute('INSERT INTO earnings (id, worker_id, booking_id, amount, status) VALUES (?, ?, ?, ?, ?)', eid, 'w1', 'GSABC001', 299, 'paid');
  await execute('UPDATE workers SET earnings_total = earnings_total + ? WHERE id = ?', 299, 'w1');

  await execute('INSERT INTO reviews (booking_id, customer_id, worker_id, rating, comment) VALUES (?, ?, ?, ?, ?)',
    'GSABC001', 'u1', 'w1', 5, 'Very professional and quick.');
  await execute('INSERT INTO reviews (booking_id, customer_id, worker_id, rating, comment) VALUES (?, ?, ?, ?, ?)',
    'GSABC001', 'u1', 'w1', 4, 'Knowledgeable and polite.');

  console.log('Database seeded successfully!');
  console.log('\n--- Test Credentials ---');
  console.log(`Customer: 9876543210 / ${SEED_PASSWORD}`);
  console.log(`Worker:   9876543212 / ${SEED_PASSWORD}`);
  console.log(`Admin:    9876543200 / ${SEED_PASSWORD}`);
  console.log('------------------------\n');
}

seed().catch(err => { console.error('Seed error:', err); process.exit(1); });
