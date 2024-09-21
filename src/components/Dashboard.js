import React, { useState, useEffect, useContext } from 'react';
import {
	collection,
	query,
	where,
	getDocs,
	getFirestore,
	doc,
	updateDoc,
} from 'firebase/firestore';
import AuthContext from '../context/auth/authContext';
import HabitPerformanceGraph from './HabitPerformanceGraph';
import MiniHabitGraph from './MiniHabitGraph';
import Spinner from './Spinner';

const Dashboard = () => {
	const authContext = useContext(AuthContext);
	const { uid } = authContext;
	const [habits, setHabits] = useState([]);
	const [loading, setLoading] = useState(true);

	const db = getFirestore();

	useEffect(() => {
		fetchHabits();
	}, []);

	const fetchHabits = async () => {
		try {
			const habitsRef = collection(db, 'habits');
			const q = query(habitsRef, where('userId', '==', uid));
			const querySnapshot = await getDocs(q);
			const habitsData = querySnapshot.docs.map((doc) => {
				const data = doc.data();
				const history = data.history || {};
				const oldestDate =
					Object.keys(history).sort()[0] ||
					data.createdAt.toDate().toISOString().split('T')[0];

				return {
					id: doc.id,
					...data,
					createdAt: oldestDate,
					streak: calculateStreak(history),
				};
			});
			console.log(habitsData);
			setHabits(habitsData);
			setLoading(false);
		} catch (error) {
			console.error('Error fetching habits:', error);
			setLoading(false);
		}
	};

	const markHabitAsCompleted = async (habitId) => {
		try {
			const habitRef = doc(db, 'habits', habitId);
			const today = new Date().toISOString().split('T')[0];

			await updateDoc(habitRef, {
				[`history.${today}.actionPerformed`]: 'finished',
			});

			// Refresh habits after marking as completed
			await fetchHabits();
		} catch (error) {
			console.error('Error marking habit as completed:', error);
			// Implement user feedback here (e.g., show an error message)
		}
	};

	const calculateStreak = (history) => {
		let streak = 0;
		const dates = Object.keys(history).sort();
		const today = new Date().toISOString().split('T')[0];

		for (let i = dates.length - 1; i >= 0; i--) {
			if (dates[i] > today) continue;
			if (history[dates[i]].actionPerformed === 'finished') {
				streak++;
			} else {
				// break;
				streak = 0;
			}
		}

		return streak;
	};

	const getStreakColor = (streak) => {
		if (streak >= 30) return 'bg-green-500';
		if (streak >= 14) return 'bg-yellow-500';
		if (streak >= 7) return 'bg-orange-500';
		return 'bg-red-500';
	};

	// return (
	// 	<div className='container mx-auto px-4 py-8'>
	// 		<h1 className='text-3xl font-bold mb-6'>Habit Dashboard</h1>
	// 		{loading ? (
	// 			<p className='text-gray-600'>Loading habits...</p>
	// 		) : (
	// 			<>
	// 				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
	// 					{habits.map((habit) => (
	// 						<div key={habit.id} className='bg-white rounded-lg shadow-md p-6'>
	// 							<h2 className='text-xl font-semibold mb-2'>{habit.name}</h2>
	// 							<div className='flex items-center mb-4'>
	// 								<div
	// 									className={`w-12 h-12 rounded-full ${getStreakColor(
	// 										habit.streak
	// 									)} flex items-center justify-center text-white font-bold text-lg mr-4`}
	// 								>
	// 									{habit.streak}
	// 								</div>
	// 								<span className='text-gray-600'>day streak</span>
	// 							</div>
	// 							<button
	// 								onClick={() => markHabitAsCompleted(habit.id)}
	// 								className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded'
	// 							>
	// 								Mark as Completed
	// 							</button>
	// 						</div>
	// 					))}
	// 				</div>
	// 				<HabitPerformanceGraph habits={habits} />
	// 			</>
	// 		)}
	// 	</div>
	// );
	 return (
			<div className='container mx-auto px-4 py-8'>
				<h1 className='text-3xl font-bold mb-6'>Habit Dashboard</h1>
				{loading ? (
					<Spinner />
				) : (
					<>
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
							{habits.map((habit) => (
								<div
									key={habit.id}
									className='bg-white rounded-lg shadow-md p-6'
								>
									<h2 className='text-xl font-semibold mb-2'>{habit.name}</h2>
									<div className='flex items-center mb-4'>
										<div
											className={`w-12 h-12 rounded-full ${getStreakColor(
												habit.streak
											)} flex items-center justify-center text-white font-bold text-lg mr-4`}
										>
											{habit.streak}
										</div>
										<span className='text-gray-600'>day streak</span>
									</div>
									<MiniHabitGraph history={habit.history} />
									<button
										onClick={() => markHabitAsCompleted(habit.id)}
										className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4'
									>
										Mark as Completed
									</button>
								</div>
							))}
						</div>
						<HabitPerformanceGraph habits={habits} />
					</>
				)}
			</div>
		);
};

export default Dashboard;
