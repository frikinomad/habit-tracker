import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import Spinner from './Spinner';

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
        {habits.map((habit) => (
          <div
            key={habit.id}
            className="bg-white dark:bg-gray-700 rounded-2xl shadow-md p-6 transform transition-transform hover:scale-105"
          >
            <div className="flex justify-between items-center mb-4">
              <span
                className="text-xl font-semibold cursor-pointer text-gray-800 dark:text-white"
                onClick={() => handleHabitClick(habit.id)}
              >
                {habit.name}
              </span>
            </div>
            <div className="flex justify-around mt-4">
              {habit.daysOfWeek.map((day, index) => (
                <div
                  key={index}
                  className="h-10 w-10 flex items-center justify-center bg-blue-50 dark:bg-blue-600 rounded-full text-blue-600 dark:text-white font-medium"
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
