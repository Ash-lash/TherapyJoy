import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const keyPath = path.join(__dirname, 'serviceAccountKey.json');

let auth;
let db;

if (fs.existsSync(keyPath)) {
  const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
  if (!admin.apps.length) {
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  }
  auth = admin.auth();
  db = admin.firestore();
  console.log('✅ Firebase admin initialized from serviceAccountKey.json');
} else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
  }
  auth = admin.auth();
  db = admin.firestore();
  console.log('✅ Firebase admin initialized from env vars');
} else {
  console.error('❌ No Firebase credentials found. Put serviceAccountKey.json in /backend or set FIREBASE_* env vars.');
  process.exit(1);
}

export { admin, auth, db };
