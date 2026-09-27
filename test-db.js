import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import * as dotenv from 'dotenv';
dotenv.config();

const FIREBASE_CONFIG = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  databaseURL: process.env.VITE_FIREBASE_DATABASE_URL,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
};

const app = initializeApp(FIREBASE_CONFIG);
const db = getDatabase(app);

async function testDB() {
  try {
    console.log("Fetching config...");
    const snap = await get(ref(db, "system/config"));
    console.log("Config:", snap.val());
    
    console.log("Fetching customers...");
    const snap2 = await get(ref(db, "customers"));
    console.log("Customers exists:", snap2.exists());
    
    process.exit(0);
  } catch (error) {
    console.error("Database error:", error);
    process.exit(1);
  }
}

testDB();
