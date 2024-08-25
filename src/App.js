import './App.css';

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import SignUp from './components/SignUp';
import AddHabit from './components/AddHabit';
import Goals from './components/Goals';
import Todos from './components/Todos';
import HabitDetails from './components/HabitDetails';
import Dashboard from './components/Dashboard';

import NavBar from './components/NavBar';

const App = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        {/* <Route path="/" element={<DashboardPage />} /> */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/today" element={<Todos />} /> 
        <Route path="/habits" element={<AddHabit />} />
        <Route path="/habits/:id" element={<HabitDetails />} /> 
        <Route path="/signup" element={<SignUp />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
