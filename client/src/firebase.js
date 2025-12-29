// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// 1. IMPORT STORAGE SERVICE
import { getStorage } from "firebase/storage"; 

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC3iXx-EM0pTwpzxc3bZZieEhBbbca0tjc",
  authDomain: "billet-e7abf.firebaseapp.com",
  projectId: "billet-e7abf",
  storageBucket: "billet-e7abf.firebasestorage.app", // <--- This is crucial for images!
  messagingSenderId: "724282040222",
  appId: "1:724282040222:web:482e9e758cff702949008f",
  measurementId: "G-7PWFM3ND2M"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// 2. EXPORT STORAGE (So we can use it in AddProperty.jsx)
export const storage = getStorage(app);