import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Divider,
  Grid,
  Alert,
  Snackbar,
  Card,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  CircularProgress,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import HomeIcon from '@mui/icons-material/Home';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import EvStationIcon from '@mui/icons-material/EvStation';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useAuth } from '../../components/layout/Navbar';
import { useNavigate } from 'react-router-dom';
import userService from '../../services/userService';

const AccountSettings = () => {
  const { isAuthenticated, userRole, userName } = useAuth();
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const navigate = useNavigate();

  // Load user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await userService.getUserProfile();
        if (response && response.data) {
          setUserProfile(response.data.user);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setNotification({
          open: true,
          message: 'Failed to load user profile',
          severity: 'error'
        });
      }
    };

    if (isAuthenticated) {
      fetchUserProfile();
    } else {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleUpdateVehicle = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(event.currentTarget);
      const vehicleData = {
        vehicleNumber: formData.get('vehicleNumber'),
        vehicleType: formData.get('vehicleType')
      };

      const response = await userService.updateProfile(vehicleData);
      if (response && response.data) {
        setUserProfile(response.data.user);
        setNotification({
          open: true,
          message: 'Vehicle information updated successfully',
          severity: 'success'
        });
      }
    } catch (error) {
      console.error('Error updating vehicle information:', error);
      setNotification({
        open: true,
        message: error.message || 'Failed to update vehicle information',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'operator':
        return <BusinessIcon />;
      default:
        return <PersonIcon />;
    }
  };



  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Account Settings
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Manage your account roles and settings
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* Vehicle Information Section */}
        <Typography variant="h5" gutterBottom>
          Vehicle Information
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Update your vehicle details for easier booking
        </Typography>

        <Box component="form" onSubmit={handleUpdateVehicle} sx={{ mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="vehicleNumber"
                label="Vehicle Number"
                fullWidth
                defaultValue={userProfile?.vehicleNumber || ''}
                required
                placeholder="Enter your vehicle number"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Vehicle Type</InputLabel>
                <Select
                  name="vehicleType"
                  defaultValue={userProfile?.vehicleType || 'car'}
                  label="Vehicle Type"
                >
                  <MenuItem value="car">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <DirectionsCarIcon sx={{ mr: 1 }} /> Car
                    </Box>
                  </MenuItem>
                  <MenuItem value="motorcycle">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TwoWheelerIcon sx={{ mr: 1 }} /> Motorcycle
                    </Box>
                  </MenuItem>
                  <MenuItem value="ev">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <EvStationIcon sx={{ mr: 1 }} /> Electric Vehicle
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Vehicle Information'}
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Typography variant="h5" gutterBottom>
          Your Account Role
        </Typography>
        <Card variant="outlined" sx={{ mb: 4, maxWidth: 300 }}>
          <CardContent sx={{ textAlign: 'center' }}>
            {getRoleIcon(userRole)}
            <Typography variant="h6" sx={{ mt: 1 }}>
              {userRole?.charAt(0).toUpperCase() + userRole?.slice(1)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {userRole === 'operator' ? 'Commercial Parking Operator' : 'Regular Parking User'}
            </Typography>
          </CardContent>
        </Card>
      </Paper>

      {loading && (
        <Box 
          sx={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            backgroundColor: 'rgba(0, 0, 0, 0.3)', 
            zIndex: 9999 
          }}
        >
          <CircularProgress />
        </Box>
      )}

      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AccountSettings;