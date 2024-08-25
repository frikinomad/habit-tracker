import { React, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeBtn from './ThemeBtn';
import UserContext from '../contexts/UserContext';

const NavBar = () => {
  const location = useLocation();

  const { user } = useContext(UserContext)

  const getLinkClass = (path) => {
    return location.pathname === path
      ? "text-gray-800 bg-white p-2 rounded"
      : "text-white hover:text-gray-300";
  };

  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md">
      <ul className="flex justify-around items-center space-x-4">
        <li className="flex items-center">
          <input
            type="text"
            placeholder="Search"
            className="p-2 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400"
          />
        </li>
        <li>
          <Link
            to="/"
            className={`${getLinkClass('/')} text-gray-200 hover:text-gray-400`}
          >
            My Profile
          </Link>
        </li>
        <li>
          <Link
            to="/habits"
            className={`${getLinkClass('/habits')} text-gray-200 hover:text-gray-400`}
          >
            Habits
          </Link>
        </li>
        <li>
          <Link
            to="/goals"
            className={`${getLinkClass('/goals')} text-gray-200 hover:text-gray-400`}
          >
            Goals
          </Link>
        </li>
        <li>
          <Link
            to="/today"
            className={`${getLinkClass('/today')} text-gray-200 hover:text-gray-400`}
          >
            Today
          </Link>
        </li>
        {user ? (
          <li className="text-gray-200 font-bold">
            {user.username.toUpperCase()}
          </li>
        ) : (
          <>
            <li>
              <Link
                to="/login"
                className={`${getLinkClass('/login')} text-gray-200 hover:text-gray-400`}
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                to="/signup"
                className={`${getLinkClass('/signup')} text-gray-200 hover:text-gray-400`}
              >
                Sign Up
              </Link>
            </li>
          </>
        )}
        <li>
          <ThemeBtn />
        </li>
      </ul>
    </nav>
  );
  
};



export default NavBar;