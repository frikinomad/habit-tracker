import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../context/auth/authContext';

const PrivateRoute = ({ element: Component, ...rest }) => {
	const authContext = useContext(AuthContext);
	const { isAuthenticated, loading } = authContext;

	if (loading) {
		// Optionally, render a loading spinner or message while checking authentication
		return <div>Loading...</div>;
	}

	return isAuthenticated ? Component : <Navigate to='/login' />;
};

export default PrivateRoute;
