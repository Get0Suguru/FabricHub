import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Grid,
  Avatar,
  CardActionArea,
  CardMedia
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CalendarToday, ShoppingBagOutlined } from '@mui/icons-material'; // Using ShoppingBag for items count

// Helper to format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric' // Shortened month format
  });
};

// Status color mapping (adjust based on your actual orderStatus values)
const statusColors = {
  PENDING: 'warning',
  PROCESSING: 'info',
  SHIPPED: 'primary',
  CONFIRMED: 'secondary', // Added example
  OUT_FOR_DELIVERY: 'info', // Added example
  DELIVERED: 'success',
  CANCELED: 'error',
  RETURNED: 'default',
};

const OrderCard = ({ order }) => {
  const navigate = useNavigate();

  if (!order) {
    return null;
  }

  const handleCardClick = () => {
    navigate(`/account/order/${order.id}`);
    console.log(`Navigating to order details for order ID: ${order.id}`);
  };

  // Use the first item's image as a representative image for the order
  const representativeImageUrl = order.orderItems && order.orderItems[0]?.product?.imageUrl 
    ? order.orderItems[0].product.imageUrl 
    : 'https://via.placeholder.com/150?text=No+Image'; // Fallback image

  return (
    <Card sx={{ display: 'flex', mb: 2.5, boxShadow: 2, transition: '0.3s', '&:hover': { boxShadow: 5, transform: 'translateY(-2px)' } }}>
      <CardActionArea onClick={handleCardClick} sx={{ display: 'flex', width: '100%', p:0 }}>
        <CardMedia
          component="img"
          sx={{ 
            width: 120, 
            height: '100%', // Make image take full height of card content area
            objectFit: 'cover', 
            borderRight: '1px solid', 
            borderColor: 'divider'
          }}
          image={representativeImageUrl}
          alt={`Order ${order.id}`}
        />
        <CardContent sx={{ flex: '1 1 auto', p: '16px !important' }}> 
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
              Order ID: #{order.id}
            </Typography>
            <Chip
              label={order.orderStatus?.replace('_', ' ') || 'N/A'} // Replace underscores for display
              color={statusColors[order.orderStatus?.toUpperCase()] || 'default'}
              size="small"
              sx={{ textTransform: 'capitalize', fontWeight: 'medium' }}
            />
          </Box>
          
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 1, lineHeight: 1.3 }}>
             {/* Displaying title of the first product as a general idea of the order contents */}
            {order.orderItems && order.orderItems.length > 0 
              ? `${order.orderItems[0].product?.title}${order.orderItems.length > 1 ? ` + ${order.orderItems.length - 1} more` : ''}`
              : 'Order Items Unavailable'}
          </Typography>

          <Grid container spacing={1} alignItems="center" sx={{ mb: 1.5}}>
            <Grid item sx={{display: 'flex', alignItems:'center'}}>
                <CalendarToday fontSize="inherit" sx={{ mr: 0.5, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                    {formatDate(order.orderDate)}
                </Typography>
            </Grid>
            <Grid item sx={{display: 'flex', alignItems:'center'}}>
                <ShoppingBagOutlined fontSize="inherit" sx={{ mr: 0.5, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                    {order.totalItems} item(s)
                </Typography>
            </Grid>
          </Grid>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt:1 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold'}}>
              Total: ₹{order.totalDicountedPrice?.toFixed(2) || order.totalPrice?.toFixed(2)}
            </Typography>
            <Typography variant="body2" sx={{color: 'primary.main', fontWeight:'medium'}}>
                View Details &rarr;
            </Typography>
          </Box>

        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default OrderCard;