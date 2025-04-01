import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc"; // Google icon from react-icons
import axios from "axios";
import { Snackbar, Paper, Typography, Box } from "@mui/material";
import { CheckCircleOutline as CheckCircleOutlineIcon, ErrorOutline as ErrorOutlineIcon } from "@mui/icons-material";

// Register Form Component
export const RegisterForm = ({ onSwitch }) => {
  // Keep existing form data state if it's used for direct DOM manipulation fallback
  // but ideally, inputs should be controlled components.
  const [registerDataState, setRegisterDataState] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    mobile: "",
  });

  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // 'success' or 'error'
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setRegisterDataState(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const email = registerDataState.email.trim();
    const password = registerDataState.password; // Passwords might intentionally have spaces
    const firstName = registerDataState.firstName.trim();
    const lastName = registerDataState.lastName.trim();
    const mobileString = registerDataState.mobile.trim();

    // 1. Check for empty required string fields
    if (!email || !password || !firstName || !lastName || !mobileString) {
      setSnackbarMessage("Please fill in all required fields.");
      setSnackbarSeverity("error");
      setIsSnackbarOpen(true);
      setIsSubmitting(false);
      return;
    }

    // 2. Validate mobile number format (10 digits) and parse
    if (!/^\d{10}$/.test(mobileString)) {
        setSnackbarMessage("Mobile number must be 10 digits.");
        setSnackbarSeverity("error");
        setIsSnackbarOpen(true);
        setIsSubmitting(false);
        return;
    }
    const mobileNumber = parseInt(mobileString, 10);
    if (isNaN(mobileNumber)) { // Should not happen if regex passes, but as a safeguard
        setSnackbarMessage("Invalid mobile number format.");
        setSnackbarSeverity("error");
        setIsSnackbarOpen(true);
        setIsSubmitting(false);
        return;
    }

    // 3. Construct payload
    const payload = {
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      mobile: mobileNumber, // mobile is now a number
    };

    try {
      const response = await axios.post("/api/auth/register", payload);
      console.log("Registration successful:", response.data);
      setSnackbarMessage("user Received/ signup successfull now login to your account");
      setSnackbarSeverity("success");
      setIsSnackbarOpen(true);

      setRegisterDataState({ email: "", password: "", firstName: "", lastName: "", mobile: "" });
      
      setTimeout(() => {
        onSwitch();
      }, 3000);

    } catch (error) {
      console.error("Registration error details:", error.response || error.message);
      let errorMessage = "Registration failed. Please try again.";
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      setSnackbarMessage(errorMessage);
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
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Typography variant="h5" component="h2" sx={{ fontWeight: 'semibold', mb: 2, textAlign: 'center' }}>
        Create Account
      </Typography>
      <button
        type="button"
        className="flex items-center justify-center w-full border border-gray-300 rounded-md py-2 mb-4 hover:bg-gray-100"
        // onClick={() => { /* TODO: Implement Google OAuth */ }}
        disabled // Disabled for now as it's not implemented
      >
        <FcGoogle size={24} className="mr-2" />
        Continue with Google
      </button>
      <Box component="div" sx={{ textAlign: 'center', mb: 2, color: 'grey.600' }}>
        OR
      </Box>

      <form onSubmit={handleRegisterSubmit} style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <input
          type="email"
          id="email"
          placeholder="Email *"
          className="w-full p-2 border border-gray-300 rounded mb-3 focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
          required
          value={registerDataState.email}
          onChange={handleInputChange}
        />
        <input
          type="password"
          id="password"
          placeholder="Password *"
          className="w-full p-2 border border-gray-300 rounded mb-3 focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
          required
          value={registerDataState.password}
          onChange={handleInputChange}
        />
        <input
          type="text"
          id="firstName"
          placeholder="First Name *"
          className="w-full p-2 border border-gray-300 rounded mb-3 focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
          required
          value={registerDataState.firstName}
          onChange={handleInputChange}
        />
        <input
          type="text"
          id="lastName"
          placeholder="Last Name *"
          className="w-full p-2 border border-gray-300 rounded mb-3 focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
          required
          value={registerDataState.lastName}
          onChange={handleInputChange}
        />
        <input
          type="tel"
          id="mobile"
          placeholder="Mobile Number * (10 digits)"
          title="Mobile number should be 10 digits"
          className="w-full p-2 border border-gray-300 rounded mb-3 focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
          required
          value={registerDataState.mobile}
          onChange={handleInputChange}
          maxLength={10}
        />
        <Box sx={{ mt: 'auto' }}> {/* Pushes button to bottom if form grows */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-teal-600 text-white py-2.5 rounded-md hover:bg-teal-700 transition duration-150 ease-in-out disabled:opacity-50"
            >
              {isSubmitting ? "Registering..." : "Register"}
            </button>
        </Box>
      </form>

      <Typography sx={{ mt: 2, textAlign: 'center', fontSize: '0.875rem' }}>
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="font-medium text-teal-600 hover:text-teal-500 hover:underline"
        >
          Login
        </button>
      </Typography>
      
      <Snackbar 
        open={isSnackbarOpen} 
        autoHideDuration={3000} // Shortened duration slightly
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
            backgroundColor: snackbarSeverity === 'success' ? '#f0fdfa' : '#fef2f2', // Light teal for success, light red for error
            borderLeft: snackbarSeverity === 'success' ? '5px solid #14b8a6' : '5px solid #f87171', // Teal for success, red for error
            minWidth: '280px',
          }}
        >
          {snackbarSeverity === 'success' ? 
            <CheckCircleOutlineIcon sx={{ color: '#0f766e', mr: 1.5 }} /> : // Darker teal icon
            <ErrorOutlineIcon sx={{ color: '#ef4444', mr: 1.5 }} /> // Red icon
          }
          <Typography variant="subtitle2" sx={{ color: snackbarSeverity === 'success' ? '#0f766e' : '#b91c1c', fontWeight:'medium' }}>
            {snackbarMessage}
          </Typography>
        </Paper>
      </Snackbar>
    </Box>
  );
};
