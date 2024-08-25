import  React, { useState, useContext } from 'react';
import UserContext from '../contexts/UserContext';

function Login() {

    const [ username, setUsername ] = useState('')
    const [ password, setPassword ] = useState('')

    const { setUser } = useContext(UserContext)

    const handleSubmit = (e) => {
        e.preventDefault()
        setUser({username, password})
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-full max-w-sm">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200 text-center">
              Login
            </h2>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full mb-6 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
            />
            <button
              onClick={handleSubmit}
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-800"
            >
              Submit
            </button>
          </div>
        </div>
      );
      
}

export default Login;