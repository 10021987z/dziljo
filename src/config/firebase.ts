// Configuration Firebase pour Dziljo
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyC3PfCi-MEFofCshsJQS-hMGDcXSHZnlA8",
  authDomain: "dzijo-d6fa4.firebaseapp.com",
  projectId: "dzijo-d6fa4",
  storageBucket: "dzijo-d6fa4.firebasestorage.app",
  messagingSenderId: "602787753667",
  appId: "1:602787753667:web:137e942ca008e0105e7c76",
  measurementId: "G-HC6C2ET3FS"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Initialiser les services Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Analytics (uniquement en production et dans le navigateur)
export const analytics = typeof window !== 'undefined' && process.env.NODE_ENV === 'production' 
  ? getAnalytics(app) 
  : null;

export default app;