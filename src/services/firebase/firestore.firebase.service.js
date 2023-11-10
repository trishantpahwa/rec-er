import 'firebase/firestore';
import { db } from './firebase.service';
import { addDoc, collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';

const FirebaseFirestoreService = {
	addRecord: async (_collection, data) => {
		try {
			const docRef = await addDoc(collection(db, _collection), data);
			if (docRef.id) return { [docRef.id]: data };
			else return false;
		} catch (err) {
			console.log(err);
			return false;
		}
	},
	getRecords: async (_collection, clause) => {
		try {
			const _docs = await getDocs(query(collection(db, _collection), where(...clause)));
			let record = {};
			_docs.forEach((doc) => {
				record[doc.id] = doc.data();
			});
			return record;
		} catch (err) {
			console.log(err);
			return null;
		}
	},
	getRecordByID: async (_collection, id) => {
		try {
			const _doc = await getDoc(doc(collection(db, _collection), id));
			if (!_doc.exists()) {
				return null;
			} else {
				return _doc.data();
			}
		} catch (err) {
			console.log(err);
			return null;
		}
	}
};

export default FirebaseFirestoreService;
