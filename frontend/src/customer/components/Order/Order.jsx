import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Alert, Container, Grid } from '@mui/material';
import axios from 'axios';
import OrderCard from './OrderCard';
// Removed useLocation for now, will rely on API fetch primarily
// import { useLocation } from 'react-router-dom';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const location = useLocation(); // Potentially use location.state.order later

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('/api/orders/user', {
          withCredentials: true,
        });
        // The API returns an array of orders directly
        setOrders(response.data || []); 
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.response?.data?.message || 'Failed to fetch orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Your Orders
      </Typography>
      {orders.length === 0 ? (
        <Typography variant="subtitle1">You have no orders yet.</Typography>
      ) : (
        <Grid container spacing={3}>
          {orders.map((order) => (
            <Grid item xs={12} key={order.id}>
              <OrderCard order={order} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Order;