import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, getDocs , deleteDoc, doc } from 'firebase/firestore';
import Spinner from './Spinner';

const GoalTracker = () => {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState('');
  const [isLoading, setIsLoading] = useState(true); // New loading state

  const db = getFirestore();

  const fetchGoals = async () => {
    const goalsCollection = collection(db, 'goals');
    const goalsSnapshot = await getDocs(goalsCollection);
    const goalsData = goalsSnapshot.docs.map((doc) => doc.data());
    setGoals(goalsData);
    setIsLoading(false); // Set loading state to false after fetching data
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleAddGoal = async () => {
    if (newGoal.trim() !== '') {
      const newGoalDoc = await addDoc(collection(db, 'goals'), { goal: newGoal });
      setGoals([...goals, { goal: newGoal, id: newGoalDoc.id }]);
      setNewGoal('');
    }
  };

  const handleDeleteGoal = async (GoalId) => {
    try {
        await deleteDoc(doc(db, 'goals', GoalId));
        fetchGoals(); // Refresh habit list after deleting a habit
      } catch (error) {
        console.error('Error deleting Goal:', error);
      }
  }
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 py-10 px-4">
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="w-full max-w-xl space-y-6">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className="bg-white dark:bg-gray-700 rounded-2xl shadow-md p-6 transition-transform transform hover:scale-105"
            >
              <span className="text-lg font-semibold text-gray-800 dark:text-white">
                {goal.goal}
              </span>
            </div>
          ))}
        </div>
      )}
  
      <div className="w-full max-w-xl flex items-center space-x-4 mt-6">
        <input
          type="text"
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          placeholder="Enter a new goal"
          className="flex-1 border border-gray-300 dark:border-gray-600 rounded-xl p-4 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
        <button
          onClick={handleAddGoal}
          className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors"
        >
          Add Goal
        </button>
      </div>
    </div>
  );
  

};  

export default GoalTracker;