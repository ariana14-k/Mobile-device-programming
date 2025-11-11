// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC4WTNrWQdgov-O0mbbGRgTdh6InBS_Pwc",
  authDomain: "task-manager---2a.firebaseapp.com",
  projectId: "task-manager---2a",
  storageBucket: "task-manager---2a.firebasestorage.app",
  messagingSenderId: "374925247420",
  appId: "1:374925247420:web:149be6cddff5a82b1d21b9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app