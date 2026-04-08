import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/apiUtils';
import { 
  Container, 
  Box, 
  CardContent,
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Chip, 
  CircularProgress, 
  Alert, 
  AppBar, 
  Toolbar, 
  IconButton, 
  Avatar, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  useMediaQuery,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Snackbar
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { 
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  ExitToApp as LogoutIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Menu as MenuIcon,
  MyLocation as MyLocationIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Animations
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5 }
  }
};

const fieldVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: custom => ({ 
    opacity: 1, 
    x: 0, 
    transition: { 
      delay: custom * 0.1,
      duration: 0.3
    }
  })
};

const buttonVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.1, transition: { duration: 0.3 } }
};

const ProfilePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // State variables
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  // We don't need menuVisible state as we're not using collapsible sections
  
  // For this example, we'll hardcode the user ID, but in a real app it would come from auth context
  const userId = '550e8400-e29b-41d4-a716-446655440000'; // Donor user  // Fetch user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const profileData = await api.user.getProfile(userId);
        setProfile(profileData);
        setFormData(profileData);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  // Handle input changes in edit form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Toggle edit mode
  const handleToggleEditMode = () => {
    if (editMode) {
      // If canceling edit, reset form data to original profile
      setFormData(profile);
    }
    
    setEditMode(!editMode);
    // Reset any error or success messages
    setError('');
    setSuccess(false);
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    // Basic form validation
    if (!formData.username?.trim()) {
      setError('Username is required');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email?.trim() || !emailRegex.test(formData.email)) {
      setError('Valid email is required');
      return;
    }    setSubmitting(true);
    setError('');
    
    try {
      await api.user.updateProfile(userId, formData);
      
      // Update the profile state with new data
      setProfile({
        ...profile,
        ...formData,
        updated_at: new Date().toISOString()
      });
      
      setSuccess(true);
      setEditMode(false);
      
      // Auto-dismiss success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle mobile menu
  const handleToggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Handle navigation
  const handleNavigate = (path) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  // Handle logout dialog
  const handleOpenLogoutDialog = () => {
    setLogoutDialogOpen(true);
    setMobileMenuOpen(false);
  };

  const handleCloseLogoutDialog = () => {
    setLogoutDialogOpen(false);
  };  const handleLogout = async () => {
    try {
      // Import auth service and call logout method
      const { authService } = await import('../utils/authUtils');
      const result = await authService.logout();
      
      if (result.success) {
        // Close dialog and navigate to home
        handleCloseLogoutDialog();
        navigate('/');
      } else {
        // Show error if logout failed but still navigate to home
        console.error('Logout error:', result.error);
        handleCloseLogoutDialog();
        navigate('/');
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Even if there's an error, still attempt to navigate away
      handleCloseLogoutDialog();
      navigate('/');
    }
  };

  // Handle geolocation detection
  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Could not detect your location. Please enter manually.');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser. Please enter location manually.');
    }
  };

  // Handle alert close
  const handleAlertClose = () => {
    setSuccess(false);
    setError('');
  };

  // Render loading state
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          width: '100%',
          bgcolor: 'background.default'
        }}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 2 }}>Loading your profile...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar position="fixed" sx={{ backgroundColor: 'white', color: 'text.primary', boxShadow: 1 }}>
        <Toolbar>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleToggleMobileMenu}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', cursor: 'pointer' }} onClick={() => navigate('/')}>
            FoodShare
          </Typography>
          
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button
                color="inherit"
                startIcon={<HomeIcon />}
                sx={{ mx: 1, transition: 'all 0.3s', '&:hover': { textDecoration: 'underline' } }}
                onClick={() => navigate('/')}
              >
                Home
              </Button>
              
              <Button
                color="inherit"
                startIcon={<DashboardIcon />}
                sx={{ mx: 1, transition: 'all 0.3s', '&:hover': { textDecoration: 'underline' } }}
                onClick={() => navigate('/dashboard')}
              >
                Dashboard
              </Button>
              
              <Button
                color="inherit"
                startIcon={<PersonIcon />}
                sx={{ 
                  mx: 1, 
                  fontWeight: 'bold', 
                  color: 'primary.main', 
                  transition: 'all 0.3s',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                Profile
              </Button>
              
              <Button
                color="inherit"
                startIcon={<NotificationsIcon />}
                sx={{ mx: 1, transition: 'all 0.3s', '&:hover': { textDecoration: 'underline' } }}
                onClick={() => navigate('/notifications')}
              >
                Notifications
              </Button>
              
              <Button
                color="inherit"
                startIcon={<LogoutIcon />}
                sx={{ mx: 1, transition: 'all 0.3s', '&:hover': { textDecoration: 'underline' } }}
                onClick={handleOpenLogoutDialog}
              >
                Logout
              </Button>
            </Box>
          )}
          
          <Avatar 
            sx={{ 
              ml: 2, 
              bgcolor: 'primary.main', 
              cursor: 'pointer',
              transition: 'all 0.3s',
              '&:hover': { 
                transform: 'scale(1.1)'
              }
            }}
          >
            {profile?.username?.charAt(0) || 'U'}
          </Avatar>
        </Toolbar>
      </AppBar>

      {/* Mobile Menu Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={handleToggleMobileMenu}
        sx={{
          '& .MuiDrawer-paper': {
            width: '70%',
            maxWidth: 300,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              mb: 2,
              bgcolor: 'primary.main',
              fontSize: '2rem',
            }}
          >
            {profile?.username?.charAt(0) || 'U'}
          </Avatar>
          <Typography variant="h6">{profile?.username}</Typography>
          <Typography variant="body2" color="text.secondary">
            {profile?.role?.charAt(0).toUpperCase() + profile?.role?.slice(1)}
          </Typography>
        </Box>
        
        <Divider />
        
        <List>
          <ListItem button onClick={() => handleNavigate('/')}>
            <ListItemIcon><HomeIcon /></ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          
          <ListItem button onClick={() => handleNavigate('/dashboard')}>
            <ListItemIcon><DashboardIcon /></ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          
          <ListItem button selected>
            <ListItemIcon><PersonIcon color="primary" /></ListItemIcon>
            <ListItemText primary="Profile" primaryTypographyProps={{ color: 'primary' }} />
          </ListItem>
          
          <ListItem button onClick={() => handleNavigate('/notifications')}>
            <ListItemIcon><NotificationsIcon /></ListItemIcon>
            <ListItemText primary="Notifications" />
          </ListItem>
        </List>
        
        <Divider />
        
        <List>
          <ListItem button onClick={handleOpenLogoutDialog}>
            <ListItemIcon><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: { xs: 2, md: 4 },
          mt: { xs: 8, md: 10 },
          transition: 'all 0.3s ease',
        }}
      >
        {/* Alerts */}
        <Snackbar 
          open={Boolean(error)} 
          autoHideDuration={6000} 
          onClose={handleAlertClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            severity="error" 
            variant="filled"
            onClose={handleAlertClose}
            sx={{ 
              width: '100%',
              animation: error ? 'shake 0.5s' : 'none',
              '@keyframes shake': {
                '0%, 100%': { transform: 'translateX(0)' },
                '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
                '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' }
              }
            }}
          >
            {error}
          </Alert>
        </Snackbar>
        
        <Snackbar 
          open={success} 
          autoHideDuration={3000} 
          onClose={handleAlertClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            severity="success" 
            variant="filled"
            onClose={handleAlertClose}
          >
            Profile updated successfully!
          </Alert>
        </Snackbar>
        
        <Container maxWidth="md">
          {/* Profile Section */}
          {!editMode && (
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <Paper 
                elevation={3}
                sx={{
                  borderRadius: 4,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6
                  }
                }}
              >
                <Box 
                  sx={{ 
                    bgcolor: 'primary.main', 
                    color: 'white', 
                    py: 2, 
                    px: 3 
                  }}
                >
                  <Typography variant="h5" component="h1" fontWeight="bold">
                    Your Profile
                  </Typography>
                </Box>
                
                <CardContent sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible">
                        <Typography variant="subtitle2" color="text.secondary">Username</Typography>
                        <Typography variant="body1" gutterBottom>{profile?.username}</Typography>
                      </motion.div>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible">
                        <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                        <Typography variant="body1" gutterBottom>{profile?.email}</Typography>
                      </motion.div>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible">
                        <Typography variant="subtitle2" color="text.secondary">Role</Typography>
                        <Typography variant="body1" gutterBottom>
                          {profile?.role?.charAt(0).toUpperCase() + profile?.role?.slice(1)}
                        </Typography>
                      </motion.div>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="visible">
                        <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
                        <Typography variant="body1" gutterBottom>{profile?.phone || 'Not provided'}</Typography>
                      </motion.div>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <motion.div custom={4} variants={fieldVariants} initial="hidden" animate="visible">
                        <Typography variant="subtitle2" color="text.secondary">Address</Typography>
                        <Typography variant="body1" gutterBottom>{profile?.address || 'Not provided'}</Typography>
                      </motion.div>
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <motion.div custom={5} variants={fieldVariants} initial="hidden" animate="visible">
                        <Typography variant="subtitle2" color="text.secondary">City</Typography>
                        <Typography variant="body1" gutterBottom>{profile?.city || 'Not provided'}</Typography>
                      </motion.div>
                    </Grid>
                    
                    <Grid item xs={6} sm={4}>
                      <motion.div custom={6} variants={fieldVariants} initial="hidden" animate="visible">
                        <Typography variant="subtitle2" color="text.secondary">State</Typography>
                        <Typography variant="body1" gutterBottom>{profile?.state || 'Not provided'}</Typography>
                      </motion.div>
                    </Grid>
                    
                    <Grid item xs={6} sm={4}>
                      <motion.div custom={7} variants={fieldVariants} initial="hidden" animate="visible">
                        <Typography variant="subtitle2" color="text.secondary">Postal Code</Typography>
                        <Typography variant="body1" gutterBottom>{profile?.postal_code || 'Not provided'}</Typography>
                      </motion.div>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <motion.div custom={8} variants={fieldVariants} initial="hidden" animate="visible">
                        <Typography variant="subtitle2" color="text.secondary">Country</Typography>
                        <Typography variant="body1" gutterBottom>{profile?.country || 'Not provided'}</Typography>
                      </motion.div>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <motion.div custom={9} variants={fieldVariants} initial="hidden" animate="visible">
                        <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                        <Chip 
                          label={profile?.is_active ? 'Active' : 'Inactive'} 
                          color={profile?.is_active ? 'success' : 'error'} 
                          size="small" 
                          sx={{ mt: 0.5 }}
                        />
                      </motion.div>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <motion.div custom={10} variants={fieldVariants} initial="hidden" animate="visible">
                        <Typography variant="subtitle2" color="text.secondary">Account Created</Typography>
                        <Typography variant="body1" gutterBottom>
                          {new Date(profile?.created_at).toLocaleDateString()}
                        </Typography>
                      </motion.div>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <motion.div custom={11} variants={fieldVariants} initial="hidden" animate="visible">
                        <Typography variant="subtitle2" color="text.secondary">Last Updated</Typography>
                        <Typography variant="body1" gutterBottom>
                          {new Date(profile?.updated_at).toLocaleDateString()}
                        </Typography>
                      </motion.div>
                    </Grid>
                    
                    <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                      <motion.div variants={buttonVariants} initial="initial" whileHover="hover">
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<EditIcon />}
                          size="large"
                          onClick={handleToggleEditMode}
                          sx={{ 
                            borderRadius: 2,
                            px: 4,
                            py: 1,
                            fontWeight: 'bold'
                          }}
                        >
                          Edit Profile
                        </Button>
                      </motion.div>
                    </Grid>
                  </Grid>
                </CardContent>
              </Paper>
            </motion.div>
          )}
          
          {/* Edit Form */}
          {editMode && (
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <Paper 
                elevation={3}
                sx={{
                  borderRadius: 4,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                }}
              >
                <Box 
                  sx={{ 
                    bgcolor: 'secondary.main', 
                    color: 'white', 
                    py: 2, 
                    px: 3 
                  }}
                >
                  <Typography variant="h5" component="h1" fontWeight="bold">
                    Edit Your Profile
                  </Typography>
                </Box>
                
                <CardContent sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible">
                        <TextField
                          label="Username"
                          name="username"
                          value={formData.username || ''}
                          onChange={handleInputChange}
                          fullWidth
                          required
                          error={!formData.username?.trim()}
                          helperText={!formData.username?.trim() ? "Username is required" : ""}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '&.Mui-focused fieldset': {
                                borderColor: 'primary.main',
                                boxShadow: '0 0 0 3px rgba(255, 107, 53, 0.2)',
                              },
                              borderRadius: 2
                            },
                            '& .MuiOutlinedInput-input': {
                              borderRadius: 2,
                              transition: 'all 0.3s ease',
                            }
                          }}
                        />
                      </motion.div>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible">
                        <TextField
                          label="Email"
                          name="email"
                          type="email"
                          value={formData.email || ''}
                          onChange={handleInputChange}
                          fullWidth
                          required
                          error={!formData.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email || '')}
                          helperText={!formData.email?.trim() ? "Email is required" : 
                                      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email || '') ? "Invalid email format" : ""}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '&.Mui-focused fieldset': {
                                borderColor: 'primary.main',
                                boxShadow: '0 0 0 3px rgba(255, 107, 53, 0.2)',
                              },
                              borderRadius: 2
                            }
                          }}
                        />
                      </motion.div>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible">
                        <TextField
                          label="Phone"
                          name="phone"
                          value={formData.phone || ''}
                          onChange={handleInputChange}
                          fullWidth
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '&.Mui-focused fieldset': {
                                borderColor: 'primary.main',
                                boxShadow: '0 0 0 3px rgba(255, 107, 53, 0.2)',
                              },
                              borderRadius: 2
                            }
                          }}
                        />
                      </motion.div>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="visible">
                        <TextField
                          label="Address"
                          name="address"
                          value={formData.address || ''}
                          onChange={handleInputChange}
                          fullWidth
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '&.Mui-focused fieldset': {
                                borderColor: 'primary.main',
                                boxShadow: '0 0 0 3px rgba(255, 107, 53, 0.2)',
                              },
                              borderRadius: 2
                            }
                          }}
                        />
                      </motion.div>
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <motion.div custom={4} variants={fieldVariants} initial="hidden" animate="visible">
                        <TextField
                          label="City"
                          name="city"
                          value={formData.city || ''}
                          onChange={handleInputChange}
                          fullWidth
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '&.Mui-focused fieldset': {
                                borderColor: 'primary.main',
                                boxShadow: '0 0 0 3px rgba(255, 107, 53, 0.2)',
                              },
                              borderRadius: 2
                            }
                          }}
                        />
                      </motion.div>
                    </Grid>
                    
                    <Grid item xs={6} sm={4}>
                      <motion.div custom={5} variants={fieldVariants} initial="hidden" animate="visible">
                        <TextField
                          label="State"
                          name="state"
                          value={formData.state || ''}
                          onChange={handleInputChange}
                          fullWidth
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '&.Mui-focused fieldset': {
                                borderColor: 'primary.main',
                                boxShadow: '0 0 0 3px rgba(255, 107, 53, 0.2)',
                              },
                              borderRadius: 2
                            }
                          }}
                        />
                      </motion.div>
                    </Grid>
                    
                    <Grid item xs={6} sm={4}>
                      <motion.div custom={6} variants={fieldVariants} initial="hidden" animate="visible">
                        <TextField
                          label="Postal Code"
                          name="postal_code"
                          value={formData.postal_code || ''}
                          onChange={handleInputChange}
                          fullWidth
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '&.Mui-focused fieldset': {
                                borderColor: 'primary.main',
                                boxShadow: '0 0 0 3px rgba(255, 107, 53, 0.2)',
                              },
                              borderRadius: 2
                            }
                          }}
                        />
                      </motion.div>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <motion.div custom={7} variants={fieldVariants} initial="hidden" animate="visible">
                        <TextField
                          label="Country"
                          name="country"
                          value={formData.country || ''}
                          onChange={handleInputChange}
                          fullWidth
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '&.Mui-focused fieldset': {
                                borderColor: 'primary.main',
                                boxShadow: '0 0 0 3px rgba(255, 107, 53, 0.2)',
                              },
                              borderRadius: 2
                            }
                          }}
                        />
                      </motion.div>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <motion.div custom={8} variants={fieldVariants} initial="hidden" animate="visible">
                        <Box sx={{ mb: 1 }}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Location Coordinates (Optional)
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            You can enter coordinates manually or auto-detect your current location.
                          </Typography>
                        </Box>
                        
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} sm={5}>
                            <TextField
                              label="Latitude"
                              name="latitude"
                              value={formData.latitude || ''}
                              onChange={handleInputChange}
                              fullWidth
                              type="number"
                              inputProps={{ step: "0.000001" }}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  '&.Mui-focused fieldset': {
                                    borderColor: 'primary.main',
                                    boxShadow: '0 0 0 3px rgba(255, 107, 53, 0.2)',
                                  },
                                  borderRadius: 2
                                }
                              }}
                            />
                          </Grid>
                          
                          <Grid item xs={12} sm={5}>
                            <TextField
                              label="Longitude"
                              name="longitude"
                              value={formData.longitude || ''}
                              onChange={handleInputChange}
                              fullWidth
                              type="number"
                              inputProps={{ step: "0.000001" }}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  '&.Mui-focused fieldset': {
                                    borderColor: 'primary.main',
                                    boxShadow: '0 0 0 3px rgba(255, 107, 53, 0.2)',
                                  },
                                  borderRadius: 2
                                }
                              }}
                            />
                          </Grid>
                          
                          <Grid item xs={12} sm={2}>
                            <Button
                              variant="outlined"
                              startIcon={<MyLocationIcon />}
                              onClick={handleDetectLocation}
                              fullWidth
                              sx={{ 
                                height: '56px', 
                                borderRadius: 2,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  backgroundColor: 'rgba(255, 107, 53, 0.1)',
                                }
                              }}
                            >
                              Detect
                            </Button>
                          </Grid>
                        </Grid>
                      </motion.div>
                    </Grid>
                    
                    <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
                      <motion.div variants={buttonVariants} initial="initial" whileHover="hover">
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<CancelIcon />}
                          size="large"
                          onClick={handleToggleEditMode}
                          sx={{ 
                            borderRadius: 2,
                            px: 3,
                            py: 1
                          }}
                        >
                          Cancel
                        </Button>
                      </motion.div>
                      
                      <motion.div variants={buttonVariants} initial="initial" whileHover="hover">
                        <Button
                          variant="contained"
                          color="success"
                          startIcon={<SaveIcon />}
                          size="large"
                          onClick={handleSaveProfile}
                          disabled={submitting}
                          sx={{ 
                            borderRadius: 2,
                            px: 3,
                            py: 1,
                            fontWeight: 'bold'
                          }}
                        >
                          {submitting ? (
                            <>
                              <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                              Saving...
                            </>
                          ) : (
                            'Save Changes'
                          )}
                        </Button>
                      </motion.div>
                    </Grid>
                  </Grid>
                </CardContent>
              </Paper>
            </motion.div>
          )}
        </Container>
      </Box>
      
      {/* Footer */}
      <Box
        component="footer"
        sx={{
          mt: 'auto',
          py: 3,
          bgcolor: 'grey.900',
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Container>
          <Typography variant="body2">
            &copy; {new Date().getFullYear()} FoodShare. All rights reserved.
          </Typography>
          <Typography 
            variant="body2" 
            component="a"
            href="/"
            sx={{
              color: 'white',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
                transition: 'all 0.3s'
              }
            }}
          >
            Back to Home
          </Typography>
        </Container>
      </Box>
      
      {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutDialogOpen}
        onClose={handleCloseLogoutDialog}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: 3,
            px: 1
          }
        }}
      >
        <DialogTitle id="logout-dialog-title">
          Confirm Logout
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="logout-dialog-description">
            Are you sure you want to log out of your account?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ pb: 2, px: 3 }}>
          <Button onClick={handleCloseLogoutDialog} color="primary" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleLogout} color="error" variant="contained" autoFocus>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfilePage;
