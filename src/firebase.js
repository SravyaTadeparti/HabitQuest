// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAwdlaQlGgWlTFLVuTqWfJX5l9KI3VJaBA",
  authDomain: "habitquest-11cd1.firebaseapp.com",
  projectId: "habitquest-11cd1",
  storageBucket: "habitquest-11cd1.firebasestorage.app",
  messagingSenderId: "130383795111",
  appId: "1:130383795111:web:0b0a5dcb6ced0875ad9c82"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 


export default app;
