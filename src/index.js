import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import RouteSwitch from './components/RouteSwitch';
import {initializeApp} from "firebase/app";

const root = ReactDOM.createRoot(document.getElementById('root'));
const firebaseConfig = {
  apiKey: "AIzaSyASdEnR44VmBv2py8pLmfQ5gyV2uoMODHM",
  authDomain: "instagram-clone-6461f.firebaseapp.com",
  projectId: "instagram-clone-6461f",
  storageBucket: "instagram-clone-6461f.appspot.com",
  messagingSenderId: "116774780999",
  appId: "1:116774780999:web:a18b45fcb6e71e0e34f162",
  measurementId: "G-SET3FRKDBW"
};
initializeApp(firebaseConfig);


root.render(
  <React.StrictMode>
    <RouteSwitch />
  </React.StrictMode>
);

