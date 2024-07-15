import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


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

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
