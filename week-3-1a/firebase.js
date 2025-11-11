// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBbuqIuRWsT4AQmvA8blQWOhknNyZKmEd4",
  authDomain: "task-manager---1a.firebaseapp.com",
  projectId: "task-manager---1a",
  storageBucket: "task-manager---1a.firebasestorage.app",
  messagingSenderId: "1081569787669",
  appId: "1:1081569787669:web:25d698bc23cef9aa93b31c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;