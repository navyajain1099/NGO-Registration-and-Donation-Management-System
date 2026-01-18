require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');
const Razorpay = require('razorpay');
const db = require('./database');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// 1. REGISTER
app.post('/api/register', (req, res) => {
    const { name, email, password } = req.body;
    db.run(`INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
        [name, email, password],
        function (err) {
            if (err) return res.status(400).json({ error: "Email exists" });
            res.json({ id: this.lastID, name, role: 'user' });
        }
    );
});

// 2. LOGIN (Modified for Admin Access)
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    db.get(`SELECT * FROM users WHERE email = ? AND password = ?`, [email, password], (err, user) => {
        if (!user) return res.status(401).json({ error: "Invalid credentials" });

        // CHANGE THIS LINE to match your email:
        if (email === "admin@gmail.com") {
            return res.json({ ...user, role: 'admin' });
        }

        res.json(user);
    });
});

// 3. CREATE ORDER
app.post('/api/create-order', async (req, res) => {
    const { amount, user_id } = req.body;
    const options = { amount: amount * 100, currency: "INR", receipt: `receipt_${Date.now()}` };

    try {
        const order = await razorpay.orders.create(options);
        db.run(`INSERT INTO donations (user_id, amount, status, order_id) VALUES (?, ?, 'Pending', ?)`,
            [user_id, amount, order.id]);
        res.json(order);
    } catch (err) {
        res.status(500).send(err);
    }
});

// 4. VERIFY PAYMENT
app.post('/api/verify-payment', (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest('hex');

    if (generated_signature === razorpay_signature) {
        db.run(`UPDATE donations SET status = 'Success', payment_id = ? WHERE order_id = ?`,
            [razorpay_payment_id, razorpay_order_id],
            () => res.json({ status: "success" }));
    } else {
        db.run(`UPDATE donations SET status = 'Failed' WHERE order_id = ?`,
            [razorpay_order_id],
            () => res.status(400).json({ status: "failed" }));
    }
});

// 5. GET USER HISTORY (This was MISSING in your upload!)
app.get('/api/my-donations/:userId', (req, res) => {
    const userId = req.params.userId;
    db.all(`SELECT * FROM donations WHERE user_id = ? ORDER BY date DESC`, [userId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 6. ADMIN: GET ALL USERS
app.get('/api/admin/users', (req, res) => {
    db.all(`SELECT id, name, email, role FROM users`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 7. ADMIN: GET ALL DONATIONS
app.get('/api/admin/donations', (req, res) => {
    db.all(`SELECT donations.*, users.name, users.email FROM donations LEFT JOIN users ON donations.user_id = users.id`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.listen(5000, () => console.log("Server running on port 5000"));