require('dotenv').config();
const { createClient } = require('@libsql/client');

let db;

function getDb() {
  if (db) return db;

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    throw new Error('TURSO_DATABASE_URL environment variable is required. Get one at https://turso.tech');
  }

  db = createClient({ url, authToken });

  return db;
}

async function initSchema() {
  const client = getDb();

  await client.execute("CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT, phone TEXT UNIQUE NOT NULL, password TEXT NOT NULL, role TEXT NOT NULL CHECK(role IN ('customer', 'worker', 'admin')), location TEXT DEFAULT 'Jodhpur, Rajasthan', avatar TEXT, created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')))");
  await client.execute('CREATE TABLE IF NOT EXISTS services (id TEXT PRIMARY KEY, name TEXT NOT NULL, icon TEXT NOT NULL, color TEXT NOT NULL, description TEXT, created_at TEXT DEFAULT (datetime(\'now\')))');
  await client.execute("CREATE TABLE IF NOT EXISTS workers (id TEXT PRIMARY KEY, user_id TEXT UNIQUE NOT NULL, service_id TEXT NOT NULL, experience TEXT DEFAULT '5 Years', rating REAL DEFAULT 4.5, reviews_count INTEGER DEFAULT 0, visit_charge REAL DEFAULT 299, available INTEGER DEFAULT 1, verified INTEGER DEFAULT 1, about TEXT, trust_score INTEGER DEFAULT 95, earnings_total REAL DEFAULT 0, created_at TEXT DEFAULT (datetime('now')), FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE)");
  await client.execute('CREATE TABLE IF NOT EXISTS worker_skills (id INTEGER PRIMARY KEY AUTOINCREMENT, worker_id TEXT NOT NULL, skill TEXT NOT NULL, FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE)');
  await client.execute("CREATE TABLE IF NOT EXISTS bookings (id TEXT PRIMARY KEY, customer_id TEXT NOT NULL, worker_id TEXT, service_id TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'in-progress', 'completed', 'cancelled')), booking_date TEXT NOT NULL, booking_time TEXT NOT NULL, address TEXT NOT NULL, visit_charge REAL DEFAULT 299, service_charge REAL DEFAULT 500, platform_fee REAL DEFAULT 49, total_amount REAL, payment_method TEXT DEFAULT 'cash' CHECK(payment_method IN ('cash', 'online')), payment_status TEXT DEFAULT 'pending' CHECK(payment_status IN ('pending', 'paid', 'failed')), notes TEXT, created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')), FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE, FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE SET NULL, FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE)");
  await client.execute('CREATE TABLE IF NOT EXISTS reviews (id INTEGER PRIMARY KEY AUTOINCREMENT, booking_id TEXT NOT NULL, customer_id TEXT NOT NULL, worker_id TEXT NOT NULL, rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5), comment TEXT, created_at TEXT DEFAULT (datetime(\'now\')), FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE, FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE, FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE)');
  await client.execute("CREATE TABLE IF NOT EXISTS earnings (id TEXT PRIMARY KEY, worker_id TEXT NOT NULL, booking_id TEXT NOT NULL, amount REAL NOT NULL CHECK(amount > 0), type TEXT NOT NULL DEFAULT 'booking', status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'paid', 'cancelled')), payout_date TEXT, created_at TEXT DEFAULT (datetime('now')), FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE, FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE)");
  await client.execute("CREATE TABLE IF NOT EXISTS sessions (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, refresh_hash TEXT NOT NULL, user_agent TEXT DEFAULT '', ip TEXT DEFAULT '', expires_at TEXT NOT NULL, created_at TEXT DEFAULT (datetime('now')), revoked INTEGER DEFAULT 0, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE)");
  await client.execute("CREATE TABLE IF NOT EXISTS home_assets (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, name TEXT NOT NULL, category TEXT NOT NULL, last_service_date TEXT, next_service_date TEXT, notes TEXT, created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')), FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE)");
  await client.execute("CREATE TABLE IF NOT EXISTS location_updates (id INTEGER PRIMARY KEY AUTOINCREMENT, worker_id TEXT NOT NULL, lat REAL NOT NULL, lng REAL NOT NULL, updated_at TEXT DEFAULT (datetime('now')), FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE)");
  await client.execute("CREATE TABLE IF NOT EXISTS worker_availability (id INTEGER PRIMARY KEY AUTOINCREMENT, worker_id TEXT NOT NULL, day_of_week INTEGER NOT NULL CHECK(day_of_week >= 0 AND day_of_week <= 6), start_time TEXT NOT NULL, end_time TEXT NOT NULL, slot_duration INTEGER DEFAULT 30, FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE)");
  await client.execute("CREATE TABLE IF NOT EXISTS worker_blocked_dates (id INTEGER PRIMARY KEY AUTOINCREMENT, worker_id TEXT NOT NULL, block_date TEXT NOT NULL, start_time TEXT, end_time TEXT, reason TEXT, FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE)");
  await client.execute("CREATE TABLE IF NOT EXISTS payments (id TEXT PRIMARY KEY, booking_id TEXT NOT NULL, customer_id TEXT NOT NULL, amount REAL NOT NULL, method TEXT NOT NULL CHECK(method IN ('cash', 'online')), transaction_id TEXT, gateway TEXT DEFAULT 'simulated', status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'success', 'failed', 'refunded')), paid_at TEXT, created_at TEXT DEFAULT (datetime('now')), FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE, FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE)");
  await client.execute("CREATE TABLE IF NOT EXISTS payment_receipts (id TEXT PRIMARY KEY, booking_id TEXT NOT NULL, payment_id TEXT NOT NULL, receipt_no TEXT NOT NULL UNIQUE, invoice_html TEXT, generated_at TEXT DEFAULT (datetime('now')), FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE, FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE)");

  console.log('[DB] Schema initialized');
}

async function query(sql, ...params) {
  try {
    const client = getDb();
    const result = await client.execute({ sql, args: params });
    return result.rows;
  } catch (err) {
    throw new Error(`Query failed: ${err.message}`);
  }
}

async function queryOne(sql, ...params) {
  const rows = await query(sql, ...params);
  return rows.length > 0 ? rows[0] : null;
}

async function execute(sql, ...params) {
  try {
    const client = getDb();
    await client.execute({ sql, args: params });
  } catch (err) {
    throw new Error(`Execute failed: ${err.message}`);
  }
}

module.exports = { getDb, initSchema, query, queryOne, execute };
