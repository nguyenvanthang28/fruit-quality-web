
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAO9za5S85vaKOE4d1JkWttQKnG6dsQzWM",
    authDomain: "fruit-quality-detection-d681e.firebaseapp.com",
    projectId: "fruit-quality-detection-d681e",
    storageBucket: "fruit-quality-detection-d681e.firebasestorage.app",
    messagingSenderId: "683448392394",
    appId: "1:683448392394:web:498720e1f507d755523233",
    measurementId: "G-QW6MZCZBV5"
  };


const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const db = getFirestore(app);