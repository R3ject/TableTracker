// src/pages/SignUp.js
import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button } from '@mui/material';
import { auth } from '../firebase/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success("Account created successfully!");
      navigate('/');
    } catch (error) {
      toast.error("Sign up failed. Please try again.");
      console.error("Sign Up Error:", error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          p: 4,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: 'background.paper'
        }}
      >
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Sign Up for TableTracker
        </Typography>
        <form onSubmit={handleSignUp}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            required
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            required
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Sign Up
          </Button>
          <Box textAlign="center" sx={{ mt: 2 }}>
            <Typography variant="body2">
              Already have an account?{' '}
              <Link to="/login" style={{ textDecoration: 'none', color: 'primary.main' }}>
                Login
              </Link>
            </Typography>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default SignUp;
