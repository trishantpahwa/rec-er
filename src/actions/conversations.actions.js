import { ConversationsConstants } from '../constants';
import { ConversationsService } from '../services';

const ConversationsActions = {
	createConversation: (userID, blogID, conversation) => {
		const request = () => ({ type: ConversationsConstants.CREATE_CONVERSATION_REQUEST });
		const success = (blogID, conversation) => ({
			type: ConversationsConstants.CREATE_CONVERSATION_SUCCESS,
			blogID,
			conversation
		});
		const failure = () => ({ type: ConversationsConstants.CREATE_CONVERSATION_FAILURE });

		return async (dispatch) => {
			try {
				dispatch(request);
				const _conversation = await ConversationsService.create(userID, blogID, conversation);
				if (_conversation) dispatch(success(blogID, _conversation));
				else throw _conversation;
			} catch (err) {
				console.log(err);
				dispatch(failure);
			}
		};
	},
	getAllConversationsOfBlog: (blogID) => {
		const request = () => ({ type: ConversationsConstants.GET_ALL_CONVERSATIONS_OF_BLOG_REQUEST });
		const success = (blogID, conversations) => ({
			type: ConversationsConstants.GET_ALL_CONVERSATIONS_OF_BLOG_SUCCESS,
			blogID,
			conversations
		});
		const failure = () => ({ type: ConversationsConstants.GET_ALL_CONVERSATIONS_OF_BLOG_FAILURE });

		return async (dispatch) => {
			try {
				dispatch(request);
				const conversations = await ConversationsService.getByBlog(blogID);
				if (Object.keys(conversations).length) {
					dispatch(success(blogID, conversations));
				}
				return conversations;
			} catch (err) {
				console.log(err);
				dispatch(failure);
			}
		};
	}
};

export default ConversationsActions;
