const sqlite3 = require('sqlite3').verbose();

// Connect to SQLite (Creates file automatically)
const db = new sqlite3.Database('./nss_database.db', (err) => {
    if (err) console.error("DB Error:", err.message);
    else console.log("Connected to SQLite database.");
});

// Create Tables
const createTables = () => {
    // Users: Stores registration data separate from payments
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT DEFAULT 'user'
    )`);

    // Donations: Tracks payment status (Pending -> Success/Failed)
    db.run(`CREATE TABLE IF NOT EXISTS donations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        amount INTEGER,
        status TEXT DEFAULT 'Pending',
        payment_id TEXT,
        order_id TEXT,
        date DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )`);
};

createTables();
module.exports = db;