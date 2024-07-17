// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

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


// Your web app's Firebase configuration
// TEMP - switch to above
// const firebaseConfig = {
//   apiKey: "AIzaSyCwMv_5mLAZqLXxu0N00uNdFVdXM9iDIA8",
//   authDomain: "habit-tracker-nishant.firebaseapp.com",
//   projectId: "habit-tracker-nishant",
//   storageBucket: "habit-tracker-nishant.appspot.com",
//   messagingSenderId: "247907335362",
//   appId: "1:247907335362:web:84f9a3ec37089b7510cf5b"
// };


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { firebaseConfig, auth, db };