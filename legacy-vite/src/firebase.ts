import { initializeApp, getApps } from "firebase/app";
import { getAuth, browserLocalPersistence, setPersistence } from "firebase/auth";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAAIZ9IcXqAGPSrGJh5sVTBbmcwRlBfyuU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "focatto.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "focatto",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "focatto.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "469248226385",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:469248226385:web:717f09f8ae26be2e783470",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-3F60T7VL9M",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch(() => {});

const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
});

const storage = getStorage(app);

export { app, auth, db, storage };
