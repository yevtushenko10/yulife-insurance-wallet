import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDupYaAYcCq5fM3pEs3oRHfIQyZyNY11ZM",
  authDomain: "yuwallet-7325a.firebaseapp.com",
  projectId: "yuwallet-7325a",
  storageBucket: "yuwallet-7325a.firebasestorage.app",
  messagingSenderId: "819293509952",
  appId: "1:819293509952:web:5e3cf773401676c2b902a5",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
