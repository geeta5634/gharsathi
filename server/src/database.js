require('dotenv').config();
const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.resolve(__dirname, '..', process.env.DB_PATH || 'data/gharsathi.db');
let db;

async function getDb() {
  if (db) return db;

  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    db = new SQL.Database(fs.readFileSync(DB_PATH));
  } else {
    db = new SQL.Database();
  }

  db.run('PRAGMA journal_mode=WAL');
  db.run('PRAGMA foreign_keys=ON');
  runSchema();
  persist();

  return db;
}

function runSchema() {
  db.run("CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT, phone TEXT UNIQUE NOT NULL, password TEXT NOT NULL, role TEXT NOT NULL CHECK(role IN ('customer', 'worker', 'admin')), location TEXT DEFAULT 'Jodhpur, Rajasthan', avatar TEXT, created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')))");
  db.run('CREATE TABLE IF NOT EXISTS services (id TEXT PRIMARY KEY, name TEXT NOT NULL, icon TEXT NOT NULL, color TEXT NOT NULL, description TEXT, created_at TEXT DEFAULT (datetime(\'now\')))');
  db.run("CREATE TABLE IF NOT EXISTS workers (id TEXT PRIMARY KEY, user_id TEXT UNIQUE NOT NULL, service_id TEXT NOT NULL, experience TEXT DEFAULT '5 Years', rating REAL DEFAULT 4.5, reviews_count INTEGER DEFAULT 0, visit_charge REAL DEFAULT 299, available INTEGER DEFAULT 1, verified INTEGER DEFAULT 1, about TEXT, trust_score INTEGER DEFAULT 95, earnings_total REAL DEFAULT 0, created_at TEXT DEFAULT (datetime('now')), FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE)");
  db.run('CREATE TABLE IF NOT EXISTS worker_skills (id INTEGER PRIMARY KEY AUTOINCREMENT, worker_id TEXT NOT NULL, skill TEXT NOT NULL, FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE)');
  db.run("CREATE TABLE IF NOT EXISTS bookings (id TEXT PRIMARY KEY, customer_id TEXT NOT NULL, worker_id TEXT, service_id TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'in-progress', 'completed', 'cancelled')), booking_date TEXT NOT NULL, booking_time TEXT NOT NULL, address TEXT NOT NULL, visit_charge REAL DEFAULT 299, service_charge REAL DEFAULT 500, platform_fee REAL DEFAULT 49, total_amount REAL, payment_method TEXT DEFAULT 'cash' CHECK(payment_method IN ('cash', 'online')), payment_status TEXT DEFAULT 'pending' CHECK(payment_status IN ('pending', 'paid', 'failed')), notes TEXT, created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')), FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE, FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE SET NULL, FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE)");
  db.run('CREATE TABLE IF NOT EXISTS reviews (id INTEGER PRIMARY KEY AUTOINCREMENT, booking_id TEXT NOT NULL, customer_id TEXT NOT NULL, worker_id TEXT NOT NULL, rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5), comment TEXT, created_at TEXT DEFAULT (datetime(\'now\')), FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE, FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE, FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE)');
  db.run("CREATE TABLE IF NOT EXISTS earnings (id TEXT PRIMARY KEY, worker_id TEXT NOT NULL, booking_id TEXT NOT NULL, amount REAL NOT NULL CHECK(amount > 0), type TEXT NOT NULL DEFAULT 'booking', status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'paid', 'cancelled')), payout_date TEXT, created_at TEXT DEFAULT (datetime('now')), FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE, FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE)");
  db.run("CREATE TABLE IF NOT EXISTS sessions (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, refresh_hash TEXT NOT NULL, user_agent TEXT DEFAULT '', ip TEXT DEFAULT '', expires_at TEXT NOT NULL, created_at TEXT DEFAULT (datetime('now')), revoked INTEGER DEFAULT 0, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE)");
  db.run("CREATE TABLE IF NOT EXISTS home_assets (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, name TEXT NOT NULL, category TEXT NOT NULL, last_service_date TEXT, next_service_date TEXT, notes TEXT, created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')), FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE)");
  db.run("CREATE TABLE IF NOT EXISTS location_updates (id INTEGER PRIMARY KEY AUTOINCREMENT, worker_id TEXT NOT NULL, lat REAL NOT NULL, lng REAL NOT NULL, updated_at TEXT DEFAULT (datetime('now')), FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE)");
}

function persistSync() {
  if (!db) return;
  try {
    const data = db.export();
    fs.writeFileSync(DB_PATH, Buffer.from(data));
  } catch (err) {
    console.error('[DB] Persist failed:', err.message);
  }
}

let persistTimer = null;
function persist() {
  if (persistTimer) clearTimeout(persistTimer);
  persistTimer = setTimeout(persistSync, 200);
}

function query(sql, ...params) {
  try {
    const stmt = db.prepare(sql);
    if (params.length > 0) stmt.bind(params);
    const rows = [];
    while (stmt.step()) rows.push(stmt.getAsObject());
    stmt.free();
    return rows;
  } catch (err) {
    throw new Error(`Query failed: ${err.message}`);
  }
}

function queryOne(sql, ...params) {
  const rows = query(sql, ...params);
  return rows.length > 0 ? rows[0] : null;
}

function execute(sql, ...params) {
  try {
    if (params.length > 0) {
      const stmt = db.prepare(sql);
      stmt.bind(params);
      stmt.step();
      stmt.free();
    } else {
      db.run(sql);
    }
    persist();
  } catch (err) {
    throw new Error(`Execute failed: ${err.message}`);
  }
}

module.exports = { getDb, persist, persistSync, query, queryOne, execute };
