import React, { useReducer, useEffect } from 'react';
import AuthContext from './authContext';
import authReducer from './authReducer';
import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	onAuthStateChanged,
	signOut,
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { firebaseConfig } from '../../firebase';

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const AuthState = (props) => {
	const initialState = {
		token: localStorage.getItem('token'),
		isAuthenticated: null,
		userData: null,
		loading: true,
		error: null,
	};
	const [state, dispatch] = useReducer(authReducer, initialState);
	
	// Load User
	const loadUser = async (user = null) => {
		// Get the currently signed-in user if no user is passed
		console.log(auth.currentUser);
		user = user || auth.currentUser;

		if (user) {
			try {
				// Fetch additional user data from Firestore if needed
				const userDoc = await getDoc(doc(db, 'users', user.uid));
				const userData = userDoc.exists() ? userDoc.data() : {};
				console.log(userData);
				dispatch({
					type: USER_LOADED,
					payload: { ...userData, uid: user.uid, email: user.email },
				});
			} catch (error) {
				console.error('Error fetching user data:', error);
				dispatch({ type: AUTH_ERROR });
			}
		} else {
			dispatch({ type: AUTH_ERROR });
		}
	};


	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				// User is signed in, load user data
				loadUser(user);
			} else {
				// User is signed out
				dispatch({ type: AUTH_ERROR });
			}
		});
		// Cleanup subscription on unmount
		return () => unsubscribe();
	}, []);

	// Register User
	const register = async (formData) => {
		const { email, password, name } = formData;
		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			const user = userCredential.user;

			await setDoc(doc(db, 'users', user.uid), {
				name,
				email,
				createdAt: new Date(),
				habits: [],
			});

			dispatch({ type: REGISTER_SUCCESS, payload: user });
			loadUser(user);
		} catch (error) {
			dispatch({ type: REGISTER_FAIL, payload: error.message });
		}
	};

	// Login User
	const login = async (formData) => {
		const { email, password } = formData;
		try {
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			const user = userCredential.user;

			// Fetch additional user data from Firestore if needed
			const userDoc = await getDoc(doc(db, 'users', user.uid));
			const userData = userDoc.exists() ? userDoc.data() : {};

			dispatch({
				type: LOGIN_SUCCESS,
				payload: { ...userData, uid: user.uid, email: user.email },
			});
			loadUser(user);
		} catch (error) {
			dispatch({ type: LOGIN_FAIL, payload: error.message });
		}
	};

	// Logout
	const logout = async () => {
		await signOut(auth);
		dispatch({ type: LOGOUT });
	};

	// Clear Errors
	const clearErrors = () => {
		dispatch({ type: CLEAR_ERRORS });
	};

	return (
		<AuthContext.Provider
			value={{
				token: state.token,
				isAuthenticated: state.isAuthenticated,
				loading: state.loading,
				userData: state.userData,
				error: state.error,
				loadUser,
				register,
				login,
				logout,
				clearErrors,
			}}
		>
			{props.children}
		</AuthContext.Provider>
	);
};

export default AuthState;
