import logo from './logo.svg';
import './App.css';

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignUpPage from './pages/SignUpPage';
import HabitPage from './pages/HabitPage';
import GoalsPage from './pages/GoalsPage';
import InspirationPage from './pages/InspirationsPage';
import TodosPage from './pages/TodosPage';

// src/App.js
import NavBar from './components/NavBar';

const App = () => {
  return (
    <Router>
        <NavBar />
      <Routes>
        <Route path="/" element={<TodosPage />} /> 
        <Route path="/habits" element={<HabitPage />} /> 
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/goals" element={<GoalsPage />} />
        <Route path="/inspirations" element={<InspirationPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;