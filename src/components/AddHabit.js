import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	getFirestore,
	collection,
	addDoc,
	query,
	where,
	getDoc,
	getDocs,
	deleteDoc,
	doc,
	updateDoc,
	arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import Spinner from './Spinner';
import AuthContext from '../context/auth/authContext';

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
  const { uid } = authContext;
  
  const [habit, setHabit] = useState('');
	const [loading, setLoading] = useState(true);
	const [daysOfWeek, setDaysOfWeek] = useState(getInitialDaysOfWeek());
	const [selectedHabit, setSelectedHabit] = useState(null);
	const [isEditMode, setIsEditMode] = useState(false);
	const [habits, setHabits] = useState([]);
	const [showForm, setShowForm] = useState(false);
	const db = getFirestore();
	const navigate = useNavigate();

	// Function to add a habit ID to a user's habits array
	const addHabitToUser = async (userId, habitId) => {
		try {
			const userDocRef = doc(db, 'users', userId);
			await updateDoc(userDocRef, {
				habits: arrayUnion(habitId),
			});
			console.log('Habit ID added successfully to the user.');
		} catch (error) {
			console.error('Error adding habit ID to user:', error);
		}
	};
const removeHabitFromUser = async (userId, habitId) => {
	try {
		const userDocRef = doc(db, 'users', userId);
		await updateDoc(userDocRef, {
			habits: arrayRemove(habitId),
		});
		console.log('Habit ID removed successfully from the user.');
	} catch (error) {
		console.error('Error removing habit ID from user:', error);
	}
};
	const fetchHabits = async () => {
		try {
			// get user -> habits array -> habits from db using this id
			const userDocRef = doc(db, 'users', uid);
			const userDocSnapshot = await getDoc(userDocRef);

			const userData = userDocSnapshot.data();
			const habitsArray = userData.habits || [];
			
			if(habitsArray.length === 0){
				setHabits([]);
				setLoading(false);
				return;
			};
			const habitsCollection = collection(db, 'habits');
			const q = query(habitsCollection, where('__name__', 'in', habitsArray));
			const habitsSnapshot = await getDocs(q);

			
			// const habitsCollection = collection(db, 'habits');
			// const habitsSnapshot = await getDocs(habitsCollection);
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
			if (isEditMode && selectedHabit) {
				const habitRef = doc(db, 'habits', selectedHabit.id);
				await updateDoc(habitRef, {
					name: habit,
					daysOfWeek: selectedDays,
				});
			} else {
				const newHabitRef = await addDoc(collection(db, 'habits'), {
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
				});
				// add habit to current user
				console.log("uid");
				console.log(uid);
				addHabitToUser(uid, newHabitRef.id);
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
			removeHabitFromUser(uid, habitId);
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
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
				{habits.map((habit) => (
					<div
						key={habit.id}
						className='bg-white shadow-md rounded-lg p-4 mb-4'
					>
						<div className='flex justify-between items-center'>
							<div>
								{isEditMode &&
								selectedHabit &&
								selectedHabit.id === habit.id ? (
									<input
										type='text'
										value={habit.name}
										onChange={(e) => setHabit(e.target.value)}
										className='border border-gray-300 rounded-lg p-2 w-full'
									/>
								) : (
									<span
										className='font-bold text-lg'
										onClick={() => handleHabitClick(habit.id)}
									>
										{habit.name}
									</span>
								)}
							</div>
							<div className='flex space-x-2'>
								<button
									onClick={() => handleEditHabit(habit)}
									className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
								>
									Edit
								</button>
								<button
									onClick={() => handleDeleteHabit(habit.id)}
									className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
								>
									Delete
								</button>
							</div>
						</div>
						<div className='mt-4 flex justify-center space-x-2'>
							{habit.daysOfWeek.map((day, index) => (
								<div
									key={index}
									className='h-8 w-8 flex items-center justify-center bg-gray-200 rounded-full'
								>
									{day.slice(0, 1).toUpperCase()}
								</div>
							))}
						</div>
					</div>
				))}
			</div>
			<button
				onClick={() => setShowForm((prev) => !prev)}
				className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4'
			>
				Add Habit
			</button>
			{showForm && (
				<form
					onSubmit={handleAddOrUpdateHabit}
					className='mt-4 bg-white shadow-md rounded-lg p-4'
				>
					<input
						type='text'
						value={habit}
						onChange={(e) => setHabit(e.target.value)}
						placeholder={isEditMode ? 'Edit Habit' : 'New Habit'}
						className='border border-gray-300 rounded-lg p-2 w-full mb-4'
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
								<span>{day.slice(0, 3)}</span>
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
