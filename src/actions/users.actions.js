import { UsersConstants } from '../constants';
import { UsersService } from '../services';

const UsersActions = {
	login: () => {
		const request = () => ({ type: UsersConstants.USER_LOGIN_REQUEST });
		const success = () => ({
			type: UsersConstants.USER_LOGIN_SUCCESS
		});
		const notModified = () => ({ type: UsersConstants.USER_LOGIN_NOT_MODIFIED });
		const failure = () => ({ type: UsersConstants.USER_LOGIN_FAILURE });

		return async (dispatch) => {
			try {
				dispatch(request());
				const _user = await UsersService.login();
				if (_user) {
					const userName = UsersService.getCurrentUserName();
					if (_user === 'LOGGED_IN') {
						dispatch(success());
						return { username: userName, output: `Logged in as ${userName}` };
					} else {
						dispatch(notModified());
						return { username: userName, output: `Already logged in as ${userName}` };
					}
				} else {
					dispatch(failure());
					return { username: 'guest', output: 'Unable to login' };
				}
			} catch (err) {
				dispatch(failure());
				console.log(err);
			}
		};
	},
	logout: () => {
		const request = () => ({ type: UsersConstants.USER_LOGOUT_REQUEST });
		const success = () => ({
			type: UsersConstants.USER_LOGOUT_SUCCESS
		});
		const failure = () => ({ type: UsersConstants.USER_LOGOUT_FAILURE });

		return async (dispatch) => {
			try {
				dispatch(request());
				UsersService.logout();
				dispatch(success());
			} catch (err) {
				dispatch(failure());
				console.log(err);
			}
		};
	}
};
export default UsersActions;
