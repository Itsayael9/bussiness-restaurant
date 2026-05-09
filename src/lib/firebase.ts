import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getDatabase, type Database } from "firebase/database";
import { getStorage, type FirebaseStorage } from "firebase/storage";

// Hardcoded fallback so production builds on Netlify work even when
// .env is not present (it is git-ignored and never uploaded).
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBgLAqHv4-RFP60CwcbV5Zl4B1zyJ8zZjA",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "restaurant-f8fdf.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://restaurant-f8fdf-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "restaurant-f8fdf",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "restaurant-f8fdf.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "186077456314",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:186077456314:web:353a36b7d88e7a86135f83",
};

// Config is always available now (hardcoded fallback guarantees it)
export const isFirebaseConfigured = true;

export const firebaseApp: FirebaseApp | null = isFirebaseConfigured
  ? initializeApp(firebaseConfig)
  : null;

export const firebaseAuth: Auth | null = firebaseApp ? getAuth(firebaseApp) : null;
export const firebaseDb: Database | null = firebaseApp ? getDatabase(firebaseApp) : null;
export const firebaseStorage: FirebaseStorage | null = firebaseApp ? getStorage(firebaseApp) : null;
