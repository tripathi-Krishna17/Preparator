// Import the functions you need from the SDKs you need
import { initializeApp,getApp,getApps } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyDM8cJEj5F8F5OgjOlIg89ly94QiNv1pNQ",
  authDomain: "preparator-d3d16.firebaseapp.com",
  projectId: "preparator-d3d16",
  storageBucket: "preparator-d3d16.firebasestorage.app",
  messagingSenderId: "869059735480",
  appId: "1:869059735480:web:728bc60ea99edf164e694d",
  measurementId: "G-2PRP17QWTJ"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig):getApp();
export const auth=getAuth(app);
export const db=getFirestore(app);