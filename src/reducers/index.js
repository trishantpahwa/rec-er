import { combineReducers } from 'redux';
import blogs from './blogs.reducer';
import conversations from './conversations.reducer';
// import users from './users.reducer';

export default combineReducers({
    blogs,
    conversations,
    // users  // Not neccessary => TP
});