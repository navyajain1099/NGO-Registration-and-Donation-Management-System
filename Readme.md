# NSS Charity - NGO Donation Platform

A modern donation management system for NGOs with Razorpay payment integration.

## Features

- 🔐 **User Authentication** - Register and login functionality
- 💳 **Razorpay Payments** - Secure donation processing
- 📊 **User Dashboard** - Make donations and view history
- ⚡ **Admin Panel** - Manage users and track all donations
- 🎨 **Modern UI** - Beautiful glassmorphic design

## Tech Stack

- **Frontend**: React, React Router
- **Backend**: Node.js, Express
- **Database**: SQLite
- **Payments**: Razorpay

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd NGO-Registration-and-Donation-Management-System
```

### 2. Setup Backend
```bash
cd server
npm install
```

Create a `.env` file in the server folder:
```env
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### 3. Setup Frontend
```bash
cd ../client
npm install
```

Create a `.env` file in the client folder:
```env
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
```

## Running the Application

### Start Backend Server
```bash
cd server
node server.js
```
Server runs on `http://localhost:5000`

### Start Frontend
```bash
cd client
npm start
```
App runs on `http://localhost:3000`

## Usage

1. **Register** a new account or **Login** with existing credentials
2. **Make Donations** - Enter amount and complete payment via Razorpay
3. **View History** - Track all your past donations
4. **Admin Access** - Login with admin role to view all users and donations

## License

MIT License