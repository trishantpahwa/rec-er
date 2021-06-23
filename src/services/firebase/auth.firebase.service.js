import firebase from 'firebase';
import 'firebase/auth';
import Firebase from './firebase.service';

const auth = Firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();

const FirebaseAuthService = {
	signInWithGoogle: async () => {
		try {
			return await auth.signInWithPopup(googleProvider);
		} catch(err) {
			console.log(err);
			return false;
		}
	}
};

export default FirebaseAuthService;
