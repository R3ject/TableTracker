// src/components/Header.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import { auth } from '../firebase/firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import DemoModeToggle from './DemoModeToggle';

const Header = ({ toggleDarkMode, darkMode }) => {
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        if (currentUser.email && currentUser.email.toLowerCase().includes('staff')) {
          setRole('staff');
        } else {
          setRole('customer');
        }
      } else {
        setRole(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ flexWrap: 'nowrap', justifyContent: 'space-between' }}>
        <Typography 
          variant="h6" 
          sx={{ flexGrow: 1, whiteSpace: 'nowrap', fontSize: { xs: '1rem', sm: '1.25rem' } }}
        >
          TableTracker
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, auto)', gap: 1 }}>
          {role === 'staff' && (
            <>
              {/* Left column: Dashboard and Logout */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/" 
                  sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
                >
                  Dashboard
                </Button>
                {user && (
                  <Button 
                    color="inherit" 
                    onClick={handleLogout} 
                    sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
                  >
                    Logout
                  </Button>
                )}
              </Box>
              {/* Middle column: Demo Mode Toggle */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <DemoModeToggle />
              </Box>
              {/* Right column: Manage Tables and Dark Mode toggle */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/manage-tables" 
                  sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
                >
                  Manage Tables
                </Button>
                <IconButton color="inherit" onClick={toggleDarkMode} sx={{ p: 0.5 }}>
                  {darkMode ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
                </IconButton>
              </Box>
            </>
          )}
          {role === 'customer' && (
            <>
              {/* Left column: Customer button */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/customer" 
                  sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
                >
                  Customer
                </Button>
              </Box>
              {/* Middle column: Demo Mode Toggle */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <DemoModeToggle />
              </Box>
              {/* Right column: Logout and Dark Mode toggle */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                {user && (
                  <Button 
                    color="inherit" 
                    onClick={handleLogout} 
                    sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
                  >
                    Logout
                  </Button>
                )}
                <IconButton color="inherit" onClick={toggleDarkMode} sx={{ p: 0.5 }}>
                  {darkMode ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
                </IconButton>
              </Box>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
