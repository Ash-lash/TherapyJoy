# TherapyJoy - Multi-Device Responsive Application

A complete mental health and therapy support application designed to work seamlessly across all devices - mobile phones, tablets, and desktops.

## 🎯 Key Features

✨ **Fully Responsive Design**
- Mobile-first approach (320px and up)
- Optimized for all screen sizes
- Touch-friendly interface with 40px+ tap targets

🔐 **Secure Authentication**
- Firebase Authentication
- Secure token-based API communication
- Role-based access control

💳 **Payment Integration**
- Razorpay subscription management
- Multiple subscription tiers (Starter, Monthly, Yearly)
- Secure payment verification

📊 **Progress Tracking**
- Mood tracking and logging
- Daily check-ins
- Progress visualization
- Historical data analysis

🎮 **Engaging Content**
- Interactive games for mental wellness
- Educational videos
- Professional advice from doctors
- Real-time support

🌐 **Multi-Platform Support**
- Web (React)
- Mobile (React Native/Expo)
- Tablet optimized
- Cross-device synchronization

## 📱 Device Support

| Device Type | Screen Sizes | Features |
|---|---|---|
| **Mobile Phone** | 320px - 639px | Hamburger menu, single-column layout, touch-optimized |
| **Tablet** | 640px - 1023px | Two-column layout, optimize spacing, medium icons |
| **Desktop** | 1024px+ | Full multi-column layout, optimal spacing, hover states |
| **Large Desktop** | 1536px+ | Maximum width container, comfortable spacing |

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn
- Firebase project account
- Razorpay account (for payments)

### Installation

1. **Clone Repository**
```bash
git clone <repository-url>
cd therapyjoy-frontend---Copy-main
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.development .env
# Update .env with your credentials
npm run dev
```

3. **Frontend Setup**
```bash
cd "therapyjoy-frontend - Copy"
npm install
cp .env.development .env
# Update .env with Firebase credentials
npm start
```

Visit `http://localhost:3000` to access the application.

### Access on Different Devices

**Same Network:**
- Find your computer's IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
- Access from mobile/tablet: `http://<your-ip>:3000`

**Internet:**
- Deploy and access via your domain

## 📁 Project Structure

```
therapyjoy-frontend---Copy-main/
│
├── backend/
│   ├── server.js                 # Express.js server
│   ├── firebaseAdmin.js          # Firebase configuration
│   ├── package.json
│   └── .env.development/.env.production
│
├── therapyjoy-frontend - Copy/   # Web Application
│   ├── public/
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   └── Icon.jsx
│   │   ├── context/              # React context (Auth)
│   │   ├── layout/               # Layout components
│   │   ├── pages/                # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Videos.jsx
│   │   │   ├── Doctors.jsx
│   │   │   └── Game.jsx
│   │   ├── styles/
│   │   │   └── global.css        # Responsive styles
│   │   ├── api.js                # API client
│   │   ├── firebase.js           # Firebase config
│   │   └── App.jsx               # Main app component
│   ├── tailwind.config.js        # Tailwind CSS config
│   ├── package.json
│   └── .env.development/.env.production
│
├── therapyjoy-mobile/            # Mobile App (React Native)
│   ├── app/
│   ├── components/
│   ├── package.json
│   └── ...
│
├── SETUP_GUIDE.md                # Detailed setup guide
├── .gitignore                    # Git ignore rules
├── README.md                     # This file
└── firestore.rules               # Firestore security rules
```

## 🔒 Environment Variables

### Frontend (.env)
```bash
REACT_APP_API_BASE=http://localhost:4001/api
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
```

### Backend (.env)
```bash
NODE_ENV=development
PORT=4001
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
FIREBASE_ADMIN_SDK=./path/to/serviceAccount.json
FRONTEND_URLS=http://localhost:3000,http://127.0.0.1:3000
```

## 🎨 Responsive Features

### CSS Media Queries
- `xs` (320px) - Small phones
- `sm` (640px) - Tablets in portrait
- `md` (768px) - Tablets in landscape  
- `lg` (1024px) - Small desktops
- `xl` (1280px) - Desktops
- `2xl` (1536px) - Large desktops

### Responsive Components
- **Navbar** - Hamburger menu on mobile, full menu on desktop
- **Grid Layouts** - Columns change based on screen size
- **Forms** - Full width on mobile, contained on desktop
- **Typography** - Sizes scale with viewport using `clamp()`
- **Images** - Responsive sizing and lazy loading

## 🔌 API Endpoints

### Authentication
- `GET /api/health` - Health check

### User
- `GET /api/profile` - Get user profile
- `POST /api/progress` - Save mood entry
- `GET /api/progress` - Get progress history

### Payments
- `POST /api/subscriptions/create-order` - Create payment order
- `POST /api/subscriptions/verify` - Verify payment
- `GET /api/subscriptions/status` - Get subscription status

## 📱 Mobile Optimization

- **43px+ tap targets** for easy mobile interaction
- **Responsive images** with proper scaling
- **Touch-friendly navigation** with hamburger menu
- **Optimized performance** for slow connections
- **Offline support** ready (localStorage caching)

## 🚢 Deployment

### Frontend (Vercel/Netlify)
1. Build: `npm run build`
2. Deploy `/build` folder
3. Set REACT_APP_API_BASE to production URL
4. Enable automatic deployments from GitHub

### Backend (AWS/Heroku/Railway)
1. Set NODE_ENV=production
2. Update FRONTEND_URLS with production domain
3. Configure database and Firebase
4. Deploy with Docker or direct upload

## 📊 Performance Metrics

- **Lighthouse Score** target: 85+
- **First Contentful Paint** (FCP): < 2.5s
- **Largest Contentful Paint** (LCP): < 4s
- **Cumulative Layout Shift** (CLS): < 0.1

## 🛠️ Tech Stack

**Frontend:**
- React 18.2
- React Router 6
- Tailwind CSS 3
- Framer Motion
- Firebase
- Axios/Fetch

**Backend:**
- Node.js
- Express.js
- Firebase Admin SDK
- Razorpay
- CORS

**Design:**
- Mobile-first responsive design
- CSS Grid & Flexbox
- Custom CSS animations
- Accessible components (WCAG 2.1)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test on multiple devices
4. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 📞 Support

For issues and questions:
1. Check the [SETUP_GUIDE.md](./SETUP_GUIDE.md)
2. Review [troubleshooting section](./SETUP_GUIDE.md#troubleshooting)
3. Check browser console for errors
4. Verify environment variables

## 🎯 Future Enhancements

- [ ] Offline first app
- [ ] Real-time notifications
- [ ] Video streaming optimization
- [ ] PWA support
- [ ] Native mobile apps
- [ ] Advanced analytics dashboard
- [ ] Telemedicine integration
- [ ] AI-powered recommendations

---

**Made with ❤️ for mental wellness**

Last Updated: April 2026 | Version: 1.0.0
