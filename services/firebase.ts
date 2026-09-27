
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { FIREBASE_CONFIG } from '../constants';

// Primary App for Dashboard, Shop, Docs, Login, Signup
const app = getApps().find(a => a.name === '[DEFAULT]') || initializeApp(FIREBASE_CONFIG);
export const auth = getAuth(app);
export const db = getDatabase(app);

// Isolated secondary Firebase App for Admin Portal (Zero session conflict with Dashboard)
const adminApp = getApps().find(a => a.name === 'adminApp') || initializeApp(FIREBASE_CONFIG, 'adminApp');
export const adminAuth = getAuth(adminApp);
export const adminDb = getDatabase(adminApp);
