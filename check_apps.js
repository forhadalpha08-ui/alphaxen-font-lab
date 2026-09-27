import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAGLsgTswXSjaBFzoSMSWsFGUUi3yetXeI",
  databaseURL: "https://zenix-auth-b04c1-default-rtdb.firebaseio.com",
  projectId: "zenix-auth-b04c1",
};

const app = initializeApp(FIREBASE_CONFIG);
const db = getDatabase(app);

async function run() {
  const snap = await get(ref(db, "applications"));
  const data = snap.val() || {};
  
  for (const key of Object.keys(data)) {
     console.log("Secret:", key, "Name:", data[key].metadata?.name);
  }
  process.exit(0);
}
run();
