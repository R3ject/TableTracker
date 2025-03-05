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
  const [screenshotMode, setScreenshotMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        if (currentUser.email?.toLowerCase().includes('staff')) {
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

  const toggleScreenshotMode = () => {
    setScreenshotMode(prev => !prev);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 1 }}>
          {/* Row 1: Title and Dark Mode Toggle */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}>
              TableTracker
            </Typography>
            <IconButton color="inherit" onClick={toggleDarkMode} sx={{ p: 0.5 }}>
              {darkMode ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
            </IconButton>
          </Box>
          {/* Row 2: Demo Mode Toggle (centered) */}
          {!screenshotMode && (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <DemoModeToggle />
            </Box>
          )}
          {/* Row 3: Navigation/Account Controls */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            {role === "staff" && (
              <>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button color="inherit" component={Link} to="/" sx={{ fontSize: { xs: "0.65rem", sm: "0.75rem" } }}>
                    Dashboard
                  </Button>
                  <Button color="inherit" component={Link} to="/manage-tables" sx={{ fontSize: { xs: "0.65rem", sm: "0.75rem" } }}>
                    Manage Tables
                  </Button>
                </Box>
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  {user && (
                    <Button color="inherit" onClick={handleLogout} sx={{ fontSize: { xs: "0.65rem", sm: "0.75rem" } }}>
                      Logout
                    </Button>
                  )}
                  <Button color="inherit" onClick={toggleScreenshotMode} sx={{ fontSize: { xs: "0.65rem", sm: "0.75rem" } }}>
                    {screenshotMode ? "Show UI" : "Hide UI"}
                  </Button>
                </Box>
              </>
            )}
            {role === "customer" && (
              <>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button color="inherit" component={Link} to="/customer" sx={{ fontSize: { xs: "0.65rem", sm: "0.75rem" } }}>
                    Customer
                  </Button>
                </Box>
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  {user && (
                    <Button color="inherit" onClick={handleLogout} sx={{ fontSize: { xs: "0.65rem", sm: "0.75rem" } }}>
                      Logout
                    </Button>
                  )}
                  <Button color="inherit" onClick={toggleScreenshotMode} sx={{ fontSize: { xs: "0.65rem", sm: "0.75rem" } }}>
                    {screenshotMode ? "Show UI" : "Hide UI"}
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
