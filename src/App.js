import './App.css';
import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Routes,
	Navigate,
} from 'react-router-dom';
import SignUpPage from './pages/SignUpPage';
import HabitPage from './pages/HabitPage';
import GoalsPage from './pages/GoalsPage';
import TodosPage from './pages/TodosPage';
import HabitDetailsPage from './pages/HabitDetailsPage';
import DashboardPage from './pages/DashboardPage';
import Login from './components/Login';
import PrivateRoute from './components/routing/PrivateRoute';
import NavBar from './components/NavBar';
import AuthState from './context/auth/AuthState';
import AlertState from './context/alert/AlertState';

const App = () => {
	return (
		<AuthState>
			<AlertState>
				<Router>
					<NavBar />
					<Routes>
						{/* Public Routes */}
						<Route path='/signup' element={<SignUpPage />} />
						<Route path='/login' element={<Login />} />

						{/* Private Routes */}
						<Route
							path='/'
							element={<PrivateRoute element={<TodosPage />} />}
						/>
						<Route
							path='/habits'
							element={<PrivateRoute element={<HabitPage />} />}
						/>
						<Route
							path='/habits/:id'
							element={<PrivateRoute element={<HabitDetailsPage />} />}
						/>
						<Route
							path='/goals'
							element={<PrivateRoute element={<GoalsPage />} />}
						/>
						<Route
							path='/dashboard'
							element={<PrivateRoute element={<DashboardPage />} />}
						/>

						{/* Redirects */}
						<Route path='*' element={<Navigate to='/' />} />
					</Routes>
				</Router>
			</AlertState>
		</AuthState>
	);
};

export default App;
