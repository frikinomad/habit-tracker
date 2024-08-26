import { React, useContext, useState } from 'react';
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

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md relative">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo or Brand Name */}
        <div className="text-lg font-bold">MyApp</div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex justify-around items-center space-x-4 flex-grow">
          <li className="flex items-center">
            <input
              type="text"
              placeholder="Search"
              className="p-2 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400"
            />
          </li>
          <li>
            <Link to="/" className={`${getLinkClass('/')} text-gray-200 hover:text-gray-400`}>
              My Profile
            </Link>
          </li>
          <li>
            <Link to="/habits" className={`${getLinkClass('/habits')} text-gray-200 hover:text-gray-400`}>
              Habits
            </Link>
          </li>
          <li>
            <Link to="/goals" className={`${getLinkClass('/goals')} text-gray-200 hover:text-gray-400`}>
              Goals
            </Link>
          </li>
          <li>
            <Link to="/today" className={`${getLinkClass('/today')} text-gray-200 hover:text-gray-400`}>
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
                <Link to="/login" className={`${getLinkClass('/login')} text-gray-200 hover:text-gray-400`}>
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className={`${getLinkClass('/signup')} text-gray-200 hover:text-gray-400`}>
                  Sign Up
                </Link>
              </li>
            </>
          )}
          <li>
            <ThemeBtn />
          </li>
        </ul>

        {/* Hamburger Menu for Mobile */}
        <button
          className="md:hidden flex items-center p-2 text-gray-200 hover:text-gray-400"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 bg-gray-800 bg-opacity-200 z-50 transform transition-transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col p-6 space-y-4">
          <button
            className="self-end text-gray-200 hover:text-gray-400"
            onClick={() => setIsMenuOpen(false)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          <input
            type="text"
            placeholder="Search"
            className="p-2 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400"
          />
          <Link to="/" className={`${getLinkClass('/')} text-gray-200 hover:text-gray-400`} onClick={() => setIsMenuOpen(false)}>
            My Profile
          </Link>
          <Link to="/habits" className={`${getLinkClass('/habits')} text-gray-200 hover:text-gray-400`} onClick={() => setIsMenuOpen(false)}>
            Habits
          </Link>
          <Link to="/goals" className={`${getLinkClass('/goals')} text-gray-200 hover:text-gray-400`} onClick={() => setIsMenuOpen(false)}>
            Goals
          </Link>
          <Link to="/today" className={`${getLinkClass('/today')} text-gray-200 hover:text-gray-400`} onClick={() => setIsMenuOpen(false)}>
            Today
          </Link>
          {user ? (
            <div className="text-gray-200 font-bold">
              {user.username.toUpperCase()}
            </div>
          ) : (
            <>
              <Link to="/login" className={`${getLinkClass('/login')} text-gray-200 hover:text-gray-400`} onClick={() => setIsMenuOpen(false)}>
                Login
              </Link>
              <Link to="/signup" className={`${getLinkClass('/signup')} text-gray-200 hover:text-gray-400`} onClick={() => setIsMenuOpen(false)}>
                Sign Up
              </Link>
            </>
          )}
          <ThemeBtn />
        </div>
      </div>
    </nav>
  );
  
};



export default NavBar;