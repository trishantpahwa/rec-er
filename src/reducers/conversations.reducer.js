import { ConversationsConstants } from '../constants';

const initialState = {};

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initialState, action) => {
	switch (action.type) {
		case ConversationsConstants.CREATE_CONVERSATION_REQUEST:
			return { ...state };
		case ConversationsConstants.CREATE_CONVERSATION_SUCCESS:
			return {
				...state,
				[action.blogID]: {
					...state[action.blogID],
					...action.conversation
				}
			};
		case ConversationsConstants.CREATE_CONVERSATION_FAILURE:
			return { ...state };
		case ConversationsConstants.GET_ALL_CONVERSATIONS_OF_BLOG_REQUEST:
			return { ...state };
		case ConversationsConstants.GET_ALL_CONVERSATIONS_OF_BLOG_SUCCESS:
			return {
				...state,
				[action.blogID]: {
					...state[action.blogID],
					...action.conversations
				}
			};
		case ConversationsConstants.GET_ALL_CONVERSATIONS_OF_BLOG_FAILURE:
			return { ...state };
		// Add cases if already exists, then no need of network call => TP
		default:
			return state;
	}
};
