// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCCmnWW-abyjs0T7OQarEUkbGJ5SR8t16U",
  authDomain: "copynpaste-app.firebaseapp.com",
  projectId: "copynpaste-app",
  storageBucket: "copynpaste-app.firebasestorage.app",
  messagingSenderId: "325931465047",
  appId: "1:325931465047:web:9f3bfc1c5a2769c4d8e612",
  measurementId: "G-QGKFZTXX80"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;