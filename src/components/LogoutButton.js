// src/components/LogoutButton.js
import React from 'react';
import { auth } from '../firebase/firebaseConfig';
import { signOut } from 'firebase/auth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully!');
      navigate('/login');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
