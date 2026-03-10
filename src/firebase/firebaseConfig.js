
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC4QaBFCK2n8toE1pKcl3LkpV8_xOatKpo",
  authDomain: "sweet-memories-35337.firebaseapp.com",
  databaseURL: "https://sweet-memories-35337-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "sweet-memories-35337",
  storageBucket: "sweet-memories-35337.firebasestorage.app",
  messagingSenderId: "1014623511135",
  appId: "1:1014623511135:web:74f2913db3d96ba698f1ea"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);