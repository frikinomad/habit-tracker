import React, { Fragment, useContext, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthContext from '../context/auth/authContext';

const NavBar = () => {
	const location = useLocation();
	const navigate = useNavigate(); // Initialize useNavigate
	const authContext = useContext(AuthContext);
	const { isAuthenticated, logout, userData, loadUser } = authContext;

	const getLinkClass = (path) => {
		return location.pathname === path
			? 'text-gray-800 bg-white p-2 rounded'
			: 'text-white hover:text-gray-300';
	};

	useEffect(() => {
		loadUser();
		console.log('userData');
		console.log(userData);
		// eslint-disable-next-line
	}, []); // Add userData as dependency

	const onLogout = async () => {
		await logout(); // Ensure logout completes before navigating
		navigate('/login');
	};

	const authLinks = (
		<Fragment>
			<ul className='flex justify-around items-center space-x-4'>
				<li className='flex items-center'>
					<input
						type='text'
						placeholder='Search'
						className='p-2 rounded-lg border border-gray-300'
					/>
				</li>
				<li>
					<Link to='/' className={getLinkClass('/')}>
						My Profile
					</Link>
				</li>
				<li>
					<Link to='/habits' className={getLinkClass('/habits')}>
						Habits
					</Link>
				</li>
				<li>
					<Link to='/goals' className={getLinkClass('/goals')}>
						Goals
					</Link>
				</li>
				<li>
					<Link to='/today' className={getLinkClass('/today')}>
						Today
					</Link>
				</li>
				<li className='text-white hover:text-gray-300'>
					Hello {userData && userData.name}
				</li>
				<li>
					<a
						onClick={onLogout}
						href='#!'
						className='text-white hover:text-gray-300 cursor-pointer flex items-center'
					>
						<i className='fas fa-sign-out-alt mr-2'></i>
						<span className='hide-sm'>Logout</span>
					</a>
				</li>
			</ul>
		</Fragment>
	);

	const guestLinks = (
		<Fragment>
			<ul className='flex justify-around items-center space-x-4'>
				<li>
					<Link to='/signup' className={getLinkClass('/signup')}>
						Register
					</Link>
				</li>
				<li>
					<Link to='/login' className={getLinkClass('/login')}>
						Login
					</Link>
				</li>
			</ul>
		</Fragment>
	);

	return (
		<nav className='bg-gray-800 p-4 shadow-md'>
			<div className='container mx-auto flex justify-between items-center'>
				<h1>
					<Link
						to='/'
						className='text-white text-lg font-semibold hover:text-gray-400'
					>
						Home
					</Link>
				</h1>
				<ul className='flex space-x-4'>
					{isAuthenticated ? authLinks : guestLinks}
				</ul>
			</div>
		</nav>
	);
};

export default NavBar;
