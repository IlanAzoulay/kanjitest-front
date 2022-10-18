// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCmEX0_BPOLX6P4O2Nk7GOxfK3xT98slJM",
  authDomain: "kanjitest-a2b8b.firebaseapp.com",
  projectId: "kanjitest-a2b8b",
  storageBucket: "kanjitest-a2b8b.appspot.com",
  messagingSenderId: "433391671340",
  appId: "1:433391671340:web:86cac19e096a35c2729989"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);