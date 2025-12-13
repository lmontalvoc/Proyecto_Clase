import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCmFJLURMmcdkYAaALe3VerUweU7rZhzHA",
  authDomain: "que-es-esto-481d4.firebaseapp.com",
  projectId: "que-es-esto-481d4",

  // ✅ ESTE ES EL FIX REAL
  storageBucket: "que-es-esto-481d4.appspot.com",

  messagingSenderId: "582590320768",
  appId: "1:582590320768:web:9274ea7d3ce99c0f0ed665",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
