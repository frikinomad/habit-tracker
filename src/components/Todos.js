// import React, { useEffect, useState } from 'react';
// import { getFirestore, collection, getDocs } from 'firebase/firestore';
// import Spinner from './Spinner';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import { format } from 'date-fns';

// const Todos = () => {
//   const [habits, setHabits] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const db = getFirestore();
  
//   const fetchHabits = async (date) => {
//       const habitsCollection = collection(db, 'habits');
//       const habitsSnapshot = await getDocs(habitsCollection);
//       const habitsList = habitsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//       const dayOfWeek = format(date, 'EEEE'); // Get day of the week in full name
//       const filteredHabits = habitsList.filter(habit => habit.daysOfWeek.includes(dayOfWeek));
//       setHabits(filteredHabits.map(habit => {
//         return {
//           ...habit,
//           style: {
//             borderRadius: '10px',
//             backgroundColor: habit.completed ? 'gray' : 'white',
//           }
//         };
//       }));
//       setLoading(false);
//   };

//   useEffect(() => {
//       fetchHabits(selectedDate);
//   }, [selectedDate]); // Fetch habits whenever the selected date changes
//   return (
//     <div className="container mx-auto p-4">
//       <DatePicker
//         selected={selectedDate}
//         onChange={(date) => {
//           setLoading(true);
//           setSelectedDate(date);
//         }}
//         inline
//         className="mb-4"
//       />
//       {loading ? (
//         <Spinner />
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {habits.map((habit) => (
//             <div key={habit.id} className={`bg-white shadow-md rounded-lg p-4 mb-4 ${habit.style}`}>
//               <h3 className={habit.completed ? "text-green-500 line-through" : "text-gray-800"}>
//                 {habit.name}
//               </h3>
//               <div className="mt-4 flex justify-center space-x-2">
//                 {habit.daysOfWeek.map((day, index) => (
//                   <div
//                     key={index}
//                     className="h-8 w-8 flex items-center justify-center bg-gray-200 rounded-full"
//                   >
//                     {day.slice(0, 1).toUpperCase()}
//                   </div>
//                 ))}
//               </div>
//               <input type="checkbox" checked={habit.completed} className="form-checkbox h-5 w-5 mt-4" readOnly />
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );  
// };  

// export default Todos;


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
    <div className="container mx-auto p-4 dark:bg-gray-900">
      <DatePicker
        selected={selectedDate}
        onChange={(date) => {
          setLoading(true);
          setSelectedDate(date);
        }}
        inline
        className="mb-4 dark:bg-gray-800 dark:text-white"
      />
      {loading ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {habits.map((habit) => (
            <div key={habit.id} 
              className={`bg-white shadow-md rounded-lg p-4 mb-4 ${habit.completed ? "bg-gray-300 dark:bg-gray-700" : "bg-white dark:bg-gray-800"} dark:text-white`}
              style={habit.style}>
              <h3 className={habit.completed ? "text-green-500 line-through dark:text-green-400" : "text-gray-800 dark:text-white"}>
                {habit.name}
              </h3>
              <div className="mt-4 flex justify-center space-x-2">
                {habit.daysOfWeek.map((day, index) => (
                  <div
                    key={index}
                    className="h-8 w-8 flex items-center justify-center bg-gray-200 dark:bg-gray-600 rounded-full dark:text-white"
                  >
                    {day.slice(0, 1).toUpperCase()}
                  </div>
                ))}
              </div>
              <input type="checkbox" checked={habit.completed} className="form-checkbox h-5 w-5 mt-4 dark:bg-gray-700 dark:border-gray-600" readOnly />
            </div>
          ))}
        </div>
      )}
    </div>
  );  
};  

export default Todos;

