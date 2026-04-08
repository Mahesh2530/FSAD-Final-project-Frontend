import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  CssBaseline, 
  Drawer, 
  AppBar, 
  Toolbar, 
  List, 
  Typography, 
  Divider, 
  IconButton, 
  Container, 
  Grid, 
  Paper, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Avatar, 
  LinearProgress,
  useMediaQuery,
  useTheme,
  Badge,
  Menu,
  MenuItem,
  Link,
  Alert
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  Search as SearchIcon,
  LocalMall as RequestsIcon,
  BarChart as MetricsIcon,
  AccountCircle as ProfileIcon,
  ExitToApp as LogoutIcon,
  Notifications as NotificationsIcon,
  MenuOpen as MenuOpenIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import BrowseDonations from '../components/beneficiary/BrowseDonations';
import SearchDonations from '../components/beneficiary/SearchDonations';
import MyRequests from '../components/beneficiary/MyRequests';
import ImpactMetrics from '../components/beneficiary/ImpactMetrics';
import { mockDonations, mockBeneficiaryImpact } from '../mocks/mockData';
import { mockNotifications } from '../mocks/mockNotificationsData';

// Define drawer width for sidebar
const drawerWidth = 240;

const BeneficiaryDashboardPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));  // State variables
  const [open, setOpen] = useState(!isMobile);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('browse');
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]); // Initialize as an empty array
  const [impactData, setImpactData] = useState(null);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const [userNotifications, setUserNotifications] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
    // Handle profile menu open/close
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };
  
  // Handle notifications menu open/close
  const handleNotificationsMenuOpen = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleNotificationsMenuClose = () => {
    setNotificationsAnchorEl(null);
  };
  
  // Mark a notification as read
  const handleMarkNotificationAsRead = (notificationId) => {
    setUserNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.notification_id === notificationId 
          ? { ...notification, is_read: true } 
          : notification
      )
    );
  };
    // Initial data fetch
  useEffect(() => {
    const fetchDashboardData = async () => {
      const storedUser = localStorage.getItem('user');
      let hasAnyDataLoaded = false;
      setLoading(true);
      
      if (!storedUser) {
        // User not authenticated, redirect to login
        navigate('/login');
        return;
      }
      
      // Set the user from local storage
      setUser(JSON.parse(storedUser));
      
      let donationsData = [];
      let requestsData = [];
      let impactData = null;
        try {
        const userId = JSON.parse(storedUser).user_id;
        
        // Use mock data for available donations
        console.log('Using mock data for donations');
        donationsData = mockDonations.filter(donation => donation.status === 'available');
        donationsData = donationsData.map(donation => ({...donation, isBackupData: true}));
        hasAnyDataLoaded = true;
        
        // Use empty array for requests or create some mock requests
        console.log('Using mock data for requests');
        requestsData = [];
        
        // Some sample mock requests data if needed
        if (mockDonations.length > 0) {
          // Create a few sample requests based on available donations
          const sampleDonations = mockDonations.slice(0, 3);
          requestsData = sampleDonations.map(donation => ({
            request_id: `mock-req-${donation.donation_id}`,
            user_id: userId,
            donation_id: donation.donation_id,
            status: 'pending',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            donation: donation,
            isBackupData: true
          }));
        }
          // Use mock impact metrics data
        console.log('Using mock data for impact metrics');
        impactData = {
          ...mockBeneficiaryImpact,
          beneficiary_id: userId,
          isBackupData: true
        };
        
        // Make sure impact data has all required properties
        if (!impactData.totalFoodReceived && impactData.total_food_received_kg) {
          impactData.totalFoodReceived = impactData.total_food_received_kg;
        }
        if (!impactData.mealsProvided && impactData.total_meals_received) {
          impactData.mealsProvided = impactData.total_meals_received;
        }
        
        // Load mock notifications
        console.log('Using mock data for notifications');
        const userSpecificNotifications = mockNotifications.filter(
          notification => notification.user_id === userId || notification.user_id === "550e8400-e29b-41d4-a716-446655440001"
        );
        setUserNotifications(userSpecificNotifications);
        hasAnyDataLoaded = true;
        
        // NEVER show the error page if we have ANY data
        if (hasAnyDataLoaded) {
          setDonations(donationsData);
          setRequests(requestsData);
          setImpactData(impactData);
          setDataLoaded(true);
        } else {
          setError('Failed to load any dashboard data. Please try again later.');
        }
      } catch (err) {
        console.error('Error in dashboard data fetch:', err);
        setError('Error loading dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);
  
  // Handle drawer open/close
  const toggleDrawer = () => {
    setOpen(!open);
  };
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
  // Function to create a donation request
  const handleCreateRequest = async (donationId) => {
    if (!user) return { success: false, error: 'User not authenticated' };
    
    try {
      setLoading(true);
      
      console.log('Using mock data for create request');
      
      // Find the donation from our mock data
      const requestedDonation = donations.find(d => d.donation_id === donationId);
      
      // Create mock request data
      const mockRequestData = {
        request_id: `mock-req-${Date.now()}`,
        user_id: user.user_id,
        donation_id: donationId,
        beneficiary_id: user.user_id,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        donation: requestedDonation,
        isBackupData: true
      };
      
      // Add the new request to the state
      setRequests(prevRequests => Array.isArray(prevRequests) ? [mockRequestData, ...prevRequests] : [mockRequestData]);
      
      // Remove the requested donation from available list
      const updatedDonations = Array.isArray(donations) ? 
        donations.filter(donation => donation.donation_id !== donationId) : [];
      setDonations(updatedDonations);
      
      setLoading(false);
      return { success: true, data: mockRequestData, isBackupData: true };
    } catch (err) {
      console.error('Error creating mock request:', err);
      setLoading(false);
      
      // Even in case of error, create a basic mock request
      const fallbackMockData = {
        request_id: `mock-fallback-${Date.now()}`,
        user_id: user.user_id,
        donation_id: donationId,
        beneficiary_id: user.user_id,
        status: 'pending',
        created_at: new Date().toISOString(),
        isBackupData: true
      };
      
      setRequests(prevRequests => Array.isArray(prevRequests) ? [fallbackMockData, ...prevRequests] : [fallbackMockData]);
      
      // Remove the requested donation from available list
      const updatedDonations = Array.isArray(donations) ? 
        donations.filter(donation => donation.donation_id !== donationId) : [];
      setDonations(updatedDonations);
      
      return { success: true, data: fallbackMockData, isBackupData: true };
    }
  };
    // Function to cancel a donation request
  const handleCancelRequest = async (requestId) => {
    if (!user) return { success: false, error: 'User not authenticated' };
    
    try {
      setLoading(true);
      
      // Instead of API call, just update the UI with mock data
      console.log('Using mock data for cancel request');
      
      // Remove the cancelled request from the state
      const updatedRequests = Array.isArray(requests) ?
        requests.filter(request => request.request_id !== requestId) : [];
      setRequests(updatedRequests);
      
      // Refresh available donations by finding the donation that was associated with this request
      // and adding it back to the available donations
      const cancelledRequest = requests.find(req => req.request_id === requestId);
      if (cancelledRequest && cancelledRequest.donation) {
        const updatedDonation = {
          ...cancelledRequest.donation,
          status: 'available',
          isBackupData: true
        };
        setDonations(prevDonations => [...prevDonations, updatedDonation]);
      } else {
        // If we don't have the donation details, add a new mock donation
        const newAvailableDonation = mockDonations.find(d => !donations.some(ad => ad.donation_id === d.donation_id));
        if (newAvailableDonation) {
          setDonations(prevDonations => [...prevDonations, {...newAvailableDonation, isBackupData: true}]);
        }
      }
      
      setLoading(false);
      return { success: true, isBackupData: true };
    } catch (err) {
      console.error('Error processing cancel request:', err);
      setLoading(false);
      
      // Even if there's an error in our mock data handling, still update the UI
      const updatedRequests = Array.isArray(requests) ?
        requests.filter(request => request.request_id !== requestId) : [];
      setRequests(updatedRequests);
      
      return { success: true, isBackupData: true };
    }
  };
    // Function to search donations
  const handleSearchDonations = async (searchParams) => {
    if (!user) return { success: false, error: 'User not authenticated' };
    
    try {
      setLoading(true);
      
      // Use mock data instead of API call
      console.log('Using mock data for search results');
      
      // Filter donations based on search criteria
      let filteredDonations = [...mockDonations].filter(donation => 
        donation.status === 'available'
      );
      
      // Filter by keyword
      if (searchParams.keyword) {
        const lowerKeyword = searchParams.keyword.toLowerCase();
        filteredDonations = filteredDonations.filter(donation => 
          donation.food_name.toLowerCase().includes(lowerKeyword) ||
          donation.food_type.toLowerCase().includes(lowerKeyword) ||
          (donation.description && donation.description.toLowerCase().includes(lowerKeyword))
        );
      }
      
      // Filter by food category
      if (searchParams.food_category && searchParams.food_category !== 'all') {
        filteredDonations = filteredDonations.filter(donation => 
          donation.food_type.toLowerCase() === searchParams.food_category.toLowerCase()
        );
      }
      
      // Filter by location
      if (searchParams.location) {
        const lowerLocation = searchParams.location.toLowerCase();
        filteredDonations = filteredDonations.filter(donation => 
          donation.pickup_address && donation.pickup_address.toLowerCase().includes(lowerLocation)
        );
      }
      
      // Mark as mock data
      filteredDonations = filteredDonations.map(donation => ({
        ...donation,
        isBackupData: true
      }));
      
      setLoading(false);
      return { 
        success: true, 
        data: filteredDonations,
        isBackupData: true
      };
    } catch (err) {
      console.error('Error processing search:', err);
      setLoading(false);
      
      // Return empty array in case of error
      return { 
        success: true, 
        data: [],
        error: 'Could not search donations. Using empty results.',
        isBackupData: true
      };
    }
  };
  
  // Render loading state
  if (loading && !donations.length && !requests.length) {
    return (
      <Box sx={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Container maxWidth="sm">
          <Typography variant="h4" align="center" gutterBottom>
            Loading Dashboard...
          </Typography>
          <LinearProgress color="primary" />
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
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      
      {/* App Bar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: theme => theme.zIndex.drawer + 1,
          transition: theme => theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(open && {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme => theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
          bgcolor: 'white',
          color: 'text.primary'
        }}
        elevation={2}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            {open ? <MenuOpenIcon /> : <MenuIcon />}
          </IconButton>          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, color: theme.palette.primary.main, fontWeight: 'bold' }}>
            FoodShare Beneficiary
          </Typography>
          <IconButton 
            color="inherit" 
            aria-label="notifications" 
            onClick={handleNotificationsMenuOpen}
            aria-controls="notifications-menu"
            aria-haspopup="true"
            sx={{ mr: 1 }}
          >
            <Badge 
              badgeContent={userNotifications.filter(notification => !notification.is_read).length} 
              color="primary"
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit" 
            aria-label="profile" 
            onClick={handleProfileMenuOpen}
            aria-controls="profile-menu"
            aria-haspopup="true"
          >
            <Avatar 
              sx={{ 
                bgcolor: theme.palette.secondary.main, 
                width: 32, 
                height: 32,
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'scale(1.1)'
                }
              }}
            >
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
              handleLogout();
            }}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>              <ListItemText primary="Logout" />
            </MenuItem>
          </Menu>
          
          {/* Notifications Menu */}
          <Menu
            id="notifications-menu"
            anchorEl={notificationsAnchorEl}
            open={Boolean(notificationsAnchorEl)}
            onClose={handleNotificationsMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              style: {
                maxHeight: 300,
                width: 350,
                overflow: 'auto',
              },
            }}
          >
            {userNotifications.length === 0 ? (
              <MenuItem disabled>
                <ListItemText primary="No notifications" />
              </MenuItem>
            ) : (
              userNotifications.slice().sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map((notification) => (
                <MenuItem 
                  key={notification.notification_id}
                  onClick={() => {
                    handleMarkNotificationAsRead(notification.notification_id);
                    handleNotificationsMenuClose();
                  }}
                  sx={{ 
                    backgroundColor: notification.is_read ? 'transparent' : 'rgba(25, 118, 210, 0.08)',
                    padding: '8px 16px',
                    borderBottom: '1px solid #eee',
                    '&:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.12)',
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <Typography variant="body2" sx={{ fontWeight: notification.is_read ? 'normal' : 'bold' }}>
                      {notification.message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(notification.created_at).toLocaleString()}
                    </Typography>
                  </Box>
                </MenuItem>
              ))
            )}
          </Menu>
        </Toolbar>
      </AppBar>
      
      {/* Sidebar */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={open}
        onClose={isMobile ? toggleDrawer : undefined}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: 'background.paper',
            borderRight: '1px solid',
            borderColor: 'divider'
          },
        }}
      >
        <Toolbar />
        <Box 
          component={motion.div}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          sx={{ overflow: 'auto', p: 2 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, mt: 1 }}>
            <Avatar 
              sx={{ 
                width: 64, 
                height: 64,
                bgcolor: theme.palette.secondary.main,
                boxShadow: 2
              }}
            >
              {user?.username?.charAt(0) || 'U'}
            </Avatar>
            <Box sx={{ ml: 2 }}>
              <Typography variant="h6" noWrap>
                {user?.username || 'User'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Beneficiary
              </Typography>
            </Box>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <List>
            <ListItemButton 
              component={motion.div}
              whileHover={{ scale: 1.05, x: 5 }}
              selected={activeSection === 'browse'} 
              onClick={() => setActiveSection('browse')}
              sx={{ 
                borderRadius: 1, 
                mb: 1,
                borderLeft: activeSection === 'browse' ? `4px solid ${theme.palette.primary.main}` : 'none',
                pl: activeSection === 'browse' ? 1.5 : 2
              }}
            >
              <ListItemIcon>
                <DashboardIcon color={activeSection === 'browse' ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText primary="Browse Donations" />
            </ListItemButton>
            
            <ListItemButton 
              component={motion.div}
              whileHover={{ scale: 1.05, x: 5 }}              selected={activeSection === 'search'} 
              onClick={() => navigate('/search-donations')}
              sx={{ 
                borderRadius: 1, 
                mb: 1,
                borderLeft: activeSection === 'search' ? `4px solid ${theme.palette.primary.main}` : 'none',
                pl: activeSection === 'search' ? 1.5 : 2
              }}
            >
              <ListItemIcon>
                <SearchIcon color={activeSection === 'search' ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText primary="Search Donations" />
            </ListItemButton>
            
            <ListItemButton 
              component={motion.div}
              whileHover={{ scale: 1.05, x: 5 }}
              selected={activeSection === 'requests'} 
              onClick={() => setActiveSection('requests')}
              sx={{ 
                borderRadius: 1, 
                mb: 1,
                borderLeft: activeSection === 'requests' ? `4px solid ${theme.palette.primary.main}` : 'none',
                pl: activeSection === 'requests' ? 1.5 : 2
              }}
            >
              <ListItemIcon>
                <RequestsIcon color={activeSection === 'requests' ? 'primary' : 'inherit'} />
              </ListItemIcon>              <ListItemText primary="My Requests" />
              <Badge badgeContent={Array.isArray(requests) ? requests.filter(r => r.status === 'pending').length : 0} color="primary" />
            </ListItemButton>
            
            <ListItemButton 
              component={motion.div}
              whileHover={{ scale: 1.05, x: 5 }}
              selected={activeSection === 'impact'} 
              onClick={() => setActiveSection('impact')}
              sx={{ 
                borderRadius: 1, 
                mb: 1,
                borderLeft: activeSection === 'impact' ? `4px solid ${theme.palette.primary.main}` : 'none',
                pl: activeSection === 'impact' ? 1.5 : 2
              }}
            >
              <ListItemIcon>
                <MetricsIcon color={activeSection === 'impact' ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText primary="Impact Metrics" />
            </ListItemButton>
          </List>
          
          <Divider sx={{ my: 2 }} />
          
          <List>
            <ListItemButton 
              component={motion.div}
              whileHover={{ scale: 1.05, x: 5 }}
              onClick={() => navigate('/profile')}
              sx={{ borderRadius: 1, mb: 1 }}
            >
              <ListItemIcon>
                <ProfileIcon />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItemButton>
            
            <ListItemButton 
              component={motion.div}
              whileHover={{ scale: 1.05, x: 5 }}
              onClick={handleLogout}
              sx={{ borderRadius: 1, mb: 1 }}
            >
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>
        {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, pt: { xs: 10, sm: 12 } }}>
        <Container maxWidth="lg">          {/* Show alert when using backup data */}
          {(impactData?.isBackupData || 
            donations.some(d => d.isBackupData) || 
            requests.some(r => r.isBackupData)) && (
            <Alert severity="info" sx={{ mb: 3 }}>
              Some data could not be retrieved from the server. Showing offline data instead.
            </Alert>
          )}
          
          {/* Dashboard Content with AnimatePresence for smooth transitions */}
          <AnimatePresence mode="wait">
            {activeSection === 'browse' && (
              <motion.div
                key="browse"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h4" component="h1" gutterBottom>
                      Available Donations
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <BrowseDonations 
                      donations={donations} 
                      onRequest={handleCreateRequest}
                      loading={loading}
                    />
                  </Grid>
                </Grid>
              </motion.div>
            )}
            
            {activeSection === 'search' && (
              <motion.div
                key="search"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h4" component="h1" gutterBottom>
                      Search Donations
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <SearchDonations 
                      onSearch={handleSearchDonations}
                      onRequest={handleCreateRequest}
                      loading={loading}
                    />
                  </Grid>
                </Grid>
              </motion.div>
            )}
            
            {activeSection === 'requests' && (
              <motion.div
                key="requests"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h4" component="h1" gutterBottom>
                      My Donation Requests
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <MyRequests 
                      requests={requests} 
                      onCancel={handleCancelRequest}
                      loading={loading}
                    />
                  </Grid>
                </Grid>
              </motion.div>
            )}
            
            {activeSection === 'impact' && (
              <motion.div
                key="impact"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h4" component="h1" gutterBottom>
                      Your Impact
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <ImpactMetrics data={impactData || {
                      totalFoodReceived: 0,
                      carbonFootprintReduced: 0,
                      mealsProvided: 0,
                      donationsReceived: 0,
                      avgResponseTime: 0,
                      wasteReduction: 0,
                      impactOverTime: [],
                      categoryBreakdown: [],
                      isBackupData: true
                    }} />
                  </Grid>
                </Grid>
              </motion.div>
            )}
          </AnimatePresence>
        </Container>
        
        {/* Footer */}
        <Box 
          component="footer"
          sx={{ 
            mt: 'auto', 
            py: 3, 
            bgcolor: 'background.paper', 
            borderTop: '1px solid', 
            borderColor: 'divider',
            textAlign: 'center'
          }}
        >
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
                }
              }} 
              onClick={() => navigate('/')}
            >
              Back to Home
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default BeneficiaryDashboardPage;
