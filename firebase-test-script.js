const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc, serverTimestamp } = require("firebase/firestore");

const fs = require('fs');
const path = require('path');

// Fallback: Manually parse .env.local if process.env is empty (common in some Node environments)
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
            process.env[key] = value.replace(/^["']|["']$/g, ''); // Remove quotes if present
          }
        }
      });
    }
  } catch (err) {
    console.warn("Could not manually parse .env.local:", err.message);
  }
}

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (!firebaseConfig.projectId || firebaseConfig.projectId === 'undefined') {
  console.error("❌ ERROR: Firebase Project ID is missing! Make sure .env.local is populated and you are running with --env-file=.env.local");
  process.exit(1);
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function createMockUser() {
  const mockUser = {
    fullName: "Saif Test User",
    email: "saif@example.com",
    userType: "buyer",
    interestedItems: ["Pets", "Cars"],
    interestedLocations: ["Dubai", "London", "New York"],
    plan: "priority",
    createdAt: serverTimestamp(),
  };

  try {
    console.log("Attempting to create mock user with config:", {
      projectId: firebaseConfig.projectId,
      email: mockUser.email
    });

    // We'll add it to PrioritySubscribers to test the n8n flow for that tier
    const docRef = await addDoc(
      collection(db, "PrioritySubscribers"),
      mockUser,
    );
    console.log("✅ Mock user created successfully!");
    console.log("ID:", docRef.id);
    console.log("Collection: PrioritySubscribers");
    console.log("Data:", mockUser);
  } catch (e) {
    console.error("❌ Error adding document: ", e);
  }
}

createMockUser();
