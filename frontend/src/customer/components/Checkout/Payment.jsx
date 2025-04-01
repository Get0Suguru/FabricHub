import React, { useEffect, useState } from 'react';
import { Typography, Box, Button, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Payment ({ deliveryAddress, onComplete, onBack }) {
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [orderSuccessMessage, setOrderSuccessMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Payment.jsx - Received deliveryAddress:', deliveryAddress);
  }, [deliveryAddress]);

  const handleCreateOrder = async () => {
    if (!deliveryAddress || (!deliveryAddress.id && !deliveryAddress._id)) {
      setOrderError('Delivery address ID is missing. Cannot create order.');
      setOrderSuccessMessage(null);
      return;
    }
    
    const addressId = deliveryAddress._id || deliveryAddress.id;

    setIsProcessingOrder(true);
    setOrderError(null);
    setOrderSuccessMessage(null);

    try {
      console.log(`Creating order with address ID: ${addressId}`);
      const response = await axios.post(`/api/orders/create/new/${addressId}`, {}, { 
        withCredentials: true 
      });
      console.log(response.data);
      setOrderSuccessMessage('Order placed successfully! Redirecting...');
      
      sessionStorage.removeItem('currentDeliveryAddressDetails');

      navigate('/account/order', { replace: true, state: { order: response.data } });
      
      onComplete(response.data);
    } catch (error) {
      console.error('Error creating order:', error.response?.data || error.message);
      setOrderError(error.response?.data?.message || 'Failed to create order. Please try again.');
    } finally {
      setIsProcessingOrder(false);
    }
  };

  return (
    <Box className="max-w-md mx-auto">
      <Typography variant="h5" className="mb-4">Payment</Typography>
      {deliveryAddress ? (
        <Box sx={{mb: 2, p:2, border: '1px dashed grey', borderRadius: '4px'}}>
          <Typography variant="subtitle1" gutterBottom>Delivering to:</Typography>
          <Typography variant="body2">{deliveryAddress.firstName} {deliveryAddress.lastName}</Typography>
          <Typography variant="body2">{deliveryAddress.streetAddress}</Typography>
          <Typography variant="body2">{deliveryAddress.city}, {deliveryAddress.state || deliveryAddress.stateValue} {deliveryAddress.zipCode}</Typography>
          <Typography variant="body2">Mobile: {deliveryAddress.mobile}</Typography>
        </Box>
      ) : (
        <Typography sx={{mb:2, color: 'text.secondary'}}>Delivery address not available.</Typography>
      )}
      <Typography sx={{mb:3}}>Confirm your order details and proceed to payment (simulated).</Typography>
      
      {orderError && (
        <Alert severity="error" sx={{ my: 2 }}>
          {orderError}
        </Alert>
      )}
      {orderSuccessMessage && (
        <Alert severity="success" sx={{ my: 2 }}>
          {orderSuccessMessage}
        </Alert>
      )}
      
      <div className="flex gap-4 mt-6">
        <Button 
          variant="outlined" 
          onClick={onBack} 
          className="flex-1 px-6 py-2"
          sx={{
            borderColor: '#14b8a6',
            color: '#14b8a6',
            '&:hover': {
              borderColor: '#0f766e',
              color: '#0f766e',
              backgroundColor: 'rgba(14, 184, 166, 0.04)'
            }
          }}
          disabled={isProcessingOrder}
        >
          Back
        </Button>
        <Button 
          variant="contained" 
          onClick={handleCreateOrder}
          className="flex-1 px-6 py-2"
          sx={{
            backgroundColor: '#14b8a6',
            '&:hover': {
              backgroundColor: isProcessingOrder ? '' : '#0f766e'
            }
          }}
          disabled={isProcessingOrder || !deliveryAddress}
        >
          {isProcessingOrder ? <CircularProgress size={24} color="inherit" /> : 'Complete Order'}
        </Button>
      </div>
    </Box>
  );
}

export default Payment;