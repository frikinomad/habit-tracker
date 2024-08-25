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
    <div className="container mx-auto p-4 dark:bg-gray-900">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {habits.map((habit) => (
          <div
            key={habit.id}
            className="bg-white shadow-md rounded-lg p-4 mb-4 dark:bg-gray-800 dark:text-white"
          >
            <div className="flex justify-between items-center">
              <div>
                <span
                  className="font-bold text-lg cursor-pointer dark:text-white"
                  onClick={() => handleHabitClick(habit.id)}
                >
                  {habit.name}
                </span>
              </div>
            </div>
            <div className="mt-4 flex justify-center space-x-2">
              {habit.daysOfWeek.map((day, index) => (
                <div
                  key={index}
                  className="h-8 w-8 flex items-center justify-center bg-green-300 rounded-full dark:bg-green-500 dark:text-white"
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
