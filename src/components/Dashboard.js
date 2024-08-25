import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import 'tailwindcss/tailwind.css';

ChartJS.register(...registerables);

const Dashboard = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');

  const db = getFirestore();

  const fetchHabits = async () => {
    try {
      const habitsCollection = collection(db, 'habits');
      const habitsSnapshot = await getDocs(habitsCollection);
      const habitsList = habitsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setHabits(habitsList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching habits:', error);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const getChartData = () => {
    const labels = [];
    const datasets = [];

    for (let i = 1; i <= 7; i++) {
      labels.push(`2024-07-0${i}`);
    }

    habits.forEach((habit) => {
      const data = [];
      for (let i = 1; i <= 7; i++) {
        const date = `2024-07-0${i}`;
        data.push(habit.completion && habit.completion[date] ? 1 : 0);
      }

      datasets.push({
        label: habit.name,
        data,
        borderColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        fill: false,
      });
    });

    return { labels, datasets };
  };

  const getXPData = () => {
    const labels = habits.map(habit => habit.name);
    const data = habits.map(habit => habit.xp || 0);

    return {
      labels,
      datasets: [{
        label: 'XP',
        data,
        backgroundColor: labels.map(() => `#${Math.floor(Math.random() * 16777215).toString(16)}`),
      }]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 5,
        },
      },
    },
  };

  return loading ? (
    <div className="flex justify-center items-center h-screen dark:bg-gray-900">
      <div className="spinner"></div>
    </div>
  ) : (
    <div className="container mx-auto p-4 dark:bg-gray-900 dark:text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Habit Dashboard</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="border border-gray-300 dark:border-gray-700 rounded p-2 dark:bg-gray-800 dark:text-white"
        >
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>
      </div>
  
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white shadow-md rounded-lg p-4 h-96 dark:bg-gray-800">
          <h3 className="text-xl font-bold mb-4">Habit Completion</h3>
          <Line data={getChartData()} options={chartOptions} />
        </div>
  
        <div className="bg-white shadow-md rounded-lg p-4 h-96 dark:bg-gray-800">
          <h3 className="text-xl font-bold mb-4">Total XP</h3>
          <Bar data={getXPData()} options={chartOptions} />
        </div>
      </div>
    </div>
  );
  
};

export default Dashboard;
