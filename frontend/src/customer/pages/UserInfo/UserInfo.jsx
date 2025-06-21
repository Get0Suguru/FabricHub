import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Grid,
  Avatar,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
  Button,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  PersonOutline as PersonOutlineIcon,
  EmailOutlined as EmailOutlinedIcon,
  PhoneAndroidOutlined as PhoneAndroidOutlinedIcon,
  HomeOutlined as HomeOutlinedIcon,
  ReceiptLongOutlined as ReceiptLongOutlinedIcon,
  ChevronRight as ChevronRightIcon,
  Edit as EditIcon,
  DeleteOutline as DeleteOutlineIcon,
  LocationOnOutlined as LocationOnOutlinedIcon,
  SettingsOutlined as SettingsOutlinedIcon,
  AccountCircleOutlined as AccountCircleOutlinedIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const TEAL_ACCENT_COLOR = '#14b8a6'; // For primary actions or highlights

// Helper to format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric'
  });
};

const UserInfo = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('/api/users/profile', {
          withCredentials: true,
        });
        setUserData(response.data);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError(err.response?.data?.message || 'Failed to fetch user profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress sx={{ color: TEAL_ACCENT_COLOR }} />
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

  if (!userData) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="info">User data not available.</Alert>
      </Container>
    );
  }

  const { firstName, lastName, email, mobile, address, orders } = userData;
  const userInitial = firstName ? firstName[0].toUpperCase() : '?';

  return (
    <Container sx={{ py: { xs: 3, md: 5 }, backgroundColor: '#f7fafc' }}> {/* Light grey background */}
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, color: '#2d3748', mb: 4, textAlign: 'center' }}>
        Account Overview
      </Typography>

      {/* User Profile & Settings Section */}
      <Paper elevation={2} sx={{ p: { xs: 2, md: 3 }, mb: 4, borderRadius: '12px', overflow: 'hidden' }}>
        <Grid container spacing={{ xs: 2, md: 3 }} alignItems="center">
          <Grid item xs={12} sm={3} md={2} sx={{ textAlign: 'center' }}>
            <Avatar 
              sx={{ 
                width: { xs: 70, md: 90 }, 
                height: { xs: 70, md: 90 }, 
                bgcolor: '#e2e8f0', // Light grey avatar bg
                color: TEAL_ACCENT_COLOR, // Teal initial
                fontSize: { xs: '2rem', md: '2.8rem' }, 
                margin: 'auto',
                border: `2px solid ${TEAL_ACCENT_COLOR}`
              }}
            >
              {userInitial}
            </Avatar>
          </Grid>
          <Grid item xs={12} sm={9} md={7}>
            <Typography variant="h4" component="h2" sx={{ fontWeight: 600, color: '#2d3748' }}>
              {firstName || "User"} {lastName || "Name"}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
              Joined: {formatDate(userData.createdAt) || "Recently"} {/* Assuming createdAt exists */}
            </Typography>
          </Grid>
          <Grid item xs={12} md={3} sx={{ textAlign: { xs: 'center', md: 'right' } }}>
             <Button variant="outlined" startIcon={<SettingsOutlinedIcon />} sx={{
                borderColor: '#cbd5e0',
                color: '#4a5568',
                textTransform: 'none',
                borderRadius: '8px',
                '&:hover': {
                    borderColor: TEAL_ACCENT_COLOR,
                    backgroundColor: 'rgba(20, 184, 166, 0.04)',
                    color: TEAL_ACCENT_COLOR
                }
             }}>
                Account Settings
             </Button>
          </Grid>
        </Grid>
      </Paper>

    <Grid container spacing={4}>
        {/* Left Column: Personal Info & Addresses */}
        <Grid item xs={12} lg={5}>
            {/* Personal Information Card */}
            <Paper elevation={2} sx={{ p: {xs:2, md:2.5}, mb: 3, borderRadius: '12px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AccountCircleOutlinedIcon sx={{ color: TEAL_ACCENT_COLOR, mr: 1.5, fontSize: '1.8rem' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#374151' }}>Personal Information</Typography>
                </Box>
                <Divider sx={{mb: 2}}/>
                <List dense>
                    <ListItem>
                        <ListItemIcon sx={{minWidth: 36}}><EmailOutlinedIcon fontSize="small" color="action"/></ListItemIcon>
                        <ListItemText primary="Email" secondary={email || 'N/A'} />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon sx={{minWidth: 36}}><PhoneAndroidOutlinedIcon fontSize="small" color="action" /></ListItemIcon>
                        <ListItemText primary="Mobile" secondary={mobile || 'N/A'} />
                    </ListItem>
                </List>
                <Button variant="text" size="small" startIcon={<EditIcon fontSize="small"/>} sx={{mt:1, color: TEAL_ACCENT_COLOR, textTransform:'none', '&:hover': {backgroundColor: 'rgba(20, 184, 166, 0.08)'}}}>
                    Edit Information
                </Button>
            </Paper>

            {/* Saved Addresses Section */}
            <Paper elevation={2} sx={{ p: {xs:2, md:2.5}, borderRadius: '12px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOnOutlinedIcon sx={{ color: TEAL_ACCENT_COLOR, mr: 1.5, fontSize: '1.8rem' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#374151' }}>Manage Addresses</Typography>
                </Box>
                <Divider sx={{mb:2}}/>
                {address && address.length > 0 ? (
                    <List disablePadding>
                    {address.slice(0,2).map((addr) => ( // Show first 2 addresses
                        <ListItem key={addr.id} sx={{ px:0, py: 1.5, borderBottom: '1px solid #e2e8f0', '&:last-child': {borderBottom:0} }} >
                        <ListItemIcon sx={{minWidth: 36}}><HomeOutlinedIcon fontSize="small" color="action"/></ListItemIcon>
                        <ListItemText 
                            primary={`${addr.firstName} ${addr.lastName} - ${addr.city}`}
                            secondary={`${addr.streetAddress}, ${addr.state} - ${addr.zipCode}`}
                            primaryTypographyProps={{fontWeight: 500, color: '#4a5568'}}
                        />
                        <Box>
                            <Tooltip title="Edit Address (Static)">
                                <IconButton size="small" sx={{mr:0.5, color: '#718096', '&:hover': {color: TEAL_ACCENT_COLOR}}}><EditIcon fontSize="small" /></IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Address (Static)">
                                <IconButton size="small" sx={{color: '#718096', '&:hover': {color: '#ef4444'}}}><DeleteOutlineIcon fontSize="small" /></IconButton>
                            </Tooltip>
                        </Box>
                        </ListItem>
                    ))}
                     {address.length > 2 && 
                        <Button fullWidth sx={{mt:2, color: TEAL_ACCENT_COLOR, textTransform:'none', '&:hover': {backgroundColor: 'rgba(20, 184, 166, 0.08)'}}}>
                            View All ({address.length}) Addresses
                        </Button>}
                    </List>
                ) : (
                    <Typography variant="body2" color="text.secondary" sx={{textAlign: 'center', py:2}}>No saved addresses found.</Typography>
                )}
                 <Button variant="outlined" size="small" sx={{mt:2, width:'100%', color: TEAL_ACCENT_COLOR, borderColor: TEAL_ACCENT_COLOR, textTransform:'none', '&:hover': {backgroundColor: 'rgba(20, 184, 166, 0.08)', borderColor: TEAL_ACCENT_COLOR} }}>
                    + Add New Address
                </Button>
            </Paper>
        </Grid>

        {/* Right Column: Recent Orders */}
        <Grid item xs={12} lg={7}>
            <Paper elevation={2} sx={{ p: {xs:2, md:2.5}, borderRadius: '12px', height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ReceiptLongOutlinedIcon sx={{ color: TEAL_ACCENT_COLOR, mr: 1.5, fontSize: '1.8rem' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#374151' }}>Recent Orders</Typography>
                </Box>
                <Divider sx={{mb:2}}/>
                {orders && orders.length > 0 ? (
                    <List disablePadding>
                    {orders.slice(0, 3).map((order) => ( // Show up to 3 recent orders
                        <ListItem
                        key={order.id}
                        button
                        component={RouterLink}
                        to={`/account/order/${order.id}`}
                        sx={{ 
                            py: 1.5, 
                            px: {xs:1, md:2},
                            mb: 1.5, 
                            borderRadius: '8px', 
                            backgroundColor: '#ffffff', 
                            boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06)',
                            '&:hover': {
                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                                transform: 'translateY(-2px)',
                                backgroundColor: '#f9fafb'
                            },
                            transition: 'transform 0.2s, box-shadow 0.2s'
                        }}
                        >
                        <ListItemIcon sx={{minWidth: {xs:32, md:40}}}>
                            <ReceiptLongOutlinedIcon fontSize="small" sx={{ color: TEAL_ACCENT_COLOR }} />
                        </ListItemIcon>
                        <ListItemText 
                            primary={`Order #${order.id}`}
                            secondary={`Items: ${order.totalItems} | Total: ₹${order.totalDicountedPrice?.toFixed(2)} | ${formatDate(order.orderDate)}`}
                            primaryTypographyProps={{fontWeight: 500, color: '#4a5568'}}
                            secondaryTypographyProps={{fontSize: '0.8rem'}}
                        />
                        <Chip label={order.orderStatus?.replace('_', ' ') || 'N/A'} size="small" sx={{textTransform: 'capitalize', mr:1, fontSize: '0.75rem'}}/>
                        <ChevronRightIcon color="action"/>
                        </ListItem>
                    ))}
                    {orders.length > 3 && (
                        <Button 
                            component={RouterLink} 
                            to="/account/order" 
                            variant="text" 
                            fullWidth
                            sx={{mt:1, color: TEAL_ACCENT_COLOR, textTransform:'none', '&:hover': {backgroundColor: 'rgba(20, 184, 166, 0.08)'} }}
                        >
                            View All Orders ({orders.length})
                        </Button>
                    )}
                    </List>
                ) : (
                    <Typography variant="body2" color="text.secondary" sx={{textAlign: 'center', py:2}}>You haven't placed any orders yet.</Typography>
                )}
            </Paper>
        </Grid>
    </Grid>

    </Container>
  );
};

export default UserInfo;
