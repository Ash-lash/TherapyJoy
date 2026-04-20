import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyCrAufqXVKYqwbBZOgPdwMiHTfgMv9cdGE",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "therapyjoy.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "therapyjoy",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "therapyjoy.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "741783869256",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:741783869256:web:10ea436540c95cfd54457d",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-2YMHWRMPJ3",
};

if (!process.env.REACT_APP_FIREBASE_API_KEY) {
  // Keep the app usable locally, but make it obvious that env vars should be set.
  console.warn('TherapyJoy Firebase config is using the fallback project. Set REACT_APP_FIREBASE_* env vars to connect your own Firebase project.');
}

const app = initializeApp(firebaseConfig);

export default app;