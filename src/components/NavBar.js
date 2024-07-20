import React , { Fragment, useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthContext from '../context/auth/authContext';

const NavBar = () => {
  const location = useLocation();
  const authContext = useContext(AuthContext);
  const { isAuthenticated, logout, user, loadUser } = authContext;

  const getLinkClass = (path) => {
    return location.pathname === path
      ? "text-gray-800 bg-white p-2 rounded"
      : "text-white hover:text-gray-300";
  };

  useEffect(() => {
		loadUser();
    console.log("user");
    console.log(user);
		// eslint-disable-next-line
	}, []);

  const onLogout = () => {
		logout();
		// clearContacts();
	};

  const authLinks = (
		<Fragment>
			{/* <li>Hello {user.name}</li> */}
			<li>
				{' '}
				<a onClick={onLogout} href='#!'>
					<i className='fas fa-sign-out-alt'></i>
					<span className='hide-sm'> Logout</span>
				</a>{' '}
			</li>
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
				<li>
					<Link to='/signup' className={getLinkClass('/signup')}>
						Sign Up
					</Link>
				</li>
			</ul>
		</Fragment>
	);
  const guestLinks = (
		<Fragment>
			<li>
				<Link to='/signup'>Register</Link>
			</li>
			<li>
				<Link to='/login'>Login</Link>
			</li>
			{/* <li>
				<Link to='/about'>About</Link>
			</li> */}
		</Fragment>
	);

  return (
    <nav className="bg-gray-800 p-4 shadow-md">
      <h1>
				<Link to='/'>
					Home
				</Link>
			</h1>
			<ul>{isAuthenticated ? authLinks : guestLinks}</ul>
      {/* <ul className="flex justify-around items-center space-x-4">
        <li className="flex items-center">
          <input
            type="text"
            placeholder="Search"
            className="p-2 rounded-lg border border-gray-300"
          />
        </li>
        <li>
          <Link to="/" className={getLinkClass('/')}>My Profile</Link>
        </li>
        <li>
          <Link to="/habits" className={getLinkClass('/habits')}>Habits</Link>
        </li>
        <li>
          <Link to="/goals" className={getLinkClass('/goals')}>Goals</Link>
        </li>
        <li>
          <Link to="/today" className={getLinkClass('/today')}>Today</Link>
        </li>
        <li>
          <Link to="/signup" className={getLinkClass('/signup')}>Sign Up</Link>
        </li>
      </ul> */}
    </nav>
  );
};



export default NavBar;