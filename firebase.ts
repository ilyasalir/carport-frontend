// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBdnXv8uFaYVuqFWN86tt1yYJx10w-ljC0",
  authDomain: "carport-b76e4.firebaseapp.com",
  projectId: "carport-b76e4",
  storageBucket: "carport-b76e4.appspot.com",
  messagingSenderId: "364550569748",
  appId: "1:364550569748:web:5263719e0b79e00ff80c01"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export{app, auth, googleProvider}