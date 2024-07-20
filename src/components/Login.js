import React, { useState, useContext, useEffect, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/auth/authContext';
import AlertContext from '../context/alert/alertContext';
const Login = (props) => {
	const alertContext = useContext(AlertContext);
	const authContext = useContext(AuthContext);

	const { setAlert } = alertContext;
	const { login, error, clearErrors, isAuthenticated } = authContext;
    const navigate = useNavigate();
	useEffect(() => {
		if (isAuthenticated) {
			navigate('/');
		}

		if (error === 'Invalid Credentials') {
			setAlert(error, 'danger');
			clearErrors();
		}

		// eslint-disable-next-line
	}, [error, isAuthenticated, props.history]);

	const [user, setUser] = useState({
		email: '',
		password: '',
	});

	const { email, password } = user;

	const onChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

	const onSubmit = (e) => {
		e.preventDefault();
		if (email === '' || password === '') {
			setAlert('Please fill in all fields', 'danger');
		} else {
			login({
				email,
				password,
			});
		}
	};

	return (
		<div className='form-container'>
			<div className='bg-light m-3'>
				<h1>
					Account <span className='text-primary'>Login</span>
				</h1>
			</div>
			<form
				onSubmit={onSubmit}
				className='max-w-md mx-auto bg-white p-8 rounded-md shadow-md'
			>
				<div className='mb-4'>
					<div className='relative'>
						<input
							id='email'
							className='peer block w-full appearance-none border-2 border-gray-300 bg-transparent px-3 py-2 rounded-md leading-tight focus:outline-none focus:border-blue-500'
							type='email'
							name='email'
							placeholder=' '
							value={email}
							onChange={onChange}
							autoComplete='off'
						/>
						<label
							htmlFor='email'
							className='absolute top-2 left-3 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white px-1 text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:left-3 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:left-3 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-blue-500'
						>
							Email Address
						</label>
					</div>
				</div>
				<div className='mb-4'>
					<div className='relative'>
						<input
							id='password'
							className='peer block w-full appearance-none border-2 border-gray-300 bg-transparent px-3 py-2 rounded-md leading-tight focus:outline-none focus:border-blue-500'
							type='password'
							name='password'
							placeholder=' '
							value={password}
							onChange={onChange}
							autoComplete='off'
						/>
						<label
							htmlFor='password'
							className='absolute top-2 left-3 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white px-1 text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:left-3 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:left-3 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-blue-500'
						>
							Password
						</label>
					</div>
				</div>
				<input
					type='submit'
					value='Login'
					className='w-full py-2 px-4 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
				/>
			</form>
		</div>
	);
};
export default Login;
