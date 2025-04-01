import React, { useState } from 'react';
import { TextField, Button, Box, Typography, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios'; // Import axios for making API calls

const Login = ({ onComplete }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault(); // Prevent blur on click
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    try {
      // Validate and login logic here
      const response = await axios.post('/api/auth/login', { email, password }, { withCredentials: true });
      // Added withCredentials: true, assuming it's needed for HttpOnly cookies
      console.log('Login successful:', response.data);
      // Backend should set HttpOnly cookie. Frontend relies on this for subsequent requests.
      // No explicit token storage here on the client-side for security with HttpOnly.
      onComplete();
    } catch (err) {
      console.error('Login failed:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <Box className="max-w-md mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-md">
      <Typography variant="h5" className="mb-4 text-center text-gray-700 font-semibold">Login to Continue</Typography>
      {error && <Typography color="error" className="mb-2 text-sm text-center">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          variant="outlined"
        />
        <TextField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          margin="normal"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button
          type="submit"
          variant="contained"
          sx={{
            mt: 2, // Added margin top for spacing
            backgroundColor: '#14b8a6', // teal-600 (MUI uses 600 for this shade typically)
            '&:hover': {
              backgroundColor: '#0f766e', // teal-700
            },
            py: 1.5, // Adjusted padding for better button height
            fontWeight: 'medium'
          }}
          className="mt-4 px-6 py-2" // Tailwind classes can be refined or removed if sx is preferred
          fullWidth
        >
          Login & Continue
        </Button>
      </form>
    </Box>
  );
};

export default Login;