// src/components/ProtectedRoleRoute.js
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

const ProtectedRoleRoute = ({ allowedRoles, children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // For demo purposes, if email contains "staff", assign staff; otherwise customer.
        if (currentUser.email && currentUser.email.toLowerCase().includes('staff')) {
          setRole('staff');
        } else {
          setRole('customer');
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  // If no user is logged in, redirect to the login page.
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If the user's role is not allowed for this route, redirect to a default page.
  if (!allowedRoles.includes(role)) {
    return <Navigate to={role === 'customer' ? "/customer" : "/"} />;
  }

  return children;
};

export default ProtectedRoleRoute;
