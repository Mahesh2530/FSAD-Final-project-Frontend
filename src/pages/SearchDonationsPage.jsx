import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  CssBaseline, 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Container, 
  Grid, 
  Avatar, 
  Badge,
  Paper,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Breadcrumbs,
  Link
} from '@mui/material';
import { 
  MenuOpen as MenuOpenIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle as ProfileIcon,
  ExitToApp as LogoutIcon,
  NavigateNext as NavigateNextIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import SearchDonations from '../components/beneficiary/SearchDonations';
import axios from 'axios';

const SearchDonationsPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // State variables
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  
  // Handle profile menu open/close
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };
  
  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Redirect to login if not authenticated
      navigate('/login');
      return;
    }
  }, [navigate]);

  // Handle logout
  const handleLogout = async () => {
    try {
      // Import auth service and call logout method
      const { authService } = await import('../utils/authUtils');
      await authService.logout();
      // Navigate to home page
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if there's an error, still clear data and navigate away
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      navigate('/');
    }
  };
  
  // Function to search donations
  const handleSearchDonations = async (searchParams) => {
    if (!user) return { success: false, error: 'User not authenticated' };
    
    try {
      setLoading(true);
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      queryParams.append('user_id', user.user_id);
      
      if (searchParams.keyword) queryParams.append('keyword', searchParams.keyword);
      if (searchParams.food_category) queryParams.append('food_category', searchParams.food_category);
      if (searchParams.location) queryParams.append('location', searchParams.location);
      
      const response = await axios.get(`/api/v1/donations/search?${queryParams.toString()}`);
      
      setLoading(false);
      return { 
        success: true, 
        data: response.data.content || response.data 
      };
    } catch (err) {
      console.error('Error searching donations:', err);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };
  
  // Function to create a request
  const handleCreateRequest = async (donationId) => {
    if (!user) return { success: false, error: 'User not authenticated' };
    
    try {
      setLoading(true);
      
      const response = await axios.post('/api/v1/donation_requests', {
        user_id: user.user_id,
        donation_id: donationId,
        beneficiary_id: user.user_id
      });
        
      setLoading(false);
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Error creating request:', err);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Render loading state
  if (loading && !user) {
    return (
      <Box sx={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Container maxWidth="sm">
          <Typography variant="h4" align="center" gutterBottom>
            Loading...
          </Typography>
        </Container>
      </Box>
    );
  }

  // Render error state
  if (error) {
    return (
      <Box sx={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Container maxWidth="sm">
          <Typography variant="h4" align="center" color="error" gutterBottom>
            Error
          </Typography>
          <Typography variant="body1" align="center">
            {error}
          </Typography>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      
      {/* App Bar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: theme => theme.zIndex.drawer + 1,
          bgcolor: 'white',
          color: 'text.primary'
        }}
        elevation={2}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="go back"
            onClick={() => navigate(-1)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Search Donations
          </Typography>
          <IconButton color="inherit" aria-label="notifications" onClick={() => navigate('/notifications')}>
            <Badge badgeContent={2} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton 
            color="inherit" 
            aria-label="profile" 
            edge="end"
            onClick={handleProfileMenuOpen}
          >
            <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 32, height: 32 }}>
              {user?.username?.charAt(0) || 'U'}
            </Avatar>
          </IconButton>
          
          {/* Profile Menu */}
          <Menu
            id="profile-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={() => {
              handleProfileMenuClose();
              navigate('/profile');
            }}>
              <ListItemIcon>
                <ProfileIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </MenuItem>
            <MenuItem onClick={() => {
              handleProfileMenuClose();
              navigate('/beneficiary');
            }}>
              <ListItemIcon>
                <HomeIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </MenuItem>
            <MenuItem onClick={() => {
              handleProfileMenuClose();
              handleLogout();
            }}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      
      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, pt: { xs: 8, sm: 10 }, pb: 4, px: 2 }}>
        <Container maxWidth="lg">
          {/* Breadcrumbs */}
          <Breadcrumbs 
            separator={<NavigateNextIcon fontSize="small" />} 
            aria-label="breadcrumb"
            sx={{ mb: 3, mt: 2 }}
          >
            <Link 
              underline="hover" 
              color="inherit" 
              href="/beneficiary"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              Dashboard
            </Link>
            <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
              Search Donations
            </Typography>
          </Breadcrumbs>
          
          {/* Page Content */}
          <Box component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    mb: 4, 
                    bgcolor: 'transparent',
                    border: 'none'
                  }}
                >
                  <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Find Available Donations
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    Search for food donations by keyword, category, or location to find what you need.
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12}>
                <SearchDonations 
                  onSearch={handleSearchDonations} 
                  onRequest={handleCreateRequest}
                  loading={loading}
                />
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
      
      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: theme => theme.palette.grey[100],
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} FoodShare. All rights reserved.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <Link 
              sx={{ 
                color: 'primary.main', 
                textDecoration: 'none',
                transition: 'all 0.3s',
                '&:hover': { 
                  textDecoration: 'underline' 
                },
                cursor: 'pointer'
              }} 
              onClick={() => navigate('/')}
            >
              Back to Home
            </Link>
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default SearchDonationsPage;
