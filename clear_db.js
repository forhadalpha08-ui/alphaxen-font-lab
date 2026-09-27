import { initializeApp } from 'firebase/app';
import { getDatabase, ref, remove } from 'firebase/database';
import { FIREBASE_CONFIG } from './constants.js';

const app = initializeApp(FIREBASE_CONFIG);
const db = getDatabase(app);

remove(ref(db, 'subcustomers')).then(() => {
    console.log('Cleared subcustomers');
    process.exit(0);
}).catch(console.error);
