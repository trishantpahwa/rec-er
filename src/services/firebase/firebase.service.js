import { initializeApp } from "firebase/app";
import { getPerformance } from "firebase/performance";
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from '../../store/firebase.config';

const app = initializeApp(firebaseConfig);

const auth = getAuth();
const googleProvider = new GoogleAuthProvider();

const db = getFirestore();

getPerformance(app);


export { auth, db, googleProvider, signInWithPopup };