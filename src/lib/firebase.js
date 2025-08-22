// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBXBefGErzn5iMDf4KF8z1y4cgMR5jR2B8",
  authDomain: "lengo-1e695.firebaseapp.com",
  projectId: "lengo-1e695",
  storageBucket: "lengo-1e695.firebasestorage.app",
  messagingSenderId: "172692215187",
  appId: "1:172692215187:web:9dd1f64275b4b43e828466",
  measurementId: "G-SK1FJFDRZZ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
