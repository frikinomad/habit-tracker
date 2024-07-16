import React from 'react';
import { useParams } from 'react-router-dom';

const HabitDetails = () => {
  const { id } = useParams();
  
  const habit = {
    id,
    name: 'Exercise',
    description: 'Daily morning exercise',
    reason: 'Stay healthy'
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-4 mb-4">
        <h3 className="text-gray-800 font-bold text-lg">{habit.name}</h3>
        <p className="text-gray-600 mt-2">{habit.description}</p>
        <p className="text-gray-500 mt-2 italic">Why: {habit.reason}</p>
      </div>
    </div>
  );
};

export default HabitDetails;
