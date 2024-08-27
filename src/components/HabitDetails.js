import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // import useNavigate
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
  const navigate = useNavigate(); // initialize useNavigate
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
      navigate('/habits'); // navigate back to the habits page after deletion
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
    <div className="min-h-screen flex justify-center items-center bg-gray-900 text-gray-100">
      <div className="container mx-auto p-6">
        <div className="bg-gray-800 shadow-xl rounded-2xl p-6 mb-8 text-center transition-transform transform hover:scale-105">
          {isEditMode ? (
            <input
              type="text"
              name="name"
              value={habit.name}
              onChange={handleInputChange}
              className="w-full mb-6 p-3 bg-gray-700 border-none rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Habit Name"
            />
          ) : (
            <h3 className="text-2xl font-bold text-gray-100">{habit.name}</h3>
          )}
          <div className="mt-6 flex justify-center space-x-3">
            {habit.daysOfWeek && Object.keys(daysOfWeek).map((day, index) => (
              <div
                key={index}
                className={`h-10 w-10 flex items-center justify-center rounded-full cursor-pointer transition-colors ${
                  daysOfWeek[day] ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-300'
                }`}
                onClick={() => handleDayChange(day)}
              >
                {day.slice(0, 1).toUpperCase()}
              </div>
            ))}
          </div>
          <div className="flex justify-center space-x-4 mt-6">
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              {isEditMode ? 'Cancel' : 'Edit'}
            </button>
            <button
              onClick={() => handleDeleteHabit(habit.id)}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
            >
              Delete
            </button>
            {isEditMode && (
              <button
                onClick={handleSaveHabit}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              >
                Save
              </button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {['reason', 'motivation', 'opportunityCost', 'whyPause'].map((field) => (
            <div key={field} className="bg-gray-800 shadow-xl rounded-2xl p-6 transition-transform transform hover:scale-105">
              <h4 className="text-xl font-bold text-gray-100 capitalize">{field}</h4>
              {isEditMode ? (
                <textarea
                  name={field}
                  value={habit[field] || ' '}
                  onChange={handleInputChange}
                  className="w-full mt-3 p-3 bg-gray-700 border-none rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder={field}
                />
              ) : (
                <p className="text-gray-400 mt-3">{habit[field]}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HabitDetails;
