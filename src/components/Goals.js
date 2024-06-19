import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, getDocs , deleteDoc, doc } from 'firebase/firestore';


const GoalTracker = () => {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState('');

  const db = getFirestore();

  const fetchGoals = async () => {
    const goalsCollection = collection(db, 'goals');
    const goalsSnapshot = await getDocs(goalsCollection);
    const goalsData = goalsSnapshot.docs.map((doc) => doc.data());
    setGoals(goalsData);
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
    <div>
      {goals.map((goal) => (
        <div key={goal.id}> {goal.goal}</div>
      ))}
      <input
        type="text"
        value={newGoal}
        onChange={(e) => setNewGoal(e.target.value)}
        placeholder="Enter a new goal"
      />
      <button onClick={handleAddGoal}>Add Goal</button>
    </div>
  );
};

export default GoalTracker;