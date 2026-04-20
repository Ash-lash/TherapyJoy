# TherapyJoy - Production Deployment Guide

## 📋 Complete Step-by-Step Instructions

---

## **STEP 1: Add Firebase Credentials to .env (Production Mode)**

### **What is Firebase?**
Firebase is Google's hosted backend-as-a-service platform. It provides:
- User authentication (login/signup)
- Cloud database (Firestore) to store user data
- Real-time data syncing
- Security rules to protect your data

### **1.1 Get Your Firebase Credentials**

**Process:**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create Project" or select your existing project
3. Name it "TherapyJoy" (or your preferred name)
4. Complete the setup wizard

**Add Your Apps:**
1. In Firebase Console, click the gear icon ⚙️ → Project Settings
2. Click "Add App" and choose "Web"
3. Register your app with name "therapyjoy-web"
4. You'll receive this configuration:
   ```javascript
   {
     apiKey: "AIza...",                    // API Key
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123..."
   }
   ```

### **1.2 Set Up Backend (Server-Side) Firebase Credentials**

**Get Service Account Key:**
1. In Firebase Console → Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. A JSON file downloads (keep it SAFE - never commit to git!)

**File contents look like:**
```json
{
  "type": "service_account",
  "project_id": "therapyjoy-abc123",
  "private_key_id": "key123abc",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxx@therapyjoy-abc123.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs"
}
```

### **1.3 Update Backend .env File**

**Edit:** `backend/.env.production`

```env
# Backend Configuration
NODE_ENV=production
PORT=4001

# Firebase Admin SDK (Backend Authentication)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@therapyjoy-abc123.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"

# Razorpay (Payment Processing)
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=your_secret_key

# CORS (Allowed frontend URLs)
FRONTEND_URLS=https://therapyjoy.com,https://www.therapyjoy.com
```

**Important Security Notes:**
- ✅ Add `.env*` to `.gitignore` (already done)
- ✅ Never commit `.env` files to GitHub
- ✅ Use environment variables on production servers
- ✅ Rotate keys regularly

### **1.4 Update Frontend .env File**

**Edit:** `therapyjoy-frontend - Copy/.env.production`

```env
# Frontend Configuration
NODE_ENV=production
REACT_APP_API_BASE=https://api.therapyjoy.com/api

# Firebase Frontend SDK (Client-side Authentication)
REACT_APP_FIREBASE_API_KEY=AIza... (your web api key)
REACT_APP_FIREBASE_AUTH_DOMAIN=therapyjoy-abc123.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=therapyjoy-abc123
REACT_APP_FIREBASE_STORAGE_BUCKET=therapyjoy-abc123.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc123...
```

### **1.5 Update Backend Server Code**

The backend `firebaseAdmin.js` will now use your real Firebase credentials instead of mock data:

```javascript
// This code already exists - it will automatically use real Firebase
// when FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY are set
```

---

## **STEP 2: Integrate Razorpay Payment Keys**

### **What is Razorpay?**
Razorpay is an Indian payment gateway that allows you to:
- Accept credit/debit card payments
- Process digital wallet payments
- Manage subscriptions
- Handle refunds

### **2.1 Create Razorpay Account & Get Keys**

**Process:**
1. Visit [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Sign up with your business email
3. Complete KYC (Know Your Customer) verification
4. Go to Settings → API Keys
5. You'll see two keys:
   - **Key ID** (public, safe to share)
   - **Key Secret** (KEEP SAFE, never share)

**Example Keys:**
```
Key ID:     rzp_live_1Aa00000000001
Key Secret: fL7xxxxxxxxxxxxxxxx (keep secret!)
```

### **2.2 Update .env with Razorpay Keys**

**Edit:** `backend/.env.production`

```env
# Razorpay Payment Gateway
RAZORPAY_KEY_ID=rzp_live_1Aa00000000001
RAZORPAY_KEY_SECRET=fL7xxxxxxxxxxxxxxxx
```

### **2.3 How Razorpay Integration Works**

The backend already has Razorpay integrated in `server.js`. Here's the flow:

**Frontend → Backend → Razorpay → User**

```
1. User clicks "Buy Subscription"
   ↓
2. Frontend sends: POST /api/subscriptions/create-order
   { planId: "monthly", amount: 49900 }
   ↓
3. Backend creates Razorpay order:
   - Uses KEY_ID + KEY_SECRET for authentication
   - Returns order details to frontend
   ↓
4. Frontend opens Razorpay payment modal
   - User enters card/wallet details
   - Razorpay handles payment securely
   ↓
5. After payment, frontend verifies:
   - POST /api/subscriptions/verify
   - Confirms payment with backend
   ↓
6. Backend updates user subscription in Firebase
```

### **2.4 Payment Plans Already Configured**

These plans are in `backend/server.js`:

```javascript
const plans = {
  starter: { 
    amount: 19900,      // ₹199 in paise
    intervalDays: 30, 
    description: "Starter Plan" 
  },
  monthly: { 
    amount: 49900,      // ₹499 in paise
    intervalDays: 30, 
    description: "Monthly Plan" 
  },
  yearly: { 
    amount: 499900,     // ₹4,999 in paise
    intervalDays: 365, 
    description: "Yearly Plan" 
  },
};
```

---

## **STEP 3: Add Content & Styling Improvements**

### **3.1 Update Home Page Content**

**File:** `therapyjoy-frontend - Copy/src/pages/Home.jsx`

Replace the basic content with engaging copy:

```jsx
// Add welcoming messages
// Testimonials from users
// Feature highlights
// Call-to-action buttons
// Progress statistics
```

### **3.2 Improve Visual Design**

**Things to enhance:**
1. **Hero Section** - Add compelling tagline
2. **Feature Cards** - Show therapy benefits
3. **Testimonials** - Add user success stories
4. **Pricing Section** - Display subscription plans
5. **Call-to-Actions** - Clear buttons for signup

### **3.3 Add Images & Icons**

1. Create `src/assets/images/` folder
2. Add:
   - Logo
   - Hero images
   - Feature icons
   - Testimonial avatars

### **3.4 Customize Colors**

**File:** `src/styles/global.css`

Update the color variables:

```css
:root {
  --primary: #6C63FF;        /* Purple - Change to your brand color */
  --primary2: #34D399;       /* Green - Therapy/wellness color */
  --secondary: #38BDF8;      /* Blue - Trust/calm color */
  --accent: #f97316;         /* Orange - Action/energy */
}
```

### **3.5 Add More Pages**

Create new pages for:
- About Us
- How It Works
- Blog/Resources
- Contact Us
- FAQs

---

## **STEP 4: Deploy to Production**

### **4.1 Choose a Hosting Platform**

**For Frontend (React):**
- **Vercel** (Recommended - easiest)
- **Netlify**
- **AWS S3 + CloudFront**
- **GitHub Pages**

**For Backend (Node.js):**
- **Heroku** (Easy, but paid)
- **Railway.app** (Modern, affordable)
- **AWS EC2** (Scalable, complex)
- **DigitalOcean** (Good balance)
- **Render.com** (Easy deployment)

### **4.2A Deploy Frontend to Vercel (Recommended)**

**Step 1: Prepare for Deployment**

```bash
cd "therapyjoy-frontend - Copy"

# Build production version
npm run build

# This creates optimized files in /build folder
```

**Step 2: Upload to GitHub**

```bash
# Initialize git (if not done)
git init
git add .
git commit -m "Initial TherapyJoy production build"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/therapyjoy.git
git push -u origin main
```

**Step 3: Deploy on Vercel**

1. Visit [Vercel](https://vercel.com)
2. Click "Import Project"
3. Connect your GitHub account
4. Select your `therapyjoy` repository
5. Configure:
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
6. Add Environment Variables:
   ```
   REACT_APP_API_BASE=https://api.therapyjoy.com/api
   REACT_APP_FIREBASE_API_KEY=AIza...
   (add all Firebase keys)
   ```
7. Click "Deploy"
8. Get your live URL: `https://therapyjoy.vercel.app`

### **4.2B Deploy Backend to Railway.app (Recommended)**

**Step 1: Prepare Repository**

```bash
cd backend

# Create .env.production file with your credentials
# Push to GitHub

git add -A
git commit -m "Backend production ready"
git push
```

**Step 2: Deploy on Railway**

1. Visit [Railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Choose your backend repository
5. Configure:
   - **Start Command:** `npm start`
   - **PORT:** `4001`
6. Add Environment Variables:
   ```
   NODE_ENV=production
   FIREBASE_PROJECT_ID=...
   FIREBASE_CLIENT_EMAIL=...
   FIREBASE_PRIVATE_KEY=...
   RAZORPAY_KEY_ID=...
   RAZORPAY_KEY_SECRET=...
   FRONTEND_URLS=https://therapyjoy.com
   ```
7. Deploy
8. Get your backend URL: `https://therapyjoy-api.railway.app`

### **4.3 Update Frontend .env for Production**

Once backend is deployed:

```env
# In Vercel environment variables:
REACT_APP_API_BASE=https://therapyjoy-api.railway.app/api
```

### **4.4 Get Your Domain**

**Option 1: Free Subdomains**
- Railway: `yourusername-therapyjoy.railway.app`
- Vercel: `therapyjoy.vercel.app`

**Option 2: Custom Domain (Better)**
1. Buy domain from [Namecheap](https://namecheap.com) or [GoDaddy](https://godaddy.com)
2. Configure DNS records:
   - Frontend → Vercel DNS
   - Backend → Railway DNS
3. Configure in Vercel/Railway dashboard

### **4.5 Enable HTTPS (SSL Certificate)**

✅ Vercel: Automatic HTTPS
✅ Railway: Automatic HTTPS
✅ Custom domain: Free SSL from Let's Encrypt

### **4.6 Test Production Deployment**

```bash
# Test frontend
curl https://therapyjoy.com

# Test backend
curl https://api.therapyjoy.com/api/health

# Test API connection
curl https://api.therapyjoy.com/api/health
# Should return: { "status": "ok", "service": "therapyjoy-backend" }
```

---

## **🚀 Deployment Checklist**

### Before Deploying:
- [ ] Firebase credentials added to `.env.production`
- [ ] Razorpay keys added to `.env.production`
- [ ] Content updated with real copy
- [ ] Images added and optimized
- [ ] Colors customized to brand
- [ ] CORS URLs updated
- [ ] `.env` files added to `.gitignore`
- [ ] All tests passing locally

### During Deployment:
- [ ] Frontend built and optimized
- [ ] Environment variables configured
- [ ] Domain/subdomain set up
- [ ] HTTPS enabled
- [ ] Backend API responding

### After Deployment:
- [ ] Test login functionality
- [ ] Test payment processing (use Razorpay test mode first)
- [ ] Test data saving in Firebase
- [ ] Monitor error logs
- [ ] Set up email notifications

---

## **🔐 Security Best Practices**

1. **Never Commit Secrets:**
   ```bash
   # .gitignore should have:
   .env
   .env.local
   .env.production.local
   ```

2. **Use Environment Variables:**
   - Never hardcode API keys in code
   - Use server-side environment variables only

3. **Enable Firestore Rules:**
   ```
   // firestore.rules
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{uid} {
         allow read, write: if request.auth.uid == uid;
       }
     }
   }
   ```

4. **Rate Limiting:**
   - Protect API endpoints from abuse
   - Add CORS restrictions
   - Use API keys for rate limiting

5. **Monitor Activity:**
   - Set up error tracking (Sentry)
   - Monitor API usage
   - Track Firebase logs

---

## **📊 Cost Breakdown (Monthly Estimate)**

| Service | Free Tier | Paid Tier | Why |
|---------|-----------|-----------|-----|
| **Vercel** | ✅ Included | $20+ | Frontend hosting & CDN |
| **Railway** | $5 credit | $10+ | Backend server |
| **Firebase** | Free | $25+ | Authentication, Database |
| **Razorpay** | Live (2.36% fee) | - | Payment processing |
| **Domain** | - | $2-15/yr | Custom domain |
| **Total** | Free | ~$35/month | Full production setup |

---

## **🆘 Troubleshooting**

### Frontend Won't Deploy
- Check Node version (need 16+)
- Clear cache: `npm cache clean --force`
- Check for build errors: `npm run build`

### Backend Not Connecting
- Verify FIREBASE_PROJECT_ID is correct
- Check CORS_URLS includes frontend domain
- Test with: `curl https://api.therapyjoy.com/api/health`

### Firebase Auth Not Working
- Verify Firebase credentials
- Check authentication domain in Firebase Console
- Enable authentication method (Email/Password)

### Razorpay Not Working
- Use test keys first (mode: '_ TEST')
- Verify Key ID and Secret
- Check CORS settings allow Razorpay domain

---

## **📚 Useful Resources**

- [Firebase Documentation](https://firebase.google.com/docs)
- [Razorpay API Docs](https://razorpay.com/docs/api/)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [Railway Deployment Guide](https://docs.railway.app)
- [React Production Build](https://react.dev/learn/start-a-new-react-project)

---

**✅ Your application will be live and ready to serve users!**
