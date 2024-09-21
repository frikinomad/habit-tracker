import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	getFirestore,
	collection,
	addDoc,
	query,
	where,
	getDocs,
	deleteDoc,
	doc,
	updateDoc,
} from 'firebase/firestore';
import Spinner from './Spinner';
import AuthContext from '../context/auth/authContext';
import AlertContext from '../context/alert/alertContext';

const getInitialDaysOfWeek = () => ({
	Monday: false,
	Tuesday: false,
	Wednesday: false,
	Thursday: false,
	Friday: false,
	Saturday: false,
	Sunday: false,
});

const AddHabit = () => {
	const authContext = useContext(AuthContext);
	const alertContext = useContext(AlertContext);
	const { uid } = authContext;
	const { setAlert } = alertContext;

	const [habit, setHabit] = useState('');
	const [loading, setLoading] = useState(true);
	const [daysOfWeek, setDaysOfWeek] = useState(getInitialDaysOfWeek());
	const [selectedHabit, setSelectedHabit] = useState(null);
	const [isEditMode, setIsEditMode] = useState(false);
	const [habits, setHabits] = useState([]);
	const [showForm, setShowForm] = useState(false);
	const db = getFirestore();
	const navigate = useNavigate();

	const fetchHabits = async () => {
		try {
			const habitsCollection = collection(db, 'habits');
			const q = query(habitsCollection, where('userId', '==', uid));
			const habitsSnapshot = await getDocs(q);
			const habitsList = habitsSnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setHabits(habitsList);
			setLoading(false);
		} catch (error) {
			console.error('Error fetching habits:', error);
		}
	};

	useEffect(() => {
		fetchHabits();
	}, [habit]);

	const handleAddOrUpdateHabit = async (e) => {
		e.preventDefault();
		const selectedDays = Object.keys(daysOfWeek).filter(
			(day) => daysOfWeek[day]
		);
		try {
			if (habit.trim() === '') {
				setAlert('Habit name cannot be empty', 'danger');
				return;
			}
			if (selectedDays.length === 0) {
				setAlert('Please select at least one day', 'danger');
				return;
			}
			if (isEditMode && selectedHabit) {
				const habitRef = doc(db, 'habits', selectedHabit.id);
				await updateDoc(habitRef, {
					name: habit,
					daysOfWeek: selectedDays,
				});
			} else {
				await addDoc(collection(db, 'habits'), {
					name: habit,
					daysOfWeek: selectedDays,
					createdAt: new Date(),
					history: {
						[new Date().toISOString().split('T')[0]]: {
							actionPerformed: 'didNotAttempt',
						},
					},
					baseXp: 10,
					multiplier: 1,
					userId: uid,
				});
			}
			resetForm();
			fetchHabits();
		} catch (error) {
			console.error('Error saving habit:', error);
		}
	};

	const handleEditHabit = (habit) => {
		setHabit(habit.name);
		setDaysOfWeek(
			Object.keys(daysOfWeek).reduce((acc, day) => {
				acc[day] = habit.daysOfWeek.includes(day);
				return acc;
			}, {})
		);
		setSelectedHabit(habit);
		setIsEditMode(true);
		setShowForm(true);
	};

	const handleDeleteHabit = async (habitId) => {
		try {
			await deleteDoc(doc(db, 'habits', habitId));
			fetchHabits();
		} catch (error) {
			console.error('Error deleting habit:', error);
		}
	};

	const handleDayChange = (day) => {
		setDaysOfWeek((prevDays) => ({
			...prevDays,
			[day]: !prevDays[day],
		}));
	};

	const resetForm = () => {
		setHabit('');
		setDaysOfWeek(getInitialDaysOfWeek());
		setSelectedHabit(null);
		setIsEditMode(false);
		setShowForm(false);
	};

	const handleHabitClick = (id) => {
		navigate(`/habits/${id}`);
	};

	return loading ? (
		<Spinner />
	) : (
		<div className='container mx-auto p-4'>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				{habits.map((habit) => (
					<div
						key={habit.id}
						className='card-shadow rounded-2xl h-96 border card-border-color overflow-hidden flex flex-col relative text-color card-background-color'
					>
						<div className='p-4 sticky top-0 z-10'>
							<div className='flex items-center gap-1.5'>
								<div className='font-bold text-lg'>{habit.name}</div>
							</div>
						</div>

						{/* Blurred background elements */}
						<div
							className='absolute -top-4 -left-16 -translate-y-1/2 rounded-full w-96 h-96 blur-3xl mix-blend-multiply opacity-50 bg-[#BFE0E2]'
							style={{ top: '24rem', left: '-14rem' }}
						></div>
						<div className='absolute -top-48 left-1/2 -translate-x-1/2 rounded-full w-96 h-96 blur-3xl mix-blend-multiply bg-[#5FAAB1]'></div>

						<div className='absolute top-36 left-6 flex flex-col justify-between h-1/2'>
							<div className='flex flex-col items-center space-y-2'>
								<button
									onClick={() => handleEditHabit(habit)}
									className='text-white hover:text-blue-300 transition-colors'
								>
									<i className='fas fa-pencil-alt'></i>
								</button>
								<button
									onClick={() => handleDeleteHabit(habit.id)}
									className='text-white hover:text-red-300 transition-colors'
								>
									<i className='fas fa-trash'></i>
								</button>
							</div>
							<div className='mt-4 flex justify-center space-x-2'>
								{habit.daysOfWeek.map((day, index) => (
									<div
										key={index}
										className='h-8 w-8 flex items-center justify-center bg-gray-200 rounded-full text-black'
									>
										{day.slice(0, 1).toUpperCase()}
									</div>
								))}
							</div>
						</div>
					</div>
				))}
			</div>
			<button
				onClick={() => setShowForm((prev) => !prev)}
				className='bg-green-500 hover:bg-green-700 text-black font-bold py-2 px-4 rounded mt-4'
			>
				Add Habit
			</button>
			{showForm && (
				<form
					onSubmit={handleAddOrUpdateHabit}
					className='mt-4 bg-white shadow-md rounded-lg p-6'
				>
					<input
						type='text'
						value={habit}
						onChange={(e) => setHabit(e.target.value)}
						placeholder={isEditMode ? 'Edit Habit' : 'New Habit'}
						className='border border-gray-300 rounded-lg p-2 w-full mb-4 text-black'
					/>
					<div className='grid grid-cols-2 gap-4 mb-4'>
						{Object.keys(daysOfWeek).map((day) => (
							<label key={day} className='flex items-center space-x-2'>
								<input
									type='checkbox'
									checked={daysOfWeek[day]}
									onChange={() => handleDayChange(day)}
									className='form-checkbox h-5 w-5'
								/>
								<span className='text-black'>{day.slice(0, 3)}</span>
							</label>
						))}
					</div>
					<div className='flex space-x-4'>
						<button
							type='submit'
							className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
							disabled={
								habit.trim() === '' ||
								!Object.values(daysOfWeek).some((day) => day)
							}
						>
							{isEditMode ? 'Save' : 'Add Habit'}
						</button>
						<button
							onClick={resetForm}
							className='bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded'
						>
							Cancel
						</button>
					</div>
				</form>
			)}
		</div>
	);
};

export default AddHabit;
