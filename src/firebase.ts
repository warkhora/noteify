import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD0RxQ4CpNa98wR-oW7xETNoZbD2qxEWsY",
  authDomain: "noteify-e9a57.firebaseapp.com",
  projectId: "noteify-e9a57",
  storageBucket: "noteify-e9a57.firebasestorage.app",
  messagingSenderId: "164619394184",
  appId: "1:164619394184:web:b47eba6dde6d1b41cc933d",
  measurementId: "G-6HHPTBEJQQ"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
