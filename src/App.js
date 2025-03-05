// src/App.js
import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import Header from './components/Header';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import ManageTables from './pages/ManageTables';
import CustomerView from './pages/CustomerView';
import ProtectedRoleRoute from './components/ProtectedRoleRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { lightTheme, darkTheme } from './theme';

function App() {
  // Initialize darkMode state from localStorage (default is false if not set)
  const [darkMode, setDarkMode] = useState(() => {
    const storedMode = localStorage.getItem('darkMode');
    return storedMode ? JSON.parse(storedMode) : false;
  });

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const newMode = !prev;
      localStorage.setItem('darkMode', JSON.stringify(newMode));
      return newMode;
    });
  };

  // Memoize the theme based on the darkMode state
  const theme = useMemo(() => (darkMode ? darkTheme : lightTheme), [darkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Header toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Staff-only routes */}
          <Route
            path="/"
            element={
              <ProtectedRoleRoute allowedRoles={['staff']}>
                <Dashboard />
              </ProtectedRoleRoute>
            }
          />
          <Route
            path="/manage-tables"
            element={
              <ProtectedRoleRoute allowedRoles={['staff']}>
                <ManageTables />
              </ProtectedRoleRoute>
            }
          />

          {/* Customer-only route */}
          <Route
            path="/customer"
            element={
              <ProtectedRoleRoute allowedRoles={['customer']}>
                <CustomerView />
              </ProtectedRoleRoute>
            }
          />
        </Routes>
        <ToastContainer />
      </Router>
    </ThemeProvider>
  );
}

export default App;
