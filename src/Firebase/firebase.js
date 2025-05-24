import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCw5l3v5CJ6Lk4oMBnKHjHL0_LDPa1rw5k",
    authDomain: "campus-krunch.firebaseapp.com",
    projectId: "campus-krunch",
    storageBucket: "campus-krunch.firebasestorage.app",
    messagingSenderId: "210806108928",
    appId: "1:210806108928:web:5780ba36c5c96229c8f9e5",
    measurementId: "G-8WSSG68MHX"
};  

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };