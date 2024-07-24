import React, { useEffect, useState, useContext } from 'react';
import {
	getFirestore,
	collection,
	query,
	getDocs,
	getDoc,
	doc,
	updateDoc,
	where,
} from 'firebase/firestore';
import Spinner from './Spinner';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import AuthContext from '../context/auth/authContext';

const Todos = () => {
	const authContext = useContext(AuthContext);
	const [habits, setHabits] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedDate, setSelectedDate] = useState(new Date());
	const { uid } = authContext;
	const db = getFirestore();

	// Function to update habit history in Firestore and local state
	const updateHabitHistory = async (habitId, isCompleted) => {
		try {
			const habitRef = doc(db, 'habits', habitId);
			const today = format(selectedDate, 'yyyy-MM-dd');
			const action = isCompleted ? 'finished' : 'didNotAttempt';

			// Update the history for the selected date in Firestore
			await updateDoc(habitRef, {
				[`history.${today}`]: { actionPerformed: action },
			});

			// Update local state for immediate UI feedback
			setHabits((prevHabits) => {
				return prevHabits.map((habit) => {
					if (habit.id === habitId) {
						return {
							...habit,
							completed: isCompleted,
							style: {
								borderRadius: '10px',
								backgroundColor: isCompleted ? 'gray' : 'white',
							},
						};
					}
					return habit;
				});
			});
		} catch (error) {
			console.error('Error updating habit history:', error);
		}
	};

	const handleCheckboxChange = async (habitId) => {
		// Find the habit to update
		const habitToUpdate = habits.find((habit) => habit.id === habitId);
		if (!habitToUpdate) return;

		const newCompleted = !habitToUpdate.completed;

		// Update habit history in Firestore and local state
		await updateHabitHistory(habitId, newCompleted);
	};

	const fetchHabits = async (date) => {
		setLoading(true);
		const userDocRef = doc(db, 'users', uid);
		const userDocSnapshot = await getDoc(userDocRef);

		const userData = userDocSnapshot.data();
		const habitsArray = userData.habits || [];

		if (habitsArray.length === 0) {
			setHabits([]);
			setLoading(false);
			return;
		}
		const habitsCollection = collection(db, 'habits');
		const q = query(habitsCollection, where('__name__', 'in', habitsArray));
		const habitsSnapshot = await getDocs(q);

		const habitsList = habitsSnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));
		const dayOfWeek = format(date, 'EEEE'); // Get day of the week in full name

		const filteredHabits = habitsList.filter((habit) =>
			habit.daysOfWeek.includes(dayOfWeek)
		);
		// Filter habits based on the day of the week and map through to add new properties
		const updatedHabits = filteredHabits.map((habit) => {
			const today = format(selectedDate, 'yyyy-MM-dd');
			const history = habit.history || {};
			console.log(habit.name);
			console.log(history);
			const historyItem = history[today];
			const isCompleted =
				historyItem && historyItem.actionPerformed === 'finished';
			console.log(isCompleted);
			console.log('*******************');
			return {
				...habit,
				completed: isCompleted,
				style: {
					borderRadius: '10px',
					backgroundColor: isCompleted ? 'gray' : 'white',
				},
			};
		});
		// console.log(updatedHabits);
		setHabits(updatedHabits);
		setLoading(false);
	};

	useEffect(() => {
		// Fetch habits on component mount and when selectedDate changes
		fetchHabits(selectedDate);
	}, [selectedDate]); // Dependency array ensures it runs when selectedDate changes

	// Function to handle date change
	const handleDateChange = (date) => {
		setSelectedDate(date);
		// Fetch habits when date changes
		fetchHabits(date);
	};

	return (
		<div className='container mx-auto p-4'>
			<DatePicker selected={selectedDate} onChange={handleDateChange} inline />
			{loading ? (
				<Spinner />
			) : (
				habits.map((habit) => (
					<div
						key={habit.id}
						className={`card p-4 m-2 border rounded shadow ${
							habit.completed ? 'bg-green-100' : 'bg-white'
						}`}
					>
						<h3
							className={`text-lg font-semibold ${
								habit.completed ? 'line-through text-gray-500' : 'text-black'
							}`}
						>
							{habit.name}
						</h3>
						<p
							className={
								habit.completed ? 'line-through text-gray-500' : 'text-black'
							}
						>
							{habit.daysOfWeek}
						</p>
						<h4 className='mt-2 font-medium'>Selected Date:</h4>
						<p>{selectedDate.toISOString()}</p>
						{habit.history &&
							Object.entries(habit.history).map(([date, historyItem]) => (
								<div key={date} className='mt-2'>
									<h4 className='font-medium'>
										History for {historyItem.date}:
									</h4>
									<p>{historyItem.actionPerformed}</p>
								</div>
							))}
						<input
							type='checkbox'
							checked={habit.completed}
							className='mt-2'
							readOnly
							onClick={() => handleCheckboxChange(habit.id)}
						/>
					</div>
				))
			)}
		</div>
	);
};

export default Todos;
