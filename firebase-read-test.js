const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs } = require("firebase/firestore");
const fs = require('fs');
const path = require('path');

// Fallback: Manually parse .env.local if process.env is empty
if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
  try {
    const envPath = path.resolve(__dirname, '.env.local');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      envContent.split('\n').forEach(line => {
        const trimmedLine = line.trim();
        if (trimmedLine && !trimmedLine.startsWith('#')) {
          const firstEqualIndex = trimmedLine.indexOf('=');
          if (firstEqualIndex !== -1) {
            const key = trimmedLine.substring(0, firstEqualIndex).trim();
            const value = trimmedLine.substring(firstEqualIndex + 1).trim();
            process.env[key] = value.replace(/^["']|["']$/g, '');
          }
        }
      });
    }
  } catch (err) {
    console.warn("Could not manually parse .env.local:", err.message);
  }
}

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testRead() {
  console.log("🔍 Attempting to read from project:", firebaseConfig.projectId);
  
  try {
    const colRef = collection(db, "PrioritySubscribers");
    const snapshot = await getDocs(colRef);
    
    console.log("✅ Read successful!");
    console.log("Total documents found:", snapshot.size);
    
    snapshot.forEach((doc) => {
      console.log(`- ID: ${doc.id}`);
      console.log(`  Data:`, doc.data());
    });
    
    if (snapshot.empty) {
      console.log("⚠️ The collection exists but it is EMPTY.");
    }
  } catch (e) {
    console.error("❌ Error reading collection: ", e);
    if (e.code === 'permission-denied') {
      console.error("👉 RECOMMENDATION: Check your Firestore Security Rules in the Firebase Console!");
    }
  }
}

testRead();
