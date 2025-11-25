// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

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

const app = initializeApp(firebaseConfig);

let auth;

if (Platform.OS === "web") {
  auth = getAuth(app);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  })
}

export { auth };


export const db = getFirestore(app);
export default app;