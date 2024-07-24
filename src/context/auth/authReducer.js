import {
	REGISTER_SUCCESS,
	REGISTER_FAIL,
	USER_LOADED,
	AUTH_ERROR,
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	LOGOUT,
	CLEAR_ERRORS,
} from '../types';

export default (state, action) => {
	switch (action.type) {
		case USER_LOADED:
			return {
				...state,
				isAuthenticated: true,
				loading: false,
				userData: action.payload,
				uid: action.payload.uid,
			};

		case REGISTER_SUCCESS:
		case LOGIN_SUCCESS:
			// localStorage.setItem('token', action.payload.token || ''); // Handle token if available
			return {
				...state,
				isAuthenticated: true,
				loading: false,
				userData: action.payload,
				uid: action.payload.uid,
			};

		case REGISTER_FAIL:
		case AUTH_ERROR:
		case LOGIN_FAIL:
		case LOGOUT:
			// localStorage.removeItem('token');
			return {
				...state,
				token: null,
				isAuthenticated: false,
				loading: false,
				userData: null,
				uid: null,
				error: action.payload,
			};

		case CLEAR_ERRORS:
			return {
				...state,
				error: null,
			};

		default:
			return state;
	}
};
