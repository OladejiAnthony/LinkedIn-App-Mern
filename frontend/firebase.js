import { initializeApp } from "firebase/app";
import firebase from "firebase/compat/app";
import "firebase/compat/storage"

const firebaseConfig = {
  apiKey: "AIzaSyDidi2Pu0rYRaNnjoy4qGiave2fQJwyHk0",
  authDomain: "linkedin-mern-dd437.firebaseapp.com",
  projectId: "linkedin-mern-dd437",
  storageBucket: "linkedin-mern-dd437.appspot.com",
  messagingSenderId: "946051448539",
  appId: "1:946051448539:web:fc6e776ec20a92fdba96fe",
  measurementId: "G-ZW5MPZWTQ7"
};

// Initialize Firebase
if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig)
}

export {firebase};


/*
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDidi2Pu0rYRaNnjoy4qGiave2fQJwyHk0",
  authDomain: "linkedin-mern-dd437.firebaseapp.com",
  projectId: "linkedin-mern-dd437",
  storageBucket: "linkedin-mern-dd437.appspot.com",
  messagingSenderId: "946051448539",
  appId: "1:946051448539:web:fc6e776ec20a92fdba96fe",
  measurementId: "G-ZW5MPZWTQ7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
*/

