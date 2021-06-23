import firebase from "firebase";
import { firebaseConfig } from '../../store/firebase.config';

const Firebase = firebase.initializeApp(firebaseConfig);

export default Firebase;