# 🚀 Production Deployment - Quick Reference Guide

## **QUICK SUMMARY OF ALL 4 STEPS**

---

## **STEP 1️⃣: Firebase Setup (10 minutes)**

### Quick Checklist:
```
□ Create Firebase project at console.firebase.google.com
□ Get Web SDK credentials (for frontend)
□ Download Service Account JSON (for backend)
□ Update backend/.env.production with:
  - FIREBASE_PROJECT_ID
  - FIREBASE_CLIENT_EMAIL
  - FIREBASE_PRIVATE_KEY
□ Update frontend/.env.production with:
  - REACT_APP_FIREBASE_API_KEY
  - REACT_APP_FIREBASE_AUTH_DOMAIN
  - REACT_APP_FIREBASE_PROJECT_ID (same as backend)
  - REACT_APP_FIREBASE_STORAGE_BUCKET
  - REACT_APP_FIREBASE_MESSAGING_SENDER_ID
  - REACT_APP_FIREBASE_APP_ID
```

### Firebase .env Template:

**`backend/.env.production`**
```bash
NODE_ENV=production
PORT=4001

# Firebase (from Service Account JSON)
FIREBASE_PROJECT_ID=your-project-abc123
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgk...\n-----END PRIVATE KEY-----\n"

# Razorpay (we'll get to this next)
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=your_secret

# CORS
FRONTEND_URLS=https://yourdomain.com,https://www.yourdomain.com
```

**`therapyjoy-frontend - Copy/.env.production`**
```bash
NODE_ENV=production
REACT_APP_API_BASE=https://api.yourdomain.com/api

# Firebase (from Web SDK config)
REACT_APP_FIREBASE_API_KEY=AIzaSyA...
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-abc123
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=1234567890
REACT_APP_FIREBASE_APP_ID=1:1234567890:web:abc123def456
```

---

## **STEP 2️⃣: Razorpay Payment Setup (5 minutes)**

### Quick Checklist:
```
□ Create Razorpay account at dashboard.razorpay.com
□ Complete KYC verification
□ Get API keys from Settings → API Keys
□ Add to backend/.env.production:
  - RAZORPAY_KEY_ID (public key)
  - RAZORPAY_KEY_SECRET (secret key)
```

### How It's Already Integrated:

The backend already has Razorpay endpoints ready:

**Endpoint 1: Create Payment Order**
```
POST /api/subscriptions/create-order
Body: { "planId": "monthly" }
Returns: { "orderId": "order_123abc", "amount": 49900 }
```

**Endpoint 2: Verify Payment**
```
POST /api/subscriptions/verify
Body: { "orderId": "order_123abc", "paymentId": "pay_123abc", "signature": "sig123" }
Returns: { "status": "verified", "subscription": "active" }
```

**Endpoint 3: Check Subscription Status**
```
GET /api/subscriptions/status
Returns: { "status": "active", "plan": "monthly", "expiresAt": "2026-05-09" }
```

---

## **STEP 3️⃣: Content & Styling Improvements (30 minutes)**

### What to Improve:

#### A. Update Homepage Content

**File:** `therapyjoy-frontend - Copy/src/pages/Home.jsx`

Add compelling sections:

```jsx
// Hero section improvements:
// - Catchy headline: "Your Mental Health, Simplified"
// - Sub-headline: "Expert therapy + daily wellness in one secure app"
// - CTA Button: "Start Your Free Trial"

// Features section:
// - Mood Tracking: Real-time emotion monitoring
// - Expert Doctors: Connect with licensed therapists
// - Daily Games: Stress relief through interactive games
// - Video Library: 100+ therapeutic videos

// Testimonials:
// - "Changed my life" - User reviews
// - 4.8/5 ratings
// - Success stories
```

#### B. Add/Update Images

Create folder: `therapyjoy-frontend - Copy/public/images/`

Add:
```
├── logo.png (32x32px for favicon)
├── hero.jpg (1920x1080px hero image)
├── feature-1.png (mood tracking illustration)
├── feature-2.png (doctors illustration)
├── feature-3.png (games illustration)
├── testimonial-1.jpg (user avatar)
└── pricing-bg.png (pricing section background)
```

#### C. Update Colors to Match Brand

**File:** `therapyjoy-frontend - Copy/src/styles/global.css`

Update the `:root` section:

```css
:root {
  --bg0: #0b1220;              /* Dark background */
  --bg1: #0f1b34;
  --primary: #6C63FF;          /* Main purple - CHANGE THIS */
  --primary2: #34D399;         /* Green for wellness */
  --secondary: #38BDF8;        /* Blue for trust */
  --accent: #f97316;           /* Orange for CTAs */
  --success: #22c55e;          /* Green for positive actions */
  --warning: #f59e0b;          /* Amber for caution */
  --error: #ef4444;            /* Red for errors */
}
```

#### D. Add Pricing Section

**File:** `therapyjoy-frontend - Copy/src/pages/Home.jsx` (Add new section)

```jsx
function PricingSection() {
  const plans = [
    {
      name: "Starter",
      price: "₹199",
      period: "/month",
      features: ["Daily mood check-ins", "Video library access", "Basic support"]
    },
    {
      name: "Pro",
      price: "₹499",
      period: "/month",
      features: ["Everything in Starter", "Doctor consultations", "Priority support"]
    },
    {
      name: "Premium",
      price: "₹4,999",
      period: "/year",
      features: ["Everything in Pro", "Unlimited consultations", "VIP support"]
    }
  ];

  return (
    <div className="pricing-section">
      <h2>Choose Your Plan</h2>
      <div className="pricing-grid">
        {plans.map(plan => (
          <div key={plan.name} className="pricing-card">
            <h3>{plan.name}</h3>
            <p className="price">{plan.price}<span>{plan.period}</span></p>
            <ul>
              {plan.features.map(feature => (
                <li key={feature}>✓ {feature}</li>
              ))}
            </ul>
            <button className="btn btn-primary">Subscribe Now</button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

#### E. Update Tailwind Config

**File:** `therapyjoy-frontend - Copy/tailwind.config.js`

Add custom colors:

```javascript
theme: {
  extend: {
    colors: {
      therapyPrimary: '#6C63FF',
      therapyGreen: '#34D399',
      therapyBlue: '#38BDF8',
    }
  }
}
```

---

## **STEP 4️⃣: Deploy to Production (20 minutes)**

### **Option A: Deploy Frontend to Vercel + Backend to Railway**

#### Frontend Deployment (Vercel):

**Step 1: Build locally**
```bash
cd "therapyjoy-frontend - Copy"
npm run build
# Creates /build folder with optimized files
```

**Step 2: Push to GitHub**
```bash
git init
git add .
git commit -m "TherapyJoy production ready"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/therapyjoy-frontend.git
git push -u origin main
```

**Step 3: Deploy on Vercel**
1. Go to https://vercel.com
2. Click "Import Project"
3. Connect GitHub & select your repo
4. Settings:
   - Build Command: `npm run build`
   - Output Directory: `build`
5. Add Environment Variables:
   ```
   REACT_APP_API_BASE=https://api.yourdomain.com/api
   REACT_APP_FIREBASE_API_KEY=AIzaSy...
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your-project-abc123
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=1234567890
   REACT_APP_FIREBASE_APP_ID=1:1234567890:web:abc123def456
   ```
6. Click "Deploy"
7. Get your URL: `https://therapyjoy.vercel.app` (or custom domain)

#### Backend Deployment (Railway):

**Step 1: Push backend to GitHub**
```bash
cd backend
git init
git add .
git commit -m "TherapyJoy backend production"
git push -u origin main
```

**Step 2: Deploy on Railway**
1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Select your backend repo
4. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=4001
   FIREBASE_PROJECT_ID=your-project-abc123
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   RAZORPAY_KEY_ID=rzp_live_xxxxx
   RAZORPAY_KEY_SECRET=your_secret_key
   FRONTEND_URLS=https://therapyjoy.vercel.app
   ```
5. Deploy
6. Get your URL: `https://therapyjoy-api.railway.app`

**Step 3: Update Frontend .env**
```
REACT_APP_API_BASE=https://therapyjoy-api.railway.app/api
```

---

## **📝 Testing Checklist After Deployment**

```
□ Frontend loads without errors
□ Login page displays correctly
□ API health check works
  curl https://api.yourdomain.com/api/health
□ Login functionality works (if Firebase configured)
□ Responsive design works on mobile
□ No console errors
□ Images and assets load
□ Buttons are clickable
□ Razorpay payment modal opens (if payment tested)
```

---

## **💡 Next Steps After Production**

1. **Get Your Own Domain**
   - Buy from Namecheap ($2.98 - $15/year)
   - Connect to Vercel (automatic DNS setup)
   - Connect to Railway (automatic DNS setup)

2. **Monitor Your Production**
   - Set up error tracking (Sentry.io - free)
   - Monitor API logs (Railway dashboard)
   - Monitor frontend performance (Vercel analytics)

3. **Optimize for Users**
   - Add analytics (Google Analytics)
   - Track user behavior (Hotjar - free tier)
   - Get user feedback (Typeform)

4. **Scale as You Grow**
   - Upgrade Railway if more traffic
   - Add CDN for images (free with Vercel)
   - Add caching (Redis)

---

## **❓ FAQs**

**Q: How much will this cost?**
A: ~$35/month or free with free tiers:
- Vercel: Free
- Railway: $5 credit + usage
- Firebase: Free tier includes 100k reads/day
- Razorpay: 2.36% per transaction

**Q: How do I add my custom domain?**
A: 
1. Buy from Namecheap
2. Set nameservers to Vercel's nameservers
3. Vercel auto-configures everything

**Q: What if Firebase login doesn't work?**
A: 
1. Check Firebase Console → Authentication → Sign-in method
2. Enable "Email/Password"
3. Check Auth Domain is correct
4. Clear browser cache

**Q: How do I test Razorpay without real payments?**
A:
1. Use Razorpay TEST mode keys (rzp_test_xxxxx)
2. Use test card: 4111 1111 1111 1111
3. Use any future date & CVV

**Q: Can I use free tier forever?**
A: Free tiers are subject to limits:
- Vercel: Free for hobby projects
- Railway: $5 credit only
- Firebase: 100k reads/100k writes/day

---

## **Done! Your App is Live! 🎉**
