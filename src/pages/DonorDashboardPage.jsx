import { useState, useEffect } from 'react';
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
  Badge
} from '@mui/material';
import { 
  MenuOpen as MenuOpenIcon,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  LocalShipping as DeliveryIcon,
  BarChart as BarChartIcon,
  EmojiEvents as RewardsIcon,
  AccountCircle as ProfileIcon,
  ExitToApp as LogoutIcon,
  AddCircle as AddCircleIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import DonationForm from '../components/donor/DonationForm';
import DonationsList from '../components/donor/DonationsList';
import ImpactMetrics from '../components/donor/ImpactMetrics';
import Rewards from '../components/donor/Rewards';
import { mockDonations, mockRewards, mockDonorImpact } from '../mocks/mockData';

// Helper function for delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Reduced timeout for faster mock API responses
const MOCK_DELAY = 300; // same as in handlers.js

// Define drawer width for sidebar
const drawerWidth = 240;

const DonorDashboardPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));  // State variables
  const [open, setOpen] = useState(!isMobile);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('donations');
  const [donations, setDonations] = useState([]);
  const [rewardsData, setRewardsData] = useState(null);
  const [impactData, setImpactData] = useState(null);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  
  // Mock user ID for now - this would come from auth context in a real app
  const donorId = '550e8400-e29b-41d4-a716-446655440000';
    useEffect(() => {
    // Fetch all necessary data for the dashboard
    const fetchDashboardData = async () => {
      setLoading(true);
      
      try {
        // Get user data from localStorage
        const { authService } = await import('../utils/authUtils');
        const currentUser = authService.getCurrentUser();
        setUserData(currentUser);
        
        // Use mock data for all components
        console.log('Using mock data for donor dashboard');
        
        // Filter mock donations for this donor
        let donationsData = mockDonations.filter(donation => 
          donation.donor_id === donorId
        );
        
        // Add isBackupData flag to indicate using mock data
        donationsData = donationsData.map(donation => ({
          ...donation,
          isBackupData: true
        }));
        
        // Set mock rewards data with isBackupData flag
        const rewardsData = {
          ...mockRewards,
          isBackupData: true
        };
        
        // Set mock impact data with isBackupData flag
        const impactData = {
          ...mockDonorImpact,
          donor_id: donorId,
          isBackupData: true
        };
        
        // Update state with mock data
        setDonations(donationsData || []);  // Ensure donations is always an array
        setRewardsData(rewardsData);
        setImpactData(impactData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
        // Initialize with empty values
        setDonations([]);
        setRewardsData({
          points: 0,
          level: 'Bronze',
          rewards_available: [],
          rewards_redeemed: []
        });
        setImpactData({
          donor_id: donorId,
          total_donations: 0,
          total_meals_provided: 0,
          total_kg_saved: 0,
          impact_by_month: []
        });
      } finally {
        // Turn off loading state
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // Handle drawer open/close
  const toggleDrawer = () => {
    setOpen(!open);
  };
  
  // Function to add a new donation
  const handleAddDonation = async (newDonation) => {
    console.log('Using mock data for adding donation');
    
    // Create a new mock donation
    const newMockDonation = {
      ...newDonation,
      donation_id: `donation-${Date.now()}`, // Generate a unique ID
      donor_id: donorId,
      status: 'available',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      isBackupData: true
    };
    
    // Add the new donation to the state - ensure donations is an array
    const currentDonations = Array.isArray(donations) ? donations : [];
    setDonations([newMockDonation, ...currentDonations]);
    
    // Simulate API delay
    await delay(MOCK_DELAY);
    
    return { success: true, data: newMockDonation };
  };
  
  // Function to update donation
  const handleUpdateDonation = async (donationId, updatedData) => {
    console.log('Using mock data for updating donation');
    
    // Check if donations is not an array or if donation doesn't exist
    if (!Array.isArray(donations)) {
      return { success: false, error: 'Donations data is not available' };
    }
    
    const donationIndex = donations.findIndex(donation => donation.donation_id === donationId);
    
    if (donationIndex === -1) {
      return { success: false, error: 'Donation not found' };
    }
    
    // Create updated donation
    const updatedDonation = {
      ...donations[donationIndex],
      ...updatedData,
      updated_at: new Date().toISOString()
    };
    
    // Update donation in state
    const updatedDonations = [...donations];
    updatedDonations[donationIndex] = updatedDonation;
    setDonations(updatedDonations);
    
    // Simulate API delay
    await delay(MOCK_DELAY);
    
    return { success: true, data: updatedDonation };
  };
  
  // Function to delete donation
  const handleDeleteDonation = async (donationId) => {
    console.log('Using mock data for deleting donation');
    
    // Check if donations is an array and if donation exists
    if (!Array.isArray(donations)) {
      return { success: false, error: 'Donations data is not available' };
    }
    
    const donationExists = donations.some(donation => donation.donation_id === donationId);
    
    if (!donationExists) {
      return { success: false, error: 'Donation not found' };
    }
    
    // Remove donation from state
    setDonations(donations.filter(donation => donation.donation_id !== donationId));
    
    // Simulate API delay
    await delay(MOCK_DELAY);
    
    return { success: true };
  };
  
  // Function to redeem a reward
  const handleRedeemReward = async (rewardId) => {
    console.log('Using mock data for redeeming reward');
    
    // Find the reward to redeem
    const availableReward = rewardsData.rewards_available.find(reward => 
      reward.reward_id === rewardId
    );
    
    if (!availableReward) {
      return { success: false, error: 'Reward not found' };
    }
    
    // Check if user has enough points
    if (rewardsData.points < availableReward.points_required) {
      return { success: false, error: 'Not enough points to redeem this reward' };
    }
    
    // Create redeemed reward
    const redeemedReward = {
      ...availableReward,
      redeemed_at: new Date().toISOString()
    };
    
    // Update rewards data
    const updatedRewardsData = {
      ...rewardsData,
      points: rewardsData.points - availableReward.points_required,
      rewards_available: rewardsData.rewards_available.filter(reward => 
        reward.reward_id !== rewardId
      ),
      rewards_redeemed: [...rewardsData.rewards_redeemed, redeemedReward]
    };
    
    // Update state
    setRewardsData(updatedRewardsData);
    
    // Simulate API delay
    await delay(MOCK_DELAY);
    
    return { 
      success: true, 
      data: {
        points_remaining: updatedRewardsData.points
      }
    };
  };
  
  // Render loading state
  if (loading) {
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
        }}
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
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Donor Dashboard
          </Typography>
          <IconButton color="inherit" aria-label="notifications">
            <Badge badgeContent={2} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>          <IconButton color="inherit" aria-label="profile" edge="end">
            <Avatar sx={{ bgcolor: theme.palette.secondary.main, width: 32, height: 32 }}>
              {userData?.name ? userData.name.charAt(0) : 'U'}
            </Avatar>
          </IconButton>
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
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, mt: 1 }}>            <Avatar 
              sx={{ 
                width: 64, 
                height: 64,
                bgcolor: theme.palette.primary.main,
                boxShadow: 2
              }}
            >
              {userData?.name ? userData.name.charAt(0) : 'U'}
            </Avatar>
            <Box sx={{ ml: 2 }}>
              <Typography variant="h6" noWrap>
                {userData?.name || 'User'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {rewardsData?.level} Member
              </Typography>
            </Box>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <List>
            <ListItemButton 
              selected={activeSection === 'dashboard'} 
              onClick={() => setActiveSection('dashboard')}
              sx={{ borderRadius: 1, mb: 1 }}
            >
              <ListItemIcon>
                <DashboardIcon color={activeSection === 'dashboard' ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
            
            <ListItemButton 
              selected={activeSection === 'donations'} 
              onClick={() => setActiveSection('donations')}
              sx={{ borderRadius: 1, mb: 1 }}
            >
              <ListItemIcon>
                <DeliveryIcon color={activeSection === 'donations' ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText primary="My Donations" />
            </ListItemButton>
            
            <ListItemButton 
              selected={activeSection === 'impact'} 
              onClick={() => setActiveSection('impact')}
              sx={{ borderRadius: 1, mb: 1 }}
            >
              <ListItemIcon>
                <BarChartIcon color={activeSection === 'impact' ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText primary="Impact" />
            </ListItemButton>
            
            <ListItemButton 
              selected={activeSection === 'rewards'} 
              onClick={() => setActiveSection('rewards')}
              sx={{ borderRadius: 1, mb: 1 }}
            >
              <ListItemIcon>
                <RewardsIcon color={activeSection === 'rewards' ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText primary="Rewards" />
            </ListItemButton>
          </List>
          
          <Divider sx={{ my: 2 }} />
          
          <List>
            <ListItemButton 
              onClick={() => navigate('/profile')}
              sx={{ borderRadius: 1, mb: 1 }}
            >
              <ListItemIcon>
                <ProfileIcon />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItemButton>
              <ListItemButton 
              onClick={async () => {
                try {
                  // Import auth service and call logout method
                  const { authService } = await import('../utils/authUtils');
                  await authService.logout();
                  navigate('/');
                } catch (error) {
                  console.error('Logout error:', error);
                  navigate('/');
                }
              }}
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
        <Container maxWidth="lg">
          {/* Dashboard Content */}
          <Box component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {activeSection === 'dashboard' && (
              <Grid container spacing={3}>                <Grid size={12}>
                  <Typography variant="h4" component="h1" gutterBottom>
                    Welcome back, {userData?.name ? userData.name.split(' ')[0] : 'User'}!
                  </Typography>
                </Grid>
                
                {/* Quick summary cards */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Paper 
                    elevation={2} 
                    sx={{ 
                      p: 3, 
                      height: '100%',
                      borderRadius: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      bgcolor: 'primary.light',
                      color: 'white'
                    }}
                  >
                    <Typography variant="h6" gutterBottom>Total Donations</Typography>
                    <Typography variant="h3" component="div" sx={{ mt: 'auto', fontWeight: 'bold' }}>
                      {impactData?.total_donations || 0}
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid size={{ xs: 12, md: 4 }}>
                  <Paper 
                    elevation={2} 
                    sx={{ 
                      p: 3, 
                      height: '100%',
                      borderRadius: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      bgcolor: 'secondary.light',
                      color: 'white'
                    }}
                  >
                    <Typography variant="h6" gutterBottom>Meals Provided</Typography>
                    <Typography variant="h3" component="div" sx={{ mt: 'auto', fontWeight: 'bold' }}>
                      {impactData?.total_meals_provided || 0}
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid size={{ xs: 12, md: 4 }}>
                  <Paper 
                    elevation={2} 
                    sx={{ 
                      p: 3, 
                      height: '100%',
                      borderRadius: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      bgcolor: 'success.light',
                      color: 'white'
                    }}
                  >
                    <Typography variant="h6" gutterBottom>Reward Points</Typography>
                    <Typography variant="h3" component="div" sx={{ mt: 'auto', fontWeight: 'bold' }}>
                      {rewardsData?.points || 0}
                    </Typography>
                  </Paper>
                </Grid>
                
                {/* Recent donations section */}
                <Grid size={12}>
                  <Paper 
                    elevation={2} 
                    sx={{ 
                      p: 3, 
                      mt: 3,
                      borderRadius: 3,
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h5" component="h2">
                        Recent Donations
                      </Typography>
                      <IconButton 
                        color="primary" 
                        aria-label="add donation"
                        onClick={() => setActiveSection('donations')}
                      >
                        <AddCircleIcon />
                      </IconButton>
                    </Box>
                      <DonationsList 
                      donations={Array.isArray(donations) ? donations.slice(0, 3) : []} 
                      onUpdate={handleUpdateDonation}
                      onDelete={handleDeleteDonation}
                    />
                  </Paper>
                </Grid>
              </Grid>
            )}
            
            {activeSection === 'donations' && (
              <Grid container spacing={3}>
                <Grid size={12}>
                  <Typography variant="h4" component="h1" gutterBottom>
                    My Donations
                  </Typography>
                </Grid>
                
                {/* Donation form */}
                <Grid size={12}>
                  <Paper 
                    elevation={2} 
                    sx={{ 
                      p: 3, 
                      borderRadius: 3,
                    }}
                  >
                    <Typography variant="h5" component="h2" gutterBottom>
                      Create New Donation
                    </Typography>
                    <DonationForm onSubmit={handleAddDonation} />
                  </Paper>
                </Grid>
                
                {/* Donations list */}
                <Grid size={12}>
                  <Paper 
                    elevation={2} 
                    sx={{ 
                      p: 3, 
                      borderRadius: 3,
                      mt: 3,
                    }}
                  >
                    <Typography variant="h5" component="h2" gutterBottom>
                      Donation History
                    </Typography>                    <DonationsList 
                      donations={Array.isArray(donations) ? donations : []} 
                      onUpdate={handleUpdateDonation}
                      onDelete={handleDeleteDonation}
                    />
                  </Paper>
                </Grid>
              </Grid>
            )}
            
            {activeSection === 'impact' && (
              <Grid container spacing={3}>
                <Grid size={12}>
                  <Typography variant="h4" component="h1" gutterBottom>
                    Your Impact
                  </Typography>
                </Grid>
                
                <Grid size={12}>
                  <ImpactMetrics data={impactData} />
                </Grid>
              </Grid>
            )}
            
            {activeSection === 'rewards' && (
              <Grid container spacing={3}>
                <Grid size={12}>
                  <Typography variant="h4" component="h1" gutterBottom>
                    Rewards Program
                  </Typography>
                </Grid>
                
                <Grid size={12}>
                  <Rewards data={rewardsData} onRedeem={handleRedeemReward} />
                </Grid>
              </Grid>
            )}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default DonorDashboardPage;
