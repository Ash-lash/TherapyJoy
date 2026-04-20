# TherapyJoy - Multi-Device Application Setup Guide

## Overview
TherapyJoy is now fully optimized for all devices (mobile, tablet, and desktop). The application includes a responsive frontend built with React and Tailwind CSS, and a robust Node.js/Express backend with Firebase integration and Razorpay payments.

## Project Structure
```
therapyjoy-frontend---Copy-main/
├── backend/                          # Node.js/Express backend
│   ├── server.js                     # Main server file
│   ├── firebaseAdmin.js              # Firebase configuration
│   ├── package.json
│   └── .env.development & .env.production
├── therapyjoy-frontend - Copy/       # React web frontend
│   ├── src/
│   │   ├── components/               # Reusable components
│   │   ├── pages/                    # Page components
│   │   ├── layout/                   # Layout components
│   │   ├── context/                  # Context (Auth)
│   │   └── styles/                   # Global responsive styles
│   ├── tailwind.config.js            # Tailwind CSS config
│   ├── package.json
│   └── .env.development & .env.production
└── therapyjoy-mobile/                # React Native/Expo mobile app
    ├── app/                          # Navigation structure
    ├── components/                   # Reusable components
    └── package.json
```

## Features
✅ **Fully Responsive Design** - Optimized for all screen sizes (320px - 2560px+)
✅ **Mobile-First Approach** - Better performance on smaller devices
✅ **Dynamic Backend Configuration** - Multi-environment support
✅ **Secure Authentication** - Firebase Auth integration
✅ **Payment Integration** - Razorpay subscription management
✅ **Progressive Web App** - Works on all devices

## Installation & Setup

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
# Copy .env.development or .env.production to .env
# Update the following values:
# - RAZORPAY_KEY_ID
# - RAZORPAY_KEY_SECRET
# - FIREBASE_ADMIN_SDK (path to your service account JSON)
# - FRONTEND_URLS (comma-separated list of allowed origins)

# Start development server
npm run dev

# Start production server
npm start
```

### 2. Frontend Setup (Web)

```bash
cd "therapyjoy-frontend - Copy"

# Install dependencies
npm install

# Configure environment variables
# Copy .env.development or .env.production to .env
# Update Firebase credentials and API base URL

# Start development server
npm start

# Build for production
npm run build
```

### 3. Mobile Setup (Optional)

```bash
cd therapyjoy-mobile

# Install dependencies
npm install

# Start development server
npm start

# The app will prompt you to choose a platform:
# - 'a' for Android
# - 'i' for iOS
# - 'w' for Web
```

## Environment Variables

### Frontend (.env)
```
NODE_ENV=development
REACT_APP_API_BASE=http://localhost:4001/api
REACT_APP_FIREBASE_API_KEY=your_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project
REACT_APP_FIREBASE_STORAGE_BUCKET=your_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### Backend (.env)
```
NODE_ENV=development
PORT=4001
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
FIREBASE_ADMIN_SDK=./path/to/serviceAccount.json
FRONTEND_URLS=http://localhost:3000,http://127.0.0.1:3000
```

## Device Responsiveness

The application is designed to work seamlessly on:
- **Mobile (320px - 639px)** - Single column layouts, hamburger menu
- **Tablet (640px - 1023px)** - Two column layouts, improved spacing
- **Desktop (1024px+)** - Full multi-column layouts, optimal spacing

### Key Responsive Features:
- Hamburger navigation menu on mobile
- Dynamic button sizing (min-height: 40px for mobile touch)
- Flexible grid layouts that adapt to screen size
- Responsive typography using `clamp()`
- Touch-friendly spacing and tap targets

## Running the Application

### Development Mode (All Devices)

1. **Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Backend runs on http://localhost:4001
```

2. **Terminal 2 - Frontend:**
```bash
cd "therapyjoy-frontend - Copy"
npm start
# Frontend runs on http://localhost:3000
```

3. **Access on different devices:**
- Desktop: `http://localhost:3000`
- Mobile (same network): `http://<your-ip>:3000`
- Production: Configure domain and HTTPS

### Production Deployment

1. **Build Frontend:**
```bash
cd "therapyjoy-frontend - Copy"
npm run build
# Output goes to ./build/ directory
```

2. **Deploy Frontend:**
- Push to GitHub/GitLab
- Deploy to Vercel, Netlify, or AWS
- Update `REACT_APP_API_BASE` to production backend URL

3. **Deploy Backend:**
- Use Docker or direct deployment
- Set `NODE_ENV=production`
- Update `FRONTEND_URLS` to production domain
- Configure SSL/HTTPS

## API Endpoints

### Health
- `GET /api/health` - Server health check

### User Profile
- `GET /api/profile` - Get user profile (requires auth)

### Progress Tracking
- `POST /api/progress` - Save mood/progress entry
- `GET /api/progress` - Get user progress history

### Subscriptions
- `POST /api/subscriptions/create-order` - Create Razorpay order
- `POST /api/subscriptions/verify` - Verify payment
- `GET /api/subscriptions/status` - Get subscription status

## Responsive Breakpoints (Tailwind CSS)

```
xs: 320px   – Small phones
sm: 640px   – Tablets in portrait
md: 768px   – Tablets in landscape
lg: 1024px  – Small desktops
xl: 1280px  – Desktops
2xl: 1536px – Large desktops
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### API Connection Issues
- Ensure backend is running on correct port
- Check `FRONTEND_URLS` in backend .env
- Verify CORS settings match your domain

### Firebase Issues
- Ensure service account JSON is properly placed
- Check Firebase project credentials
- Verify authentication domain settings

### Mobile Display Issues
- Clear browser cache
- Check viewport meta tag in index.html
- Test with device DevTools

## Performance Tips

- Use production builds for deployment
- Enable gzip compression on server
- Implement image optimization
- Use CDN for static assets
- Monitor Core Web Vitals

## Support

For issues or questions:
1. Check environment variables
2. Review backend logs
3. Check browser console for errors
4. Test API endpoints with curl/Postman

---

**Last Updated:** April 2026
**Version:** 1.0.0
