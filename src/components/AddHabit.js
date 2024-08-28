import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import Spinner from './Spinner';

const AddHabit = () => {
  const [loading, setLoading] = useState(true);
  const [habits, setHabits] = useState([]);
  const db = getFirestore();
  const navigate = useNavigate();

  const fetchHabits = async () => {
    try {
      const habitsCollection = collection(db, 'habits');
      const habitsSnapshot = await getDocs(habitsCollection);
      const habitsList = habitsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setHabits(habitsList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching habits:', error);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const handleHabitClick = (id) => {
    navigate(`/habits/${id}`);
  };

  return loading ? (
    <Spinner />
  ) : (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center py-10 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-screen-lg">
        {habits.map((habit, index) => (
          <div
            key={habit.id}
            className={`bg-white dark:bg-gray-700 rounded-2xl shadow-md p-6 transform transition-transform duration-300 hover:scale-105 hover:shadow-lg
              ${index % 5 === 0 ? 'lg:col-span-2 lg:row-span-1' : 'lg:col-span-1 lg:row-span-1'}`}
            onClick={() => handleHabitClick(habit.id)}
          >
            <div className="flex justify-between items-center mb-4">
              <span
                className="text-xl font-semibold cursor-pointer text-gray-800 dark:text-white transition-colors duration-300 hover:text-blue-500"
              >
                {habit.name}
              </span>
            </div>
            <div className="flex justify-center items-center relative h-32 mt-4">
              <div className="h-12 w-12 bg-blue-600 dark:bg-blue-400 rounded-full text-white flex items-center justify-center">
                {/* Central Icon or Initial Letter */}
                <i className="fas fa-calendar-alt text-xl"></i>
              </div>
              {habit.daysOfWeek.map((day, index) => (
                <div
                  key={index}
                  className={`absolute h-8 w-8 flex items-center justify-center rounded-full bg-blue-50 dark:bg-blue-600 text-blue-600 dark:text-white font-medium
                  transition-all duration-300 hover:bg-blue-600 hover:text-white
                  transform translate-x-12 rotate-${index * 45} origin-left`}
                  style={{ transform: `rotate(${index * 45}deg) translate(60px) rotate(-${index * 45}deg)` }}
                >
                  {day.slice(0, 1).toUpperCase()}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddHabit;
