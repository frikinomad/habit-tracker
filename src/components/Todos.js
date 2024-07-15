import React, { useEffect, useState, useCallback } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import Spinner from './Spinner';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

const Todos = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const db = getFirestore();

  const fetchHabits = useCallback( async (date) => {
      const habitsCollection = collection(db, 'habits');
      const habitsSnapshot = await getDocs(habitsCollection);
      const habitsList = habitsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const dayOfWeek = format(date, 'EEEE'); // Get day of the week in full name
      const filteredHabits = habitsList.filter(habit => habit.daysOfWeek.includes(dayOfWeek));
      setHabits(filteredHabits.map(habit => {
        return {
          ...habit,
          style: {
            borderRadius: '10px',
            backgroundColor: habit.completed ? 'gray' : 'white',
          }
        };
      }));
      setLoading(false);
  });

  useEffect(() => {
      fetchHabits(selectedDate);
  }, [selectedDate, habits]); // Fetch habits whenever the selected date changes

  return (
    <div style={styles.container}>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => {
          setLoading(true);
          setSelectedDate(date);
        }}
        inline
      />
      {loading ? <Spinner /> : (
        habits.map(habit => {
          return (
            <div key={habit.id} className="card" style={{ ...styles.habitItem, ...habit.style }}>
              <h3 style={habit.completed ? styles.textChecked : styles.textUnchecked}>{habit.name}</h3>
              <p style={habit.completed ? styles.textChecked : styles.textUnchecked}>{habit.daysOfWeek}</p>
              <input type="checkbox" checked={habit.completed} style={styles.checkbox} readOnly />
            </div>
          );
        })
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
  checkbox: {
    marginRight: '10px',
  },
  textChecked: {
    textDecoration: 'line-through',
    color: 'grey',
  },
  textUnchecked: {
    color: 'black',
  },
};

export default Todos;
