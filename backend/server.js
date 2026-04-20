import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { auth, db } from './firebaseAdmin.js';

dotenv.config();

const app = express();

const corsOptions = {
  origin: (process.env.FRONTEND_URLS || 'http://localhost:5173').split(',').map((url) => url.trim()),
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ limit: '10mb', extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  console.log('✅ Razorpay initialized');
} else {
  console.log('⚠️  Razorpay not initialized - missing keys');
}

const plans = {
  starter: { amount: 19900, intervalDays: 30, description: 'Starter Plan' },
  monthly: { amount: 49900, intervalDays: 30, description: 'Monthly Plan' },
  yearly: { amount: 499900, intervalDays: 365, description: 'Yearly Plan' },
};

const getIdToken = (req) => {
  const authHeader = req.headers.authorization || '';
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  return req.body.idToken || req.query.idToken || null;
};

const verifyUser = async (req, res, next) => {
  try {
    const idToken = getIdToken(req);
    if (!idToken) {
      return res.status(401).json({ error: 'Missing auth token' });
    }

    const decoded = await auth.verifyIdToken(idToken);
    req.uid = decoded.uid;
    req.userEmail = decoded.email || null;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid auth token', details: error.message });
  }
};

const createUserDocument = async (uid, email) => {
  const userRef = db.doc(`users/${uid}`);
  const userSnap = await userRef.get();

  if (!userSnap.exists) {
    await userRef.set({
      email,
      createdAt: new Date(),
      subscription: {
        status: 'free',
        planId: null,
      },
    });
  }
};

const computeExpiry = (intervalDays) => {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + intervalDays);
  return expiry;
};

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'therapyjoy-backend' });
});

app.get('/api/profile', verifyUser, async (req, res) => {
  await createUserDocument(req.uid, req.userEmail);
  const userDoc = await db.doc(`users/${req.uid}`).get();
  return res.json({ id: req.uid, ...userDoc.data() });
});

app.post('/api/progress', verifyUser, async (req, res) => {
  const { date, mood, score, notes, details = {} } = req.body;
  if (!date || typeof mood !== 'string' || typeof score !== 'number') {
    return res.status(400).json({ error: 'Required fields: date, mood, score' });
  }

  const progressRef = db.doc(`users/${req.uid}/progress/${date}`);
  await progressRef.set(
    {
      date,
      mood,
      score,
      notes: notes || '',
      details,
      updatedAt: new Date(),
    },
    { merge: true }
  );

  await createUserDocument(req.uid, req.userEmail);
  return res.json({ status: 'saved', date });
});

app.get('/api/progress', verifyUser, async (req, res) => {
  const { date, startDate, endDate } = req.query;
  const progressCollection = db.collection(`users/${req.uid}/progress`);

  if (date) {
    const doc = await progressCollection.doc(date).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Progress not found' });
    }
    return res.json({ id: doc.id, ...doc.data() });
  }

  let query = progressCollection.orderBy('date', 'desc');
  if (startDate && endDate) {
    query = query.where('date', '>=', startDate).where('date', '<=', endDate);
  }

  const snapshot = await query.limit(100).get();
  const progress = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return res.json(progress);
});

app.post('/api/subscriptions/create-order', verifyUser, async (req, res) => {
  const { planId } = req.body;
  const plan = plans[planId];

  if (!plan) {
    return res.status(400).json({ error: 'Invalid planId' });
  }

  if (!razorpay) {
    return res.status(503).json({
      error: 'Payment service is not configured',
      details: 'Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in backend environment',
    });
  }

  const order = await razorpay.orders.create({
    amount: plan.amount,
    currency: 'INR',
    receipt: `therapyjoy_${req.uid}_${Date.now()}`,
    notes: {
      uid: req.uid,
      planId,
    },
  });

  return res.json({ orderId: order.id, amount: order.amount, currency: order.currency, planId });
});

app.post('/api/subscriptions/verify', verifyUser, async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !planId) {
    return res.status(400).json({ error: 'Missing subscription verification fields' });
  }

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ error: 'Invalid Razorpay signature' });
  }

  const plan = plans[planId];
  if (!plan) {
    return res.status(400).json({ error: 'Invalid planId' });
  }

  const expiresAt = computeExpiry(plan.intervalDays);
  const userRef = db.doc(`users/${req.uid}`);

  await userRef.set(
    {
      subscription: {
        planId,
        status: 'active',
        startedAt: new Date(),
        expiresAt,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
      },
    },
    { merge: true }
  );

  await db.doc(`users/${req.uid}/payments/${razorpay_payment_id}`).set({
    planId,
    amount: plan.amount,
    status: 'paid',
    createdAt: new Date(),
    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id,
    razorpaySignature: razorpay_signature,
  });

  return res.json({ status: 'subscription_active', planId, expiresAt });
});

app.get('/api/subscriptions/status', verifyUser, async (req, res) => {
  const userDoc = await db.doc(`users/${req.uid}`).get();
  const data = userDoc.exists ? userDoc.data() : null;

  if (!data) {
    return res.status(404).json({ error: 'User profile not found' });
  }

  return res.json({ subscription: data.subscription || { status: 'free', planId: null } });
});

const port = process.env.PORT || 4001;
app.listen(port, () => {
  console.log(`TherapyJoy backend listening on http://localhost:${port}`);
});