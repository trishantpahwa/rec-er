import 'firebase/firestore';
import Firebase from './firebase.service';

const db = Firebase.firestore();

const FirebaseFirestoreService = {
	addRecord: async (collection, data) => {
		const docRef = await db.collection(collection).add(data);
		if (docRef.id) return { [docRef.id]: data };
		else return false;
	},
	getRecords: async (collection, data, clause) => {
		try {
			const snapshot = await db.collection(collection).where(...clause).get();
			let record = {};
			snapshot.forEach((doc) => {
				record[doc.id] = doc.data();
			});
			return record;
		} catch (err) {
			console.log(err);
			return null;
		}
	},
	getRecordByID: async (collection, id) => {
		try {
			const doc = await db.collection(collection).doc(id).get();
			if (!doc.exists) {
				return null;
			} else {
				return doc.data();
			}
		} catch (err) {
			console.log(err);
			return null;
		}
	}
};

export default FirebaseFirestoreService;
