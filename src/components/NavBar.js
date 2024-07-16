import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav className="bg-gray-800 p-4 shadow-md">
      <ul className="flex justify-around items-center space-x-4">
        <li>
          <Link to="/signup" className="text-white hover:text-gray-300">Sign Up</Link>
        </li>
        <li>
          <Link to="/habits" className="text-white hover:text-gray-300">Habits</Link>
        </li>
        <li>
          <Link to="/goals" className="text-white hover:text-gray-300">Goals</Link>
        </li>
        <li>
          <Link to="/inspirations" className="text-white hover:text-gray-300">Inspirations</Link>
        </li>
        <li>
          <Link to="/" className="text-white hover:text-gray-300">Todos</Link>
        </li>
        <li className="flex items-center">
          <input
            type="text"
            placeholder="Search"
            className="p-2 rounded-lg border border-gray-300"
          />
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;