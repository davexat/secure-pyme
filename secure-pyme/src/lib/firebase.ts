import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Replace with real configuration from User
// For now, we use placeholders. The app handles missing config gracefully by warning in console.
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "mock-key",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "mock-domain",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "secure-pyme-demo",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "mock-bucket",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "mock-sender",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "mock-app-id"
};

// Initialize only if not already initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export { db };
