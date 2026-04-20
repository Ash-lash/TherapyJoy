# TherapyJoy Backend

This backend provides Firebase Auth verification, Firestore progress storage, and Razorpay subscription order creation and verification.

## Setup

1. Copy `.env.example` to `.env` inside `backend/`.
2. Add Firebase admin credentials and Razorpay keys.
3. Install dependencies:

   npm install

4. Start the server:

   npm run dev

## API Endpoints

- `GET /api/health`
- `GET /api/profile` - returns user profile and subscription state
- `POST /api/progress` - save daily progress
- `GET /api/progress?date=YYYY-MM-DD` - fetch one progress entry
- `GET /api/progress?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` - fetch a range
- `POST /api/subscriptions/create-order` - create Razorpay order
- `POST /api/subscriptions/verify` - verify payment signature and activate subscription
- `GET /api/subscriptions/status` - return subscription status

## Firebase Rules

Use the `firestore.rules` file at the project root to protect user documents. These rules allow only authenticated users to read/write their own data.
