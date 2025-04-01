import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Paper, List, ListItem, ListItemText, CircularProgress, Divider as MuiDivider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const SESSION_STORAGE_KEY = 'currentDeliveryAddressDetails';

// Removed mockSavedAddresses

const DeliveryAddressForm = ({ onComplete, onBack }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateValue, setStateValue] = useState('');
  const [zipCode, setZipCode] = useState('');

  const [showSavedAddresses, setShowSavedAddresses] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [isLoadingSavedAddresses, setIsLoadingSavedAddresses] = useState(false);
  const [fetchSavedAddressesError, setFetchSavedAddressesError] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [addressForDisplay, setAddressForDisplay] = useState(null);
  const [isAddressFromSavedList, setIsAddressFromSavedList] = useState(false);

  // Effect for loading current address details from session storage
  useEffect(() => {
    const storedAddress = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (storedAddress) {
      try {
        const parsedAddress = JSON.parse(storedAddress);
        setAddressForDisplay(parsedAddress);
        // If you also stored a flag indicating it was from saved list, retrieve it here
        // For now, we assume if it's in session, it was either submitted or selected.
        // The isAddressFromSavedList will be primarily set by direct user action in this session.
      } catch (e) {
        console.error("Error parsing stored address from sessionStorage", e);
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
      }
    }
  }, []);

  // Effect for fetching saved addresses when 'showSavedAddresses' becomes true
  useEffect(() => {
    if (showSavedAddresses && savedAddresses.length === 0) { // Fetch only if shown and not already fetched
      setIsLoadingSavedAddresses(true);
      setFetchSavedAddressesError(null);
      axios.get('/api/address/all', { withCredentials: true })
        .then(response => {
          setSavedAddresses(response.data || []); // Ensure it's an array
          setIsLoadingSavedAddresses(false);
        })
        .catch(error => {
          console.error('Error fetching saved addresses:', error);
          setFetchSavedAddressesError('Could not load saved addresses.');
          setIsLoadingSavedAddresses(false);
        });
    }
  }, [showSavedAddresses]); // Removed savedAddresses.length from dependency array to allow re-fetch if list is empty and shown again.

  const updateCurrentAddressDisplay = (address, fromSaved = false) => {
    setAddressForDisplay(address);
    setIsAddressFromSavedList(fromSaved);
    if (address) {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(address));
    } else {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }
  };

  const handleFieldChange = (setter, value) => {
    setter(value);
    setIsAddressFromSavedList(false);
  };

  const handleSelectSavedAddress = (address) => {
    setFirstName(address.firstName || '');
    setLastName(address.lastName || '');
    setMobile(address.mobile || '');
    setStreetAddress(address.streetAddress || '');
    setCity(address.city || '');
    setStateValue(address.state || '');
    setZipCode(address.zipCode || '');
    setShowSavedAddresses(false);
    setSubmitError(null);
    updateCurrentAddressDisplay(address, true);
  };

  const handleCreateAddressSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    setIsAddressFromSavedList(false);
    updateCurrentAddressDisplay(null);

    const addressData = {
      firstName,
      lastName,
      mobile,
      streetAddress,
      city,
      state: stateValue,
      zipCode,
    };

    try {
      const response = await axios.post('/api/address/create', addressData, { 
        withCredentials: true 
      });
      console.log('Address created successfully (API response):', response.data);
      
      // Directly use the address object returned by the API
      const createdAddress = response.data; 

      updateCurrentAddressDisplay(createdAddress, false);
      onComplete(createdAddress); // Pass the API-returned address (with ID) to onComplete
    } catch (error) {
      console.error('Error creating address:', error.response?.data || error.message);
      setSubmitError(error.response?.data?.message || 'Failed to save address. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitOrContinue = (e) => {
    e.preventDefault();
    if (isAddressFromSavedList && addressForDisplay) {
      console.log("Proceeding with selected saved address:", addressForDisplay);
      onComplete(addressForDisplay);
    } else {
      handleCreateAddressSubmit();
    }
  };

  return (
    <Box className="max-w-lg mx-auto ">
      <Typography variant="h5" className="mb-4">Delivery Address</Typography>

      <form onSubmit={handleSubmitOrContinue}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2, mt: 2}}>
          <TextField
            label="First Name"
            fullWidth
            required
            value={firstName}
            onChange={(e) => handleFieldChange(setFirstName, e.target.value)}
            margin="none"
            disabled={isSubmitting}
          />
          <TextField
            label="Last Name"
            fullWidth
            required
            value={lastName}
            onChange={(e) => handleFieldChange(setLastName, e.target.value)}
            margin="none"
            disabled={isSubmitting}
          />
        </Box>

        <TextField
          label="Mobile Number"
          fullWidth
          margin="normal"
          required
          value={mobile}
          onChange={(e) => handleFieldChange(setMobile, e.target.value.replace(/[^0-9]/g, ''))}
          type="tel"
          disabled={isSubmitting}
        />
        <TextField
          label="Street Address"
          fullWidth
          margin="normal"
          required
          value={streetAddress}
          onChange={(e) => handleFieldChange(setStreetAddress, e.target.value)}
          disabled={isSubmitting}
        />

        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            label="City"
            fullWidth
            required
            value={city}
            onChange={(e) => handleFieldChange(setCity, e.target.value)}
            margin="none"
            disabled={isSubmitting}
          />
          <TextField
            label="State"
            fullWidth
            required
            value={stateValue}
            onChange={(e) => handleFieldChange(setStateValue, e.target.value)}
            margin="none"
            disabled={isSubmitting}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mt: 2, mb: 1 }}>
          <TextField
            label="Zip Code"
            sx={{ flexGrow: 1 }}
            required
            value={zipCode}
            onChange={(e) => {
              const numericValue = e.target.value.replace(/[^0-9]/g, '');
              handleFieldChange(setZipCode, numericValue);
            }}
            type="text"
            margin="none"
            inputProps={{ 
              inputMode: 'numeric',
              pattern: '[0-9]*'
            }}
            disabled={isSubmitting}
          />
          <Button 
            variant="outlined" 
            onClick={() => {
                setShowSavedAddresses(!showSavedAddresses); 
            }}
            sx={{ 
              borderColor: 'teal',
              color: 'teal',
              '&:hover': { borderColor: 'darkcyan', color: 'darkcyan'},
              height: '56px',
              px: 3,
              minWidth: '180px'
            }}
            disabled={isSubmitting || isLoadingSavedAddresses}
          >
            {isLoadingSavedAddresses ? <CircularProgress size={24}/> : (showSavedAddresses ? 'Hide Saved Ones' : 'Pick a saved one')}
          </Button>
        </Box>

        {showSavedAddresses && (
          <Paper elevation={2} sx={{ mb: 2, p: 1, maxHeight: 200, overflow: 'auto', width: '100%' }}>
            {isLoadingSavedAddresses && <Box sx={{display: 'flex', justifyContent: 'center', my:2}}><CircularProgress /></Box>}
            {fetchSavedAddressesError && <Typography color="error" sx={{p:1}}>{fetchSavedAddressesError}</Typography>}
            {!isLoadingSavedAddresses && !fetchSavedAddressesError && savedAddresses.length === 0 && (
              <Typography sx={{p:1, color: 'text.secondary'}}>No saved addresses found.</Typography>
            )}
            {!isLoadingSavedAddresses && !fetchSavedAddressesError && savedAddresses.length > 0 && (
              <List dense>
                {savedAddresses.map((addr) => (
                  <ListItem 
                    key={addr.id || addr._id}
                    button 
                    onClick={() => handleSelectSavedAddress(addr)}
                    divider
                  >
                    <ListItemText 
                      primary={`${addr.firstName} ${addr.lastName}`}
                      secondary={`${addr.streetAddress}, ${addr.city}, ${addr.state} ${addr.zipCode}`}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        )}

        {submitError && (
          <Typography color="error" sx={{ my: 2, textAlign: 'center' }}>
            {submitError}
          </Typography>
        )}

        <div className="flex gap-4 mt-6">
          <Button 
            variant="outlined" 
            onClick={() => {
                onBack(); 
            }}
            sx={{
              borderColor: '#14b8a6',
              color: '#14b8a6',
              '&:hover': {
                borderColor: '#0f766e',
                color: '#0f766e',
                backgroundColor: 'rgba(14, 184, 166, 0.04)'
              }
            }}
            className="flex-1 px-6 py-2"
            disabled={isSubmitting}
          >
            Back
          </Button>
          <Button 
            type="submit"
            variant="contained" 
            sx={{
              backgroundColor: '#14b8a6',
              '&:hover': {
                backgroundColor: isSubmitting ? '' : '#0f766e'
              },
            }}
            className="flex-1 px-6 py-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : (isAddressFromSavedList ? 'Continue' : 'Save & Continue')}
          </Button>
        </div>
      </form>

      {addressForDisplay && (
        <Paper elevation={1} sx={{ p: 2, mt: 3, backgroundColor: '#e0f2f7' }}>
          <Typography variant="subtitle1" gutterBottom sx={{ color: '#00796b' }}>
            Current Address Details:
          </Typography>
          <MuiDivider sx={{mb:1}}/>
          <Typography variant="body2"><strong>Name:</strong> {addressForDisplay.firstName} {addressForDisplay.lastName}</Typography>
          <Typography variant="body2"><strong>Mobile:</strong> {addressForDisplay.mobile}</Typography>
          <Typography variant="body2"><strong>Address:</strong> {addressForDisplay.streetAddress}</Typography>
          <Typography variant="body2"><strong>City:</strong> {addressForDisplay.city}</Typography>
          <Typography variant="body2"><strong>State:</strong> {addressForDisplay.state}</Typography>
          <Typography variant="body2"><strong>Zip Code:</strong> {addressForDisplay.zipCode}</Typography>
        </Paper>
      )}
    </Box>
  );
};

export default DeliveryAddressForm;