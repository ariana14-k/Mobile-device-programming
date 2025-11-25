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
  apiKey: "AIzaSyCpev7jcgmiUNLUF38DRgA9KSKr1SMYHHs",
  authDomain: "task-manager-7120b.firebaseapp.com",
  projectId: "task-manager-7120b",
  storageBucket: "task-manager-7120b.firebasestorage.app",
  messagingSenderId: "535939075835",
  appId: "1:535939075835:web:4c890bf2a1a68579bc6a5e",
  webClientId: "535939075835-rndv56decogb8rhva5as7blm7khsf2bt.apps.googleusercontent.com"
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

export { auth };

export const db = getFirestore(app);

export default app;