import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "DIN_API_KEY",
  authDomain: "DITT_DOMENE",
  projectId: "DITT_PROSJEKT_ID",
  storageBucket: "DITT_BUCKET",
  messagingSenderId: "DIN_SENDER_ID",
  appId: "DIN_APP_ID"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
