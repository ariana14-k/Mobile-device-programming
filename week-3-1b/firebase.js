// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDKq3G7GL9aO0EJQvl7-jws97MhhZg1IvU",
  authDomain: "task-manager---1b.firebaseapp.com",
  projectId: "task-manager---1b",
  storageBucket: "task-manager---1b.firebasestorage.app",
  messagingSenderId: "702719528209",
  appId: "1:702719528209:web:63b68ce73592d1b1a9d0b0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;