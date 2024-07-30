// src/components/SignUp.js
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../index';
import AlertContext from '../context/alert/alertContext';
import AuthContext from '../context/auth/authContext';

const SignUp = (props) => {
	const alertContext = useContext(AlertContext);
	const authContext = useContext(AuthContext);

	const { setAlert } = alertContext;
	const { register, error, clearErrors, isAuthenticated } = authContext;
	const navigate = useNavigate();

	useEffect(() => {
		if (isAuthenticated) {
			navigate('/');
			// props.history.push('/');
		}
		console.log(error);
		if (error === 'Firebase: Error (auth/email-already-in-use).') {
			setAlert('Email already in use', 'danger');
			clearErrors();
		}
		// eslint-disable-next-line
	}, [error, isAuthenticated, props.history]);

	const [user, setUser] = useState({
		name: '',
		email: '',
		password: '',
		password2: '',
	});

	const { name, email, password, password2 } = user;

	const onChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

	const onSubmit = (e) => {
		e.preventDefault();
		if (name === '' || email === '' || password === '') {
			setAlert('Please enter all fields', 'danger');
		} else if (password !== password2) {
			setAlert('Passwords do not match', 'danger');
		} else {
			register({
				name,
				email,
				password,
			});
		}
	};
	return (
		<div className='form-container'>
			<h1>
				<div className='bg-light m-3'>
					Account <span className='text-primary'>Register</span>
				</div>
			</h1>
			<form
				onSubmit={onSubmit}
				className='w-full max-w-md mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'
			>
				<div className='mb-4'>
					<label
						htmlFor='name'
						className='block text-gray-700 text-sm font-bold mb-2'
					>
						Name
					</label>
					<input
						id='name'
						type='input'
						name='name'
						placeholder='Name'
						value={name}
						onChange={onChange}
						autoComplete='off'
						className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
					/>
				</div>
				<div className='mb-4'>
					<label
						htmlFor='email'
						className='block text-gray-700 text-sm font-bold mb-2'
					>
						Email Address
					</label>
					<input
						id='email'
						type='email'
						name='email'
						placeholder='Email Address'
						value={email}
						onChange={onChange}
						autoComplete='off'
						className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
					/>
				</div>
				<div className='mb-4'>
					<label
						htmlFor='password'
						className='block text-gray-700 text-sm font-bold mb-2'
					>
						Password
					</label>
					<input
						id='password'
						type='password'
						name='password'
						placeholder='Password'
						value={password}
						onChange={onChange}
						minLength='6'
						autoComplete='off'
						className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
					/>
				</div>
				<div className='mb-6'>
					<label
						htmlFor='password2'
						className='block text-gray-700 text-sm font-bold mb-2'
					>
						Confirm Password
					</label>
					<input
						id='password2'
						type='password'
						name='password2'
						placeholder='Confirm Password'
						value={password2}
						onChange={onChange}
						minLength='6'
						autoComplete='off'
						className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
					/>
				</div>
				<div className='flex items-center justify-between'>
					<button
						type='submit'
						className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
					>
						Register
					</button>
				</div>
			</form>
		</div>
	);
};


export default SignUp;
