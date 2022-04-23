// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC5mIvXucr67s2qPgNV_kbcv1FvEMlJt-M",
  authDomain: "nutrios-protocol.firebaseapp.com",
  projectId: "nutrios-protocol",
  storageBucket: "nutrios-protocol.appspot.com",
  messagingSenderId: "948741304871",
  appId: "1:948741304871:web:909897f95ab8a6c59bd402",
  measurementId: "G-XGJKQ24RH4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// const analytics = getAnalytics(app);
