import logo from './logo.svg';
import './App.css';

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUpPage from './pages/SignUpPage';
import HabitPage from './pages/HabitPage';
import GoalsPage from './pages/GoalsPage';

// src/App.js
import NavBar from './components/NavBar';

const App = () => {
  return (
    <Router>
        <NavBar />
      <Routes>
        <Route path="/habit" element={<HabitPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/goals" element={<GoalsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
