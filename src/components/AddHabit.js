import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, query, getDocs, deleteDoc, doc } from 'firebase/firestore';

const AddHabit = () => {
  const [habit, setHabit] = useState('');
  const [daysOfWeek, setDaysOfWeek] = useState({
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false,
  });
  const [habits, setHabits] = useState([]);
  const db = getFirestore();

  const fetchHabits = async () => {
    const habitsCollection = collection(db, 'habits');
    const habitsSnapshot = await getDocs(habitsCollection);
    const habitsList = habitsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setHabits(habitsList);
  };

  useEffect(() => {
    fetchHabits();
  }, []); // Fetch habits on initial render

  const handleAddHabit = async (e) => {
    e.preventDefault();
    try {
      const selectedDays = Object.keys(daysOfWeek).filter((day) => daysOfWeek[day]);
      await addDoc(collection(db, 'habits'), {
        name: habit,
        daysOfWeek: selectedDays,
        createdAt: new Date(),
      });
      setHabit('');
      setDaysOfWeek({
        Monday: false,
        Tuesday: false,
        Wednesday: false,
        Thursday: false,
        Friday: false,
        Saturday: false,
        Sunday: false,
      });
      fetchHabits(); // Refresh habit list after adding a new habit
    } catch (error) {
      console.error('Error adding habit:', error);
    }
  };

  const handleDeleteHabit = async (habitId) => {
    try {
      await deleteDoc(doc(db, 'habits', habitId));
      fetchHabits(); // Refresh habit list after deleting a habit
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

  return (
    <div style={styles.container}>
      {habits.map((habit) => (
        <div key={habit.id} style={styles.habitItem}>
          <div>{habit.name}</div>
          <div>
            Days: {habit.daysOfWeek.map(day => day.slice(0, 3)).join(', ')}
          </div>
          <button onClick={() => handleDeleteHabit(habit.id)} style={styles.deleteButton}>Delete</button>
        </div>
      ))}
      <form onSubmit={handleAddHabit} style={styles.form}>
        <input
          type="text"
          value={habit}
          onChange={(e) => setHabit(e.target.value)}
          placeholder="New Habit"
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
        <button type="submit" style={styles.addButton}>Add Habit</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  habitItem: {
    backgroundColor: '#f5f5f5',
    padding: '10px',
    borderRadius: '8px',
    marginBottom: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '400px',
  },
  deleteButton: {
    backgroundColor: '#ff6347',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    padding: '6px',
  },
  form: {
    marginTop: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  input: {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    marginBottom: '10px',
    width: '300px',
  },
  checkboxGroup: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: '10px',
  },
  checkboxLabel: {
    margin: '5px',
  },
  addButton: {
    padding: '10px',
    backgroundColor: '#333',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    width: '150px',
  },
};

export default AddHabit;