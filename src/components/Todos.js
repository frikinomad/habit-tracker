import React, { useEffect, useState } from 'react';
import { getFirestore, collection, addDoc, query, getDocs, deleteDoc, doc, updateDoc} from 'firebase/firestore';
import Spinner from './Spinner';

  
const Todos = () => {
    const [habits, setHabits] = useState([]);
    // const [habit, setHabit] = useState('');
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
    const db = getFirestore();

    const fetchHabits = async () => {
        const habitsCollection = collection(db, 'habits');
        const habitsSnapshot = await getDocs(habitsCollection);
        const habitsList = habitsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        const filteredHabits = habitsList.filter(habit => habit.daysOfWeek.includes(today));
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
    fetchHabits();
  }, []); // Fetch habits on initial render
    return (
      <div>
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