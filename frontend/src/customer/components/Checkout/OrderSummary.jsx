import React, { useState, useEffect } from 'react';
import { Button, Box, Typography, List, ListItem, Divider } from '@mui/material';
import axios from 'axios';

// OrderSummary no longer receives cartData as a prop
const OrderSummary = ({ onComplete, onBack }) => { 
  const [cartSummaryData, setCartSummaryData] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('OrderSummary.jsx - Fetching cart summary from API...');
    setIsLoading(true);
    setError(null);
    axios.get('/api/cart/get', { withCredentials: true })
      .then(response => {
        console.log('OrderSummary.jsx - API response:', response.data);
        setCartSummaryData(response.data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('OrderSummary.jsx - Error fetching cart:', err);
        setError('Could not load cart summary. Please try again.');
        setIsLoading(false);
      });
  }, []); // Empty dependency array: fetch once when component mounts

  // Use cartSummaryData for calculations and rendering
  const orderItems = cartSummaryData?.cartItems || []; // Assuming cartItems is still part of the response for item listing
  const totalItem = cartSummaryData?.totalItem || 0;
  const totalPrice = cartSummaryData?.totalPrice || 0;
  const totalDiscountedPrice = cartSummaryData?.totalDiscountedPrice || 0;
  const discount = cartSummaryData?.discount || 0;
  
  const deliveryCharges = totalDiscountedPrice > 499 ? 0 : 69; // Assuming this remains fixed
  // The final total should be based on totalDiscountedPrice + deliveryCharges
  const finalTotal = totalDiscountedPrice + deliveryCharges;

  if (isLoading) {
    return <Typography sx={{textAlign: 'center', my: 3}}>Loading order summary...</Typography>;
  }

  if (error) {
    return <Typography color="error" sx={{textAlign: 'center', my: 3}}>{error}</Typography>;
  }
  
  if (!cartSummaryData) { // If no data after loading (e.g., empty cart from API or error handled above)
    return <Typography sx={{textAlign: 'center', my: 3}}>Your cart is empty or summary could not be loaded.</Typography>;
  }

  return (
    <Box className="max-w-md mx-auto">
      <Typography variant="h5" className="mb-4">Order Summary</Typography>

      {totalItem > 0 && (
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Total Items: {totalItem}
        </Typography>
      )}
      
      {orderItems.length > 0 ? (
        <List dense>
          {orderItems.map((item, index) => (
            <React.Fragment key={item.id || index}>
              <ListItem className="flex justify-between">
                <span>{item.product?.title || 'Product Name'} × {item.quantity}</span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      ) : (
        !isLoading && <Typography sx={{textAlign: 'center', my: 3, color: 'text.secondary'}}>
            No items listed in your order.
        </Typography>
      )}

      <div className="mt-4 space-y-2">
        <div className="flex justify-between">
          <span>Subtotal (MRP):</span>
          <span>₹{totalPrice.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Total Discount:</span>
            <span>- ₹{discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Price after discount:</span>
          <span>₹{totalDiscountedPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery Charges:</span>
          <span className="text-green-600">₹{deliveryCharges.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg mt-2">
          <span>Total Amount:</span>
          <span className="text-green-600">₹{finalTotal.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <Button 
          variant="outlined" 
          onClick={onBack}
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
        >
          Back
        </Button>
        <Button 
          variant="contained" 
          onClick={onComplete}
          sx={{
            backgroundColor: '#14b8a6', 
            '&:hover': {
              backgroundColor: '#0f766e' 
            }
          }}
          className="flex-1 px-6 py-2" 
          disabled={isLoading || !cartSummaryData || totalItem === 0} // Disable if loading, no data, or no items
        >
          Continue to Payment
        </Button>
      </div>
    </Box>
  );
};

export default OrderSummary;