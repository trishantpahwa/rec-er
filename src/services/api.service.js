import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;
// axios.interceptors.request.use((config) => {
// 	const innerConfig = config;
// 	const token = SessionService.get('user-token');
// 	if (token) {
// 		innerConfig.headers.Authorization = `Bearer ${token}`;
// 	}
// 	return innerConfig;
// });

const ApiService = {
	get: async (url, options) => {
		try {
			const { status, data } = await axios(
				{ method: 'GET', url, ...options }
			);
			return { status, data };
		} catch (error) {
			return error.response ? error.response.data : {};
		}
	},

	post: async (url, body) => {
		try {
			const { status, data } = await axios({ method: 'POST', url, data: body });
			return { status, data };
		} catch (error) {
			return error.response ? error.response.data : {};
		}
	},

	put: async (url, body) => {
		try {
			const { status, data } = await axios({ method: 'PUT', url, data: body });
			return { status, data };
		} catch (error) {
			return error.response ? error.response.data : {};
		}
	},

	delete: async (url) => {
		try {
			const { status, data } = await axios({ method: 'DELETE', url });
			return { status, data };
		} catch (error) {
			return error.response ? error.response.data : {};
		}
	}
};

export default ApiService;