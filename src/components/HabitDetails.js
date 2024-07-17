import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
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

const HabitDetails = () => {
  const { id } = useParams();
  const [habit, setHabit] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [daysOfWeek, setDaysOfWeek] = useState(getInitialDaysOfWeek());
  const [isEditMode, setIsEditMode] = useState(false);
  const db = getFirestore();

  const fetchHabit = async () => {
    setLoading(true);
    try {
      const habitDocRef = doc(db, 'habits', id);
      const habitDoc = await getDoc(habitDocRef);
      if (habitDoc.exists()) {
        setHabit({ id: habitDoc.id, ...habitDoc.data() });
        setDaysOfWeek(
          Object.keys(getInitialDaysOfWeek()).reduce((acc, day) => {
            acc[day] = habitDoc.data().daysOfWeek.includes(day);
            return acc;
          }, {})
        );
      } else {
        setError('Habit not found');
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError('Error fetching habit');
      setLoading(false);
    }
  };

  const handleSaveHabit = async () => {
    const selectedDays = Object.keys(daysOfWeek).filter((day) => daysOfWeek[day]);
    try {
      const habitRef = doc(db, 'habits', habit.id);
      await updateDoc(habitRef, {
        name: habit.name,
        daysOfWeek: selectedDays,
        reason: habit.reason,
        motivation: habit.motivation,
        opportunityCost: habit.opportunityCost,
        whyPause: habit.whyPause,
      });
      setIsEditMode(false);
    } catch (error) {
      console.error('Error saving habit:', error);
    }
  };

  const handleDeleteHabit = async (habitId) => {
    try {
      await deleteDoc(doc(db, 'habits', habitId));
      fetchHabit();
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHabit((prevHabit) => ({
      ...prevHabit,
      [name]: value,
    }));
  };

  const handleDayChange = (day) => {
    setDaysOfWeek((prevDays) => ({
      ...prevDays,
      [day]: !prevDays[day],
    }));
  };

  useEffect(() => {
    fetchHabit();
  }, [id]);

  return loading ? (
    <Spinner />
  ) : (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-4 mb-4 text-center">
        {isEditMode ? (
          <input
            type="text"
            name="name"
            value={habit.name}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg p-2 w-full mb-4"
          />
        ) : (
          <h3 className="text-gray-800 font-bold text-lg">{habit.name}</h3>
        )}
        <div className="mt-4 flex justify-center space-x-2">
          {habit.daysOfWeek && Object.keys(daysOfWeek).map((day, index) => (
            <div
              key={index}
              className={`h-8 w-8 flex items-center justify-center rounded-full ${
                daysOfWeek[day] ? 'bg-green-500 text-white' : 'bg-gray-200'
              }`}
              onClick={() => handleDayChange(day)}
            >
              {day.slice(0, 1).toUpperCase()}
            </div>
          ))}
        </div>
        <div className="flex justify-center space-x-2 mt-4">
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {isEditMode ? 'Cancel' : 'Edit'}
          </button>
          <button
                  onClick={() => handleDeleteHabit(habit.id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Delete
                </button>
          {isEditMode && (
            <button
              onClick={handleSaveHabit}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Save
            </button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {['reason', 'motivation', 'opportunityCost', 'whyPause'].map((field) => (
          <div key={field} className="bg-white shadow-md rounded-lg p-4">
            <h4 className="text-gray-800 font-bold text-lg capitalize">{field}</h4>
            {isEditMode ? (
              <textarea
                name={field}
                value={habit[field] || ' '}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-lg p-2 w-full mt-2"
              />
            ) : (
              <p className="text-gray-600 mt-2">{habit[field]}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HabitDetails;
