import { FirebaseFirestoreService } from './firebase';
import UsersService from './users.service';

const ConversationsService = {
	create: async (userID, blogID, conversation) =>
		await FirebaseFirestoreService.addRecord(collection, {
			userID,
			blogID,
			conversation,
			timestamp: new Date().getTime()
		}),
	getByBlog: async (blogID) => {
		const conversations = await FirebaseFirestoreService.getRecords(collection, '', [ 'blogID', '==', blogID ]);
		const userIDs = {};
		Object.keys(conversations).map((conversation) => {
			if (userIDs[conversations[conversation].userID])
				userIDs[conversations[conversation].userID].push(conversation);
			else userIDs[conversations[conversation].userID] = [ conversation ];
		});
		const users = {};
		await Promise.all(
			Object.keys(userIDs).map(async (id) => {
				const user = await UsersService.getUserDisplayNameById(id);
				users[id] = user;
			})
		);
		for (var conversation in conversations) {
			conversations[conversation].name = users[conversations[conversation].userID];
			delete conversations[conversation].userID;
		}
		return conversations;
	}
};

const collection = Object.freeze('Conversations');

export default ConversationsService;
