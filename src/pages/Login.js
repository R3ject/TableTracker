// src/pages/Login.js
import React, { useState } from "react";
import { Button, TextField, Container, Typography, Box } from "@mui/material";
import { auth } from "../firebase/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    // Basic regex for email validation
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError(true);
      toast.error("Please enter a valid email address.");
      return;
    }
    setEmailError(false);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Logged in successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
      console.error(error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          p: 4,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: "background.paper",
        }}
      >
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Login to TableTracker
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            required
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={emailError}
            helperText={
              emailError && (
                <span style={{ display: "flex", alignItems: "center" }}>
                  <ErrorOutlineIcon style={{ marginRight: 4 }} />
                  Invalid email address.
                </span>
              )
            }
            sx={{
              animation: emailError ? "shake 0.5s" : "none",
            }}
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
            Login
          </Button>
          <Box textAlign="center" sx={{ mt: 2 }}>
            <Typography variant="body2">
              Don't have an account?{" "}
              <Link
                to="/signup"
                style={{ textDecoration: "none", color: "primary.main" }}
              >
                Sign Up
              </Link>
            </Typography>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
