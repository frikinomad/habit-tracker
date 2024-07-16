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
    <div className="container mx-auto p-4">
      {isLoading ? (
        <Spinner />
      ) : (
        goals.map((goal) => (
          <div key={goal.id} className="bg-white shadow-md rounded-lg p-4 mb-4">
            {goal.goal}
          </div>
        ))
      )}
      <div className="flex items-center space-x-4 mt-4">
        <input
          type="text"
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          placeholder="Enter a new goal"
          className="border border-gray-300 rounded-lg p-2 w-full"
        />
        <button
          onClick={handleAddGoal}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Goal
        </button>
      </div>
    </div>
  );
};  

export default GoalTracker;