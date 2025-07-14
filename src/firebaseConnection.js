// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAL_dh_RVZt_8QBjVusdJvvC488HykdG5Q",
  authDomain: "amizade-feb82.firebaseapp.com",
  projectId: "amizade-feb82",
  storageBucket: "amizade-feb82.firebasestorage.app",
  messagingSenderId: "664233577173",
  appId: "1:664233577173:web:bf2520283d10798c39705c",
  measurementId: "G-TCBBP9WVZP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export{ db }
