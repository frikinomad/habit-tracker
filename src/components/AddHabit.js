import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, query, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
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
  const [habit, setHabit] = useState('');
  const [loading, setLoading] = useState(true);
  const [daysOfWeek, setDaysOfWeek] = useState(getInitialDaysOfWeek());
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [habits, setHabits] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const db = getFirestore();

  useEffect(() => {
    fetchHabits();
  }, []);

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
          history: {
            [new Date().toISOString().split('T')[0]]: { actionPerformed: 'didNotAttempt' }
          },
          baseXp: 10,
          multiplier: 1
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

  return loading ? (
    <Spinner />
  ) : (
    <div style={styles.container}>
      {habits.map((habit) => (
        <div key={habit.id} style={styles.habitItem}>
          <div>
            {isEditMode && selectedHabit && selectedHabit.id === habit.id ? (
              <input
                type="text"
                value={habit}
                onChange={(e) => setHabit(e.target.value)}
                style={styles.input}
              />
            ) : (
              habit.name
            )}
          </div>
          <div>Days: {habit.daysOfWeek.map((day) => day.slice(0, 3)).join(', ')}</div>
          <button onClick={() => handleEditHabit(habit)} style={styles.editButton}>Edit</button>
          <button onClick={() => handleDeleteHabit(habit.id)} style={styles.deleteButton}>Delete</button>
        </div>
      ))}
      <button onClick={() => setShowForm(true)} style={styles.addButton}>Add Habit</button>
      {showForm && (
        <form onSubmit={handleAddOrUpdateHabit} style={styles.form}>
          <input
            type="text"
            value={habit}
            onChange={(e) => setHabit(e.target.value)}
            placeholder={isEditMode ? 'Edit Habit' : 'New Habit'}
            style={styles.input}
          />
          <div style={styles.checkboxGroup}>
            {Object.keys(daysOfWeek).map((day) => (
              <label key={day} style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={daysOfWeek[day]}
                  onChange={() => handleDayChange(day)}
                />
                {day.slice(0, 3)}
              </label>
            ))}
          </div>
          <button type="submit" style={styles.addButton} disabled={habit.trim() === '' || !Object.values(daysOfWeek).some((day) => day)}>
            {isEditMode ? 'Save' : 'Add Habit'}
          </button>
          <button onClick={resetForm} style={styles.cancelButton}>Cancel</button>
        </form>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
  },
  habitItem: {
    margin: '10px 0',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  editButton: {
    margin: '5px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer',
  },
  deleteButton: {
    margin: '5px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer',
  },
  form: {
    margin: '20px 0',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  checkboxGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
  },
  addButton: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginLeft: '10px',
  },
};

export default AddHabit;
