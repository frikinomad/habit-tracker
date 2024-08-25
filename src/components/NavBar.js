import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeBtn from './ThemeBtn';

const NavBar = () => {
  const location = useLocation();

  const getLinkClass = (path) => {
    return location.pathname === path
      ? "text-gray-800 bg-white p-2 rounded"
      : "text-white hover:text-gray-300";
  };

  return (
    <nav className="bg-gray-800 p-4 shadow-md">
      <ul className="flex justify-around items-center space-x-4">
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
        <li>
          <ThemeBtn />
        </li>
      </ul>
    </nav>
  );
};



export default NavBar;