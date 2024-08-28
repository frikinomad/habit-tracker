import {React, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import SignUp from './components/SignUp';
import Login from './components/Login';
import AddHabit from './components/AddHabit';
import Goals from './components/Goals';
import Todos from './components/Todos';
import Test from './components/Test';
import HabitDetails from './components/HabitDetails';
import Dashboard from './components/Dashboard';

import NavBar from './components/NavBar';
import { ThemeProvider } from './contexts/Theme';
import UserContextProvider from './contexts/UserContextProvider';

const App = () => {

  const [ themeMode, setThemeMode ] = useState('dark')

  const darkTheme = () => {
    setThemeMode('dark')
  }

  const lightTheme = () => {
    setThemeMode('light')
  }

  useEffect(() => {
    document.querySelector('html').classList.remove('dark', 'light')
    document.querySelector('html').classList.add(themeMode)
  }, [themeMode])

  return (
    <UserContextProvider>
      <ThemeProvider value={{ themeMode, lightTheme, darkTheme }}>
        <Router>
          {/* <ThemeBtn /> */}   {/* theme btn & theme provider are not related so can put this anywhere */}
          <NavBar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/today" element={<Todos />} /> 
            <Route path="/test" element={<Test />} /> 
            <Route path="/habits" element={<AddHabit />} />
            <Route path="/habits/:id" element={<HabitDetails />} /> 
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </UserContextProvider>
  );
};

export default App;
