import React, { useEffect, useState } from 'react';
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

    const fetchHabits = async (date) => {
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
    };

    useEffect(() => {
        fetchHabits(selectedDate);
    }, [selectedDate]); // Fetch habits whenever the selected date changes

    return (
      <div>
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
              <div key={habit.id} className="card" style={styles.item}>
                <h3 style={habit.completed ? styles.textChecked : styles.textUnchecked}>{habit.name}</h3>
                <p style={habit.completed ? styles.textChecked : styles.textUnchecked}>{habit.daysOfWeek}</p>
                <input type="checkbox" checked={habit.completed} style={styles.checkbox} />
              </div>
            );
          })
        )}
      </div>
    );
};

const styles = {
  item: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
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
