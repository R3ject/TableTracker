// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBK-NOXaAxKHmGGkp7YxsErSG3pxiDHYzY",
  authDomain: "table-tracker-3ace2.firebaseapp.com",
  projectId: "table-tracker-3ace2",
  storageBucket: "table-tracker-3ace2.firebasestorage.app",
  messagingSenderId: "260864217399",
  appId: "1:260864217399:web:4d8b4a9ed885d73d8c0ab2"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
