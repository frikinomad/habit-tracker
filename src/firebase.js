// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyApMZMT1dd-kEK2LcFQgz3rdAco4I3MFwU",
  authDomain: "habit-tracker-8203c.firebaseapp.com",
  projectId: "habit-tracker-8203c",
  storageBucket: "habit-tracker-8203c.appspot.com",
  messagingSenderId: "721732873471",
  appId: "1:721732873471:web:d76b97bdb02bbaeaaef0ca"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };