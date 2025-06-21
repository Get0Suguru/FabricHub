import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc"; // Google icon from react-icons
import axios from "axios";
import { Snackbar, Paper, Typography, Box } from "@mui/material";
import { CheckCircleOutline as CheckCircleOutlineIcon, ErrorOutline as ErrorOutlineIcon, LockOpen as LockOpenIcon } from "@mui/icons-material";
// import { useNavigate } from "react-router-dom";


export const LoginForm = ({ onSwitch, toggleLogin }) => {
  const [loginData, setLoginData] = useState({ email: "", password: "" }); // its a obj now rather then single entity
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  // this function will make the api to run for login purpose
  const handleSubmit = async (event) => {
    event.preventDefault(); // prevents page reload
    setIsSubmitting(true);

    if (!loginData.email || !loginData.password) {
      setSnackbarMessage("Please enter both email and password.");
      setSnackbarSeverity("error");
      setIsSnackbarOpen(true);
      setIsSubmitting(false);
      return;
    }

    try {
      // eslint-disable-next-line no-unused-vars
      const _response = await axios.post("/api/auth/login", loginData, { withCredentials: true });

      // Assuming successful login if we reach here without an error and backend handles tokens
      // The backend should set an HttpOnly cookie with the JWT token.
      // response.status might be 200 or 201 depending on your API for login.
      
      setSnackbarMessage("Login successful!");
      setSnackbarSeverity("success");
      setIsSnackbarOpen(true);
      
      toggleLogin(); // Updates auth state to 'Logout' and stores in localStorage

      // Clear form fields
      setLoginData({ email: "", password: "" });

    } catch (error) {
      console.error("Login error:", error.response || error.message);
      if (error.response) {
        const status = error.response.status;
        if (status === 400) { // Bad Request
          setSnackbarMessage(error.response.data?.message || "No user found with this email.");
        } else if (status === 401) { // Unauthorized
          setSnackbarMessage(error.response.data?.message || "Incorrect password. Please try again.");
        } else {
          setSnackbarMessage(error.response.data?.message || "Login failed. Please try again.");
        }
      } else {
        setSnackbarMessage("Login failed due to a network issue. Please try again.");
      }
      setSnackbarSeverity("error");
      setIsSnackbarOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsSnackbarOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 1, height: '100%' }}>
      <LockOpenIcon sx={{ fontSize: 40, color: 'teal.600', mb: 1 }} />
      <Typography variant="h5" component="h2" sx={{ fontWeight: 'semibold', mb: 2, textAlign: 'center' }}>
        Login to Your Account
      </Typography>
      <button
        type="button"
        className="flex items-center justify-center w-full border border-gray-300 rounded-md py-2 mb-4 hover:bg-gray-50 transition-colors duration-150"
        disabled // Google OAuth not implemented
      >
        <FcGoogle size={24} className="mr-2" />
        Continue with Google
      </button>
      <Box component="div" sx={{ textAlign: 'center', mb: 2, color: 'grey.600' }}>
        OR
      </Box>

      <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <input
          type="email"
          name="email"
          placeholder="Email *"
          value={loginData.email}
          onChange={handleInputChange}
          className="w-full p-2.5 border border-gray-300 rounded-md mb-4 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-150"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password *"
          value={loginData.password}
          onChange={handleInputChange}
          className="w-full p-2.5 border border-gray-300 rounded-md mb-4 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-150"
          required
        />
        <Box sx={{ mt: 'auto' }}> {/* Pushes button to bottom */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-teal-600 text-white py-2.5 rounded-md hover:bg-teal-700 transition duration-150 ease-in-out disabled:opacity-50"
            >
              {isSubmitting ? "Logging In..." : "Login"}
            </button>
        </Box>
      </Box>

      <Typography sx={{ mt: 3, textAlign: 'center', fontSize: '0.875rem' }}>
        Don't have an account?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="font-medium text-teal-600 hover:text-teal-500 hover:underline"
        >
          Register
        </button>
      </Typography>

      <Snackbar 
        open={isSnackbarOpen} 
        autoHideDuration={4000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Paper 
          elevation={6} 
          sx={{
            p: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            borderRadius: '8px',
            backgroundColor: snackbarSeverity === 'success' ? '#f0fdfa' : '#fef2f2',
            borderLeft: snackbarSeverity === 'success' ? '5px solid #14b8a6' : '5px solid #f87171',
            minWidth: '280px',
          }}
        >
          {snackbarSeverity === 'success' ? 
            <CheckCircleOutlineIcon sx={{ color: '#0f766e', mr: 1.5 }} /> : 
            <ErrorOutlineIcon sx={{ color: '#ef4444', mr: 1.5 }} />
          }
          <Typography variant="subtitle2" sx={{ color: snackbarSeverity === 'success' ? '#0f766e' : '#b91c1c', fontWeight:'medium' }}>
            {snackbarMessage}
          </Typography>
        </Paper>
      </Snackbar>
    </Box>
  );
};