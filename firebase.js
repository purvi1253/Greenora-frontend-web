import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Use environment variables for production
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyC4gpwagzkwNui0zUTorACQbqU-em2VR0c",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "greenora-a7eb8.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "greenora-a7eb8",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "greenora-a7eb8.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "586745463559",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:586745463559:web:473fccd12b291084c2fba2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);