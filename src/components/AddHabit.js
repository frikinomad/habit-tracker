import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, query, getDocs, deleteDoc, doc, updateDoc} from 'firebase/firestore';
import Spinner from './Spinner';

const AddHabit = () => {
  const [habit, setHabit] = useState('');
  const [loading, setLoading] = useState(true);
  const [daysOfWeek, setDaysOfWeek] = useState({
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false,
  });
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleUpdateHabit = async (habit) => {
    try {
      const selectedDays = Object.keys(daysOfWeek).filter((day) => daysOfWeek[day]);
      const habitRef = doc(db, 'habits', habit.id);
      await updateDoc(habitRef, {
        name: habit.name,
        daysOfWeek: selectedDays,
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
      fetchHabits(); // Refresh habit list after updating a habit
    } catch (error) {
      console.error('Error updating habit:', error);
    }
  };

  const handleEditHabit = (habit) => {
    const updatedDaysOfWeek = {};
    Object.keys(daysOfWeek).forEach((day) => {
      updatedDaysOfWeek[day] = habit.daysOfWeek.includes(day);
    });
    setDaysOfWeek({ ...updatedDaysOfWeek });
    setIsEditMode(true); // Set edit mode to true when editing a habit
    setSelectedHabit(habit);
    setHabit(habit.name);
  };

  const handleCancelEdit = () => {
    setSelectedHabit(null);
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
    setIsEditMode(false); // Set edit mode to false when canceling edit
  };

  const handleSaveEdit = () => {
    handleUpdateHabit(selectedHabit);
    setSelectedHabit(null);
    setIsEditMode(false); // Set edit mode to false when saving edit
  };

  const handleUpdateDayChange = (day) => {
    setDaysOfWeek((prevDays) => ({
      ...prevDays,
      [day]: !prevDays[day],
    }));
  };

  const [habits, setHabits] = useState([]);
  const db = getFirestore();

  const fetchHabits = async () => {
    const habitsCollection = collection(db, 'habits');
    const habitsSnapshot = await getDocs(habitsCollection);
    const habitsList = habitsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setHabits(habitsList);
    setSelectedHabit(null);
    setLoading(false);
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
    loading ? <Spinner/> : 
    (<div style={styles.container}>
      {habits.map((habit) => (
        <div key={habit.id} style={styles.habitItem}>
          <div>{habit.name}</div>
          <div>
            Days: {habit.daysOfWeek.map(day => day.slice(0, 3)).join(', ')}
          </div>
          <button onClick={() => handleDeleteHabit(habit.id)} style={styles.deleteButton}>Delete</button>
          <button onClick={() => handleEditHabit(habit)} style={styles.editButton}>Edit</button>
        </div>
      ))}

      <form onSubmit={isEditMode ? handleSaveEdit : handleAddHabit} style={styles.form}>
        <input
          type="text"
          value={habit}
          onChange={(e) => setHabit(e.target.value)}
          placeholder={isEditMode ? "Edit Habit" : "New Habit"}
          style={styles.input}
        />
        <div style={styles.checkboxGroup}>
          {Object.keys(daysOfWeek).map((day) => (
            <label key={day} style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={daysOfWeek[day]}
                onChange={isEditMode ? () => handleUpdateDayChange(day) : () => handleDayChange(day)}
              />
              {day.slice(0, 3)}
            </label>
          ))}
        </div>
        {habit.trim() !== '' && Object.values(daysOfWeek).some(day => day) ? (
          <button type="submit" style={styles.addButton}>{isEditMode ? "Save" : "Add Habit"}</button>
        ) : (
          <button disabled style={styles.addButton}>{isEditMode ? "Save" : "Add Habit"}</button>
        )}
      </form>
      {isEditMode && <button onClick={handleCancelEdit} style={styles.cancelButton}>Cancel</button>}
    </div>)
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
  editButton: {
    backgroundColor: '#6495ed',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    padding: '6px',
    marginLeft: '10px',
  },
};

export default AddHabit;
