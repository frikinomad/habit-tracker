import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, collection, addDoc, query, getDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
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
  
  const [habit, setHabit] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null);
  const [daysOfWeek, setDaysOfWeek] = useState(getInitialDaysOfWeek());
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const db = getFirestore();


  const fetchHabit = async () => {
    try{
      const habitDocRef = doc(db, 'habits', id);
      const habitDoc = await getDoc(habitDocRef);
      if (habitDoc.exists()) {
        setHabit({ id: habitDoc.id, ...habitDoc.data() });
        console.log(habit);
      } else {
        setError('Habit not found');
      }
      setLoading(false);
    }catch(error){
      console.log(error);
    }
  }

  const handleAddOrUpdateHabit = async (e) => {
    e.preventDefault();
    const selectedDays = Object.keys(daysOfWeek).filter((day) => daysOfWeek[day]);
    try {
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
        });
      }
      resetForm();
      fetchHabit();
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
      fetchHabit();
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

  useEffect(() => {
    fetchHabit();
  }, [id])



  return loading ? (
    <Spinner />
  ) :  (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-4 mb-4 text-center">
        <h3 className="text-gray-800 font-bold text-lg">{habit.name}</h3>
        <div className="mt-4 flex justify-center space-x-2">
        {habit.daysOfWeek.map((day) => (
          console.log(day)
        ))}
        </div>
        <div className="flex justify-center space-x-2 mt-4">
          <button
            onClick={() => handleEditHabit(habit)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteHabit(habit.id)}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Delete
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        <div className="bg-white shadow-md rounded-lg p-4">
          <h4 className="text-gray-800 font-bold text-lg">Reason</h4>
          <p className="text-gray-600 mt-2">{habit.reason}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4">
          <h4 className="text-gray-800 font-bold text-lg">Motivation</h4>
          <p className="text-gray-600 mt-2">{habit.motivation}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4">
          <h4 className="text-gray-800 font-bold text-lg">Opportunity Cost</h4>
          <p className="text-gray-600 mt-2">{habit.opportunityCost}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4">
          <h4 className="text-gray-800 font-bold text-lg">Why Pause This Habit</h4>
          <p className="text-gray-600 mt-2">{habit.whyPause}</p>
        </div>
      </div>
      {showForm && (
        <form onSubmit={handleAddOrUpdateHabit} className="mt-4 bg-white shadow-md rounded-lg p-4">
          <input
            type="text"
            value={habit}
            onChange={(e) => setHabit(e.target.value)}
            placeholder={isEditMode ? 'Edit Habit' : 'New Habit'}
            className="border border-gray-300 rounded-lg p-2 w-full mb-4"
          />
          <div className="grid grid-cols-2 gap-4 mb-4">
            {Object.keys(daysOfWeek).map((day) => (
              <label key={day} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={daysOfWeek[day]}
                  onChange={() => handleDayChange(day)}
                  className="form-checkbox h-5 w-5"
                />
                <span>{day.slice(0, 3)}</span>
              </label>
            ))}
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              disabled={habit.trim() === '' || !Object.values(daysOfWeek).some((day) => day)}
            >
              {isEditMode ? 'Save' : 'Add Habit'}
            </button>
            <button
              onClick={resetForm}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );

};

export default HabitDetails;
