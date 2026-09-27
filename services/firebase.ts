import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getDatabase, Database } from 'firebase/database';
import { FIREBASE_CONFIG } from '../constants';

const FALLBACK_CONFIG = {
  apiKey: "AIzaSyDummyKeyForStaticProductionBuild000",
  authDomain: "alphaxen-type-foundry.firebaseapp.com",
  databaseURL: "https://alphaxen-type-foundry-default-rtdb.firebaseio.com",
  projectId: "alphaxen-type-foundry",
  storageBucket: "alphaxen-type-foundry.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:alphaxen001"
};

const resolvedConfig = (FIREBASE_CONFIG && FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.projectId) 
  ? FIREBASE_CONFIG 
  : FALLBACK_CONFIG;

let app: FirebaseApp;
let adminApp: FirebaseApp;

try {
  app = getApps().find(a => a.name === '[DEFAULT]') || initializeApp(resolvedConfig);
} catch (e) {
  try {
    app = initializeApp(FALLBACK_CONFIG);
  } catch {
    app = {} as FirebaseApp;
  }
}

try {
  adminApp = getApps().find(a => a.name === 'adminApp') || initializeApp(resolvedConfig, 'adminApp');
} catch (e) {
  try {
    adminApp = initializeApp(FALLBACK_CONFIG, 'adminApp');
  } catch {
    adminApp = {} as FirebaseApp;
  }
}

// Safely export Auth & Database instances
let authInstance: Auth;
let dbInstance: Database;
let adminAuthInstance: Auth;
let adminDbInstance: Database;

try {
  authInstance = getAuth(app);
} catch {
  authInstance = {
    currentUser: null,
    onAuthStateChanged: (cb: (user: null) => void) => {
      cb(null);
      return () => {};
    },
    signOut: async () => {}
  } as unknown as Auth;
}

try {
  dbInstance = getDatabase(app);
} catch {
  dbInstance = {} as Database;
}

try {
  adminAuthInstance = getAuth(adminApp);
} catch {
  adminAuthInstance = authInstance;
}

try {
  adminDbInstance = getDatabase(adminApp);
} catch {
  adminDbInstance = dbInstance;
}

export const auth = authInstance;
export const db = dbInstance;
export const adminAuth = adminAuthInstance;
export const adminDb = adminDbInstance;
