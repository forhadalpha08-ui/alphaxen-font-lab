import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
import fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)="?(.*?)"?$/);
  if (match) env[match[1]] = match[2];
});

const app = initializeApp({
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: env.VITE_FIREBASE_DATABASE_URL,
  projectId: env.VITE_FIREBASE_PROJECT_ID
});

const auth = getAuth(app);
const db = getDatabase(app);

async function wipe() {
  try {
    await signInWithEmailAndPassword(auth, env.VITE_ADMIN_EMAIL, env.VITE_ADMIN_PASSWORD);
    console.log('Logged in as admin');
    
    const nodes = ['customers', 'applications', 'resellers', 'system', 'webhookSettings'];
    for (const node of nodes) {
      await set(ref(db, node), null);
      console.log('Cleared: ' + node);
    }
    console.log('Database wipe complete!');
    process.exit(0);
  } catch (err) {
    console.error('Wipe failed:', err);
    process.exit(1);
  }
}
wipe();
