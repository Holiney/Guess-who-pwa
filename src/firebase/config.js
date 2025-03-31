import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBabvdVWPrIprmH7OseWGPaejnkSmhsHmU",
  authDomain: "guess-who-1622b.firebaseapp.com",
  databaseURL:
    "https://guess-who-1622b-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "guess-who-1622b",
  storageBucket: "guess-who-1622b.firebasestorage.app",
  messagingSenderId: "556730103156",
  appId: "1:556730103156:web:431a8e76af2c598f98a821",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
export const signIn = () => signInAnonymously(auth);
