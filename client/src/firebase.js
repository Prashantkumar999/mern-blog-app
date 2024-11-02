// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-app-4f7af.firebaseapp.com",
  projectId: "mern-blog-app-4f7af",
  storageBucket: "mern-blog-app-4f7af.appspot.com",
  messagingSenderId: "142374202780",
  appId: "1:142374202780:web:a9b34ca892a8dc1d202c59"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);