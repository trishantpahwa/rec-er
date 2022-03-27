import { FirebaseAuthService, FirebaseFirestoreService } from './firebase';
import SessionService from './session.service';

const UsersService = {
	login: async () => {
		if (!UsersService.checkSession()) {
			const res = await FirebaseAuthService.signInWithGoogle();
			if (res) {
				const name = res.user.displayName;
				const email = res.user.email;
				let user;
				user = await FirebaseFirestoreService.getRecords(collection, '', [ 'email', '==', email ]);
				if (Object.keys(user).length === 0)
					user = await FirebaseFirestoreService.addRecord(collection, { name: name, email: email, createdAt: new Date() });
				user = { ...user, timestamp: new Date().getTime() };
				const encryptedUser = Buffer.from(JSON.stringify(user)).toString('base64');
				SessionService.set('User', encryptedUser.toString('base64'));
				return 'LOGGED_IN';
			} else {
				return false;
			}
		} else {
			return true;
		}
	},
	checkSession: () => {
		let user;
		user = SessionService.get('User');
		if (user) {
			user = JSON.parse(Buffer.from(user, 'base64').toString());
			if ((new Date().getTime() - user.timestamp) / 1000 < 86400) return true;
			else {
				UsersService.logout();
				return false;
			}
		} else return false;
	},
	getCurrentUserID: () => {
		let user;
		user = SessionService.get('User');
		if (user) {
			user = JSON.parse(Buffer.from(user, 'base64').toString());
			if ((new Date().getTime() - user.timestamp) / 1000 < 86400) return Object.keys(user)[0];
			else {
				UsersService.logout();
				return false;
			}
		} else return false;
	},
	getCurrentUserName: () => {
		let user;
		user = SessionService.get('User');
		if (user) {
			user = JSON.parse(Buffer.from(user, 'base64').toString());
			if ((new Date().getTime() - user.timestamp) / 1000 < 86400) return Object.values(user)[0].name;
			else {
				UsersService.logout();
				return 'guest';
			}
		} else return 'guest';
	},
	logout: () => {
		SessionService.remove('User');
	},
	fetchUserFromID: async (id) => await FirebaseFirestoreService.getRecordByID(collection, id),
	getUserDisplayNameById: async (id) => {
		const user = await UsersService.fetchUserFromID(id);
		return user.name;
	}
};

const collection = Object.freeze('Users');

export default UsersService;
