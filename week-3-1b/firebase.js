// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, getReactNativePersistence, initializeAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

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

let auth;

if (Platform.OS === "web") {
  auth = getAuth(app);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  })
}

export { auth }

export const db = getFirestore(app);

export default app;