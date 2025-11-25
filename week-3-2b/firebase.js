// Import the functions you need from the SDKs you need
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import {getAuth, initializeAuth, getReactNativePersistence} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import { Platform } from "react-native";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCfQJbl3LnWmW6uccBEEAF9wu7epj95JBQ",
  authDomain: "task-manager---2b.firebaseapp.com",
  projectId: "task-manager---2b",
  storageBucket: "task-manager---2b.firebasestorage.app",
  messagingSenderId: "944589264157",
  appId: "1:944589264157:web:cad7e60b5ced771c963df4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

let auth;

if (Platform.OS === "web") {
  auth = getAuth(app);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
}

export {auth};

export const db = getFirestore(app);

export default app;