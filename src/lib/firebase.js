// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";

import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBXBefGErzn5iMDf4KF8z1y4cgMR5jR2B8",
  authDomain: "lengo-1e695.firebaseapp.com",
  projectId: "lengo-1e695",
  storageBucket: "lengo-1e695.firebasestorage.app",
  databaseURL: "https://lengo-1e695-default-rtdb.firebaseio.com",
  messagingSenderId: "172692215187",
  appId: "1:172692215187:web:9dd1f64275b4b43e828466",
  measurementId: "G-SK1FJFDRZZ"
};

// Initialize Firebase safely (avoid duplicate-app during HMR)
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const rtdb = getDatabase(app);
