import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAj4TEz_mcfwzB-G7yDCs7UdsWsKKLc2MA",
    authDomain: "myportfolio-a3bed.firebaseapp.com",
    projectId: "myportfolio-a3bed",
    storageBucket: "myportfolio-a3bed.firebasestorage.app",
    messagingSenderId: "905190248490",
    appId: "1:905190248490:web:d8b47d811488b39b717353"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
