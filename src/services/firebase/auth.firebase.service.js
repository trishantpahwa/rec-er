import 'firebase/auth';
import { auth, googleProvider, signInWithPopup } from './firebase.service';

const FirebaseAuthService = {
	signInWithGoogle: async () => {
		try {
			return await signInWithPopup(auth, googleProvider);
		} catch (err) {
			console.log(err);
			return false;
		}
	}
};

export default FirebaseAuthService;
