import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAcrFonV9mYE_0h4RqWyQ9O0n3Z0muD4n0",
  authDomain: "web-c3ea8.firebaseapp.com",
  projectId: "web-c3ea8",
  storageBucket: "web-c3ea8.appspot.com",
  messagingSenderId: "671484900822",
  appId: "1:671484900822:web:7e35757638c528d5a06077",
};

const app = initializeApp(firebaseConfig);

// Servicios de Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
