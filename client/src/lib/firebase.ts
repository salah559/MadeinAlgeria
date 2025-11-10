import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDd_SH44Uk7FXdJz2BEPjXl-fi2x3oRns0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "madein-algeria.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "madein-algeria",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "madein-algeria.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "82442665325",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:82442665325:web:daa1e4f2cd98a83474ee64",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-89Q16HKBGE",
};

console.log("Firebase Config:", {
  ...firebaseConfig,
  apiKey: firebaseConfig.apiKey?.substring(0, 10) + "...",
});

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

let analytics: any = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics };
