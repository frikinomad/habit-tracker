import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import Spinner from './Spinner';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { is } from 'date-fns/locale';

const Todos = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const db = getFirestore();

  // Function to update habit history in Firestore and local state
  const updateHabitHistory = async (habitId, isCompleted) => {
    try {
      const habitRef = doc(db, 'habits', habitId);
      const today = format(selectedDate, 'yyyy-MM-dd');
      const action = isCompleted ? 'finished' : 'didNotAttempt';

      // Update the history for the selected date in Firestore
      await updateDoc(habitRef, {
        [`history.${today}`]: { actionPerformed: action }
      });

      // Update local state for immediate UI feedback
      setHabits(prevHabits => {
        return prevHabits.map(habit => {
          if (habit.id === habitId) {
            return {
              ...habit,
              completed: isCompleted,
              style: {
                borderRadius: '10px',
                backgroundColor: isCompleted ? 'gray' : 'white',
              }
            };
          }
          return habit;
        });
      });
    } catch (error) {
      console.error('Error updating habit history:', error);
    }
  };

  // Function to handle checkbox state changes
  const handleCheckboxChange = async (habitId) => {
    // Find the habit to update
    const habitToUpdate = habits.find(habit => habit.id === habitId);
    if (!habitToUpdate) return;

    const newCompleted = !habitToUpdate.completed;

    // Update habit history in Firestore and local state
    await updateHabitHistory(habitId, newCompleted);
  };

  // Function to fetch habits from Firestore
  const fetchHabits = async (date) => {
    setLoading(true);
    const habitsCollection = collection(db, 'habits');
    const habitsSnapshot = await getDocs(habitsCollection);
    const habitsList = habitsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const dayOfWeek = format(date, 'EEEE'); // Get day of the week in full name

    const filteredHabits = habitsList.filter(habit => habit.daysOfWeek.includes(dayOfWeek));
    // Filter habits based on the day of the week and map through to add new properties
    const updatedHabits = filteredHabits.map(habit => {
      const today = format(selectedDate, 'yyyy-MM-dd');
      const history = habit.history || {};
      console.log(habit.name);
      console.log(history);
      const historyItem = history[today];
      const isCompleted = historyItem && historyItem.actionPerformed === 'finished';
      console.log(isCompleted);
      console.log("*******************");
      return {
        ...habit,
        completed: isCompleted,
        style: {
          borderRadius: '10px',
          backgroundColor: isCompleted ? 'gray' : 'white',
        }
      };
    });
    // console.log(updatedHabits);
    setHabits(updatedHabits);
    setLoading(false);
  };

  useEffect(() => {
    // Fetch habits on component mount and when selectedDate changes
    fetchHabits(selectedDate);
  }, [selectedDate]); // Dependency array ensures it runs when selectedDate changes

  // Function to handle date change
  const handleDateChange = (date) => {
    setSelectedDate(date);
    // Fetch habits when date changes
    fetchHabits(date);
  };

  return (
    <div style={styles.container}>
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        inline
      />
      {loading ? (
        <Spinner />
      ) : (
        habits.map(habit => (
          <div key={habit.id} className="card" style={{ ...styles.habitItem, ...habit.style }}>
            <h3 style={habit.completed ? styles.textChecked : styles.textUnchecked}>{habit.name}</h3>
            <p style={habit.completed ? styles.textChecked : styles.textUnchecked}>{habit.daysOfWeek}</p>
            <h4>Selected Date:</h4>
            <p>{selectedDate.toISOString()}</p>
            {habit.history && Object.entries(habit.history).map(([date, historyItem]) => (
              <div key={date}>
                <h4>History for {historyItem.date}:</h4>
                <p>{historyItem.actionPerformed}</p>
              </div>
            ))}
            <input
              type="checkbox"
              checked={habit.completed}
              style={styles.checkbox}
              readOnly
              onClick={() => handleCheckboxChange(habit.id)}
            />
          </div>
        ))
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
  checkbox: {
    marginRight: '10px',
  },
  textChecked: {
    textDecoration: 'line-through',
  },
  textUnchecked: {
    color: 'black',
  },
};

export default Todos;
