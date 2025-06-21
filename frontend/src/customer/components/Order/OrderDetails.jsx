import React, { useEffect, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  Grid,
  CircularProgress,
  Alert,
  Avatar,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Container,
} from "@mui/material";
import {
  LocalShipping,
  CalendarToday,
  Home,
  LocationOn,
  Person,
  Phone,
  CheckCircle,
  HourglassEmpty, // For Pending
  ThumbUpAlt,    // For Confirmed
  // LocalShipping as ShippedIcon, // Already imported
  AirplanemodeActive as OutForDeliveryIcon,
  DoneAll as DeliveredIcon,
  ArrowBack as ArrowBackIcon,
  ShoppingBagOutlined
} from "@mui/icons-material";

const TEAL_COLOR = "#14b8a6"; // teal-500
const TEAL_DARK_COLOR = "#0f766e"; // teal-700

// Helper to format date
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getStatusChipColor = (status) => {
  switch (status?.toUpperCase()) {
    case "PENDING":
      return "warning";
    case "CONFIRMED":
      return "info";
    case "SHIPPED":
      return "primary";
    case "OUT_FOR_DELIVERY":
      return "info";
    case "DELIVERED":
      return "success";
    case "CANCELED":
      return "error";
    default:
      return "default";
  }
};

const statusSteps = [
  { label: "Pending", status: "PENDING", icon: <HourglassEmpty /> },
  { label: "Confirmed", status: "CONFIRMED", icon: <ThumbUpAlt /> },
  { label: "Shipped", status: "SHIPPED", icon: <LocalShipping /> },
  { label: "Out for Delivery", status: "OUT_FOR_DELIVERY", icon: <OutForDeliveryIcon /> },
  { label: "Delivered", status: "DELIVERED", icon: <DeliveredIcon /> },
];

const getActiveStep = (orderStatus) => {
  const stepIndex = statusSteps.findIndex(step => step.status === orderStatus?.toUpperCase());
  return stepIndex === -1 ? 0 : stepIndex; // Default to first step if status not found
};


const OrderDetails = () => {
  const { id: orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setError("Order ID not found.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/api/orders/${orderId}`, {
          withCredentials: true,
        });
        setOrder(response.data);
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError(
          err.response?.data?.message ||
            "Failed to fetch order details. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

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
        <Alert severity="error" action={
          <Button component={RouterLink} to="/account/order" color="inherit" size="small" sx={{ '&:hover': { color: TEAL_DARK_COLOR }}}>
            Back to Orders
          </Button>
        }>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="info">Order data is not available.</Alert>
        <Button component={RouterLink} to="/account/order" startIcon={<ArrowBackIcon />} sx={{ mt: 2 }}>
          Back to My Orders
        </Button>
      </Container>
    );
  }
  
  const activeStep = getActiveStep(order.orderStatus);

  return (
    <Container sx={{ py: 4 }}>
      <Button
        component={RouterLink}
        to="/account/order"
        startIcon={<ArrowBackIcon />}
        sx={{ 
          mb: 3,
          color: TEAL_COLOR,
          borderColor: TEAL_COLOR,
          '&:hover': {
            backgroundColor: 'rgba(20, 184, 166, 0.04)', // Light teal background on hover
            borderColor: TEAL_DARK_COLOR,
            color: TEAL_DARK_COLOR,
          }
        }}
        variant="outlined"
      >
        Back to My Orders
      </Button>

      <Paper elevation={3} sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Order #{order.id}
          </Typography>
          <Chip
            label={order.orderStatus?.replace("_", " ") || "N/A"}
            color={getStatusChipColor(order.orderStatus)}
            sx={{ textTransform: "capitalize", fontWeight: "medium" }}
          />
        </Box>
        <Grid container spacing={1} sx={{ color: 'text.secondary', mb:2 }}>
            <Grid item sx={{display: 'flex', alignItems:'center', mr:2}}>
                <CalendarToday fontSize="inherit" sx={{ mr: 0.5 }} />
                <Typography variant="body2">
                    Ordered: {formatDate(order.orderDate)}
                </Typography>
            </Grid>
            {order.deliveryDate && (
                 <Grid item sx={{display: 'flex', alignItems:'center'}}>
                    <LocalShipping fontSize="inherit" sx={{ mr: 0.5 }} />
                    <Typography variant="body2">
                        Est. Delivery: {formatDate(order.deliveryDate)}
                    </Typography>
                </Grid>
            )}
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Stepper activeStep={activeStep} alternativeLabel sx={{mb:3, mt: 3}}>
          {statusSteps.map((step, index) => (
            <Step key={step.label} completed={index < activeStep}>
              <StepLabel
                StepIconComponent={() => (
                    <Box sx={{ color: index <= activeStep ? TEAL_COLOR : 'text.disabled' }}>
                        {React.cloneElement(step.icon, {
                         fontSize: "medium"
                        })}
                    </Box>
                )}
              >
                {step.label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>


      <Grid container spacing={3}>
        {/* Left Column: Order Items & Summary */}
        <Grid item xs={12} md={7} lg={8}>
          <Card elevation={2} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
                Order Items ({order.totalItems})
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List disablePadding>
                {order.orderItems?.map((item) => (
                  <React.Fragment key={item.id}>
                    <ListItem sx={{ py: 2, px:0, alignItems: 'flex-start' }}>
                      <Avatar
                        variant="rounded"
                        src={item.product?.imageUrl}
                        alt={item.product?.title}
                        sx={{ width: 80, height: 80, mr: 2, border: '1px solid', borderColor: 'divider' }}
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                          {item.product?.title || "Product Name Unavailable"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Size: {item.size || "N/A"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Qty: {item.quantity || 0}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="subtitle1" fontWeight="medium">
                          ₹{item.discountedPrice?.toFixed(2)}
                        </Typography>
                        {item.price !== item.discountedPrice && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ textDecoration: "line-through" }}
                          >
                            ₹{item.price?.toFixed(2)}
                          </Typography>
                        )}
                      </Box>
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column: Shipping & Payment Summary */}
        <Grid item xs={12} md={5} lg={4}>
          <Card elevation={2} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium', display: 'flex', alignItems: 'center' }}>
                <Home sx={{ mr: 1, color: TEAL_COLOR }} /> Delivery Address
              </Typography>
              <Divider sx={{ my: 1.5 }} />
              {order.shippingAddress ? (
                <>
                  <Typography variant="subtitle1" fontWeight="medium">
                    {order.shippingAddress.firstName}{" "}
                    {order.shippingAddress.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {order.shippingAddress.streetAddress}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{mt:1, display: 'flex', alignItems: 'center'}}>
                    <Phone fontSize="inherit" sx={{ mr: 0.5 }} /> {order.shippingAddress.mobile}
                  </Typography>
                </>
              ) : (
                <Typography>Shipping address not available.</Typography>
              )}
            </CardContent>
          </Card>

          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium', display: 'flex', alignItems: 'center' }}>
                 <ShoppingBagOutlined sx={{ mr: 1, color: TEAL_COLOR }}/> Order Summary
              </Typography>
              <Divider sx={{ my: 1.5 }} />
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography color="text.secondary">Subtotal ({order.totalItems} items)</Typography>
                <Typography>₹{order.totalPrice?.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography color="text.secondary">Discount</Typography>
                <Typography color="error.main">- ₹{order.discount?.toFixed(2)}</Typography>
              </Box>
              <Divider sx={{ my: 1.5 }} />
              <Box sx={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
                <Typography variant="h6" fontWeight="bold">Grand Total</Typography>
                <Typography variant="h6" fontWeight="bold">₹{order.totalDicountedPrice?.toFixed(2)}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default OrderDetails;
