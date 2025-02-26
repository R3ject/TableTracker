// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import ManageTables from './pages/ManageTables';
import CustomerView from './pages/CustomerView';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-tables"
            element={
              <ProtectedRoute>
                <ManageTables />
              </ProtectedRoute>
            }
          />
          {/* Public Customer View */}
          <Route path="/customer" element={<CustomerView />} />
        </Routes>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;
