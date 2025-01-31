// lib/firebaseConfig.ts
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB3DhyQCJriapKmP7J76ie6IHE93inIki4",
  authDomain: "maa-d797b.firebaseapp.com",
  projectId: "maa-d797b",
  storageBucket: "maa-d797b.firebasestorage.app",
  messagingSenderId: "812105886196",
  appId: "1:812105886196:web:814456ef23f727b014b1a1",
  measurementId: "G-DT48J6KFYH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { auth };