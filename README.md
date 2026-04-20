# TherapyJoy

Mobile therapy app for kids on the autism spectrum. React Native (Expo) mobile app + Node/Express backend + Firebase.

## Structure

```
mobile/     Expo app (Expo Router, React Native, Firebase JS SDK)
backend/    Express API (progress endpoints, dummy payments)
```

## Roles

- **Parent** — daily mood check-in, 3 therapy games, progress charts, contact doctor, videos (free + premium gated), profile.
- **Doctor** — patients list, per-child progress + mood view, reply to parent messages, profile.
- **Admin** — users list, change roles, link parent↔doctor, add/manage videos.

## Setup — first time

### 1. Firebase console (one-time)

1. Create Firestore database in **production mode**.
2. Enable **Email/Password** auth.
3. Download a service account key (Project settings → Service accounts → Generate new private key).
4. Save it as `backend/serviceAccountKey.json` (already done — in gitignore).

### 2. Create the first admin user

The app only lets new signups pick `parent` or `doctor`. To create your first admin:

1. Run the mobile app, sign up as a parent.
2. Open Firebase Console → Firestore → `users/{your-uid}` → change `role` to `admin`.
3. Log out and back in.

### 3. Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Backend runs on http://localhost:4001.

### 4. Mobile (Expo)

```bash
cd mobile
npm install
npx expo start
```

Scan the QR code with **Expo Go** on your phone (Android/iOS).

### 5. API base URL (important)

In `mobile/.env` the API base defaults to `http://10.0.2.2:4001/api` (Android emulator → host). On a real phone via Expo Go, change it to your PC's LAN IP, e.g. `http://192.168.1.25:4001/api`.

## Payments

Razorpay is stubbed. Upgrade button activates a dummy subscription directly in Firestore. Wire real keys later in `backend/server.js`.
