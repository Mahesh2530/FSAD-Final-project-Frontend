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
  Badge,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Tabs,
  Tab,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Chip,
  Alert
} from '@mui/material';
import { 
  Home as HomeIcon,
  MenuOpen as MenuOpenIcon,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Fastfood as DonationsIcon,
  Settings as SettingsIcon,
  AccountCircle as ProfileIcon,
  ExitToApp as LogoutIcon,
  Add as AddIcon,
  Notifications as NotificationsIcon,
  Check as ApproveIcon,
  Close as RejectIcon,
  SupervisorAccount as AdminIcon,
  Search as SearchIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  LocationOn as LocationIcon,
  Restaurant as FoodIcon,
  LocalShipping as DeliveryIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';
import { mockDonations, mockUsers, mockAdminAnalytics } from '../mocks/mockData';
import { API_BASE_URL } from '../config/apiConfig';

// Define drawer width for sidebar
const drawerWidth = 240;

const AdminDashboardPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // State variables
  const [open, setOpen] = useState(!isMobile);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [donors, setDonors] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [donationDialogOpen, setDonationDialogOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
    // Tabs state for user management
  const [userTabValue, setUserTabValue] = useState(0);
  
  // Mock admin ID for now - this would come from auth context in a real app
  const adminId = '5177eefb-ad3b-47f6-ab5d-32c2561f42c9';
  
  useEffect(() => {
    // Fetch all necessary data for the admin dashboard
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch users (which includes both donors and beneficiaries)
        const usersResponse = await axios.get(`${API_BASE_URL}/admin/users`);
        const users = usersResponse.data || [];
        
        // Separate users into donors and beneficiaries (case-insensitive comparison)
        const donorsList = users.filter(user => user.role?.toLowerCase() === 'donor');
        const beneficiariesList = users.filter(user => user.role?.toLowerCase() === 'beneficiary');
        
        // Fetch donations
        const donationsResponse = await axios.get(`${API_BASE_URL}/donations`);
        
        // Fetch analytics data
        const analyticsResponse = await axios.get(`${API_BASE_URL}/admin/analytics?userId=` + adminId);
        
        // Update state with fetched data
        setDonors(donorsList);
        setBeneficiaries(beneficiariesList);
        setDonations(donationsResponse.data || []);
        setStats(analyticsResponse.data);
        
      } catch (err) {
        console.error('Error fetching admin dashboard data:', err);
        setError('Failed to load admin dashboard data. Using mock data instead.');
        
        // Fallback to mock data if API fails
        console.log('Using mock data as fallback for admin dashboard');
        
        // Use mock users
        const mockUserList = mockUsers || [];
        const donorsList = mockUserList.filter(user => user.role?.toLowerCase() === 'donor');
        const beneficiariesList = mockUserList.filter(user => user.role?.toLowerCase() === 'beneficiary');
        
        setDonors(donorsList);
        setBeneficiaries(beneficiariesList);
        setDonations(mockDonations || []);
        setStats(mockAdminAnalytics);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [adminId]);
  
  // Handle drawer open/close
  const toggleDrawer = () => {
    setOpen(!open);
  };
  
  // Handle user tab change
  const handleUserTabChange = (event, newValue) => {
    setUserTabValue(newValue);
  };
  
  // Open user dialog for viewing/editing user details
  const handleOpenUserDialog = (user) => {
    setSelectedUser(user);
    setUserDialogOpen(true);
  };
  
  // Close user dialog
  const handleCloseUserDialog = () => {
    setUserDialogOpen(false);
    setSelectedUser(null);
  };
  
  // Open donation dialog for viewing/approving/rejecting donations
  const handleOpenDonationDialog = (donation) => {
    setSelectedDonation(donation);
    setDonationDialogOpen(true);
  };
  
  // Close donation dialog
  const handleCloseDonationDialog = () => {
    setDonationDialogOpen(false);
    setSelectedDonation(null);
  };
  
  // Handle search
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  
  // Handle status filter change
  const handleFilterChange = (event) => {
    setFilterStatus(event.target.value);
  };
  
  // Function to approve a donation
  const handleApproveDonation = async (donationId) => {
    try {
      await axios.put(`/api/v1/admin/donations/${donationId}/approve`);
        // Update donations in state
      setDonations(donations.map(donation => 
        donation.donation_id === donationId ? { ...donation, status: 'approved' } : donation
      ));
      
      handleCloseDonationDialog();
      return { success: true };
    } catch (err) {
      console.error('Error approving donation:', err);
      return { success: false, error: err.message };
    }
  };
  
  // Function to reject a donation
  const handleRejectDonation = async (donationId) => {
    try {
      await axios.put(`/api/v1/admin/donations/${donationId}/reject`);
        // Update donations in state
      setDonations(donations.map(donation => 
        donation.donation_id === donationId ? { ...donation, status: 'rejected' } : donation
      ));
      
      handleCloseDonationDialog();
      return { success: true };
    } catch (err) {
      console.error('Error rejecting donation:', err);
      return { success: false, error: err.message };
    }
  };
  
  // Function to activate/deactivate a user
  const handleToggleUserStatus = async (userId, isActive) => {
    try {
      const action = isActive ? 'deactivate' : 'activate';
      await axios.put(`/api/v1/admin/users/${userId}/${action}`);
        // Update both donors and beneficiaries
      const updateUserList = (list) => {
        return list.map(user => 
          user.user_id === userId ? { ...user, status: isActive ? 'inactive' : 'active' } : user
        );
      };
      
      setDonors(updateUserList(donors));
      setBeneficiaries(updateUserList(beneficiaries));
      
      handleCloseUserDialog();
      return { success: true };
    } catch (err) {
      console.error(`Error ${isActive ? 'deactivating' : 'activating'} user:`, err);
      return { success: false, error: err.message };
    }
  };
  
  // Open confirm dialog for critical actions
  const handleOpenConfirmDialog = (action, entityId) => {
    setConfirmAction({ action, entityId });
    setConfirmDialogOpen(true);
  };
  
  // Handle confirm dialog actions
  const handleConfirmAction = async () => {
    if (!confirmAction) return;
    
    try {
      const { action, entityId } = confirmAction;
      
      switch (action) {
        case 'approveDonation':
          await handleApproveDonation(entityId);
          break;
        case 'rejectDonation':
          await handleRejectDonation(entityId);
          break;
        case 'activateUser':
          await handleToggleUserStatus(entityId, false);
          break;
        case 'deactivateUser':
          await handleToggleUserStatus(entityId, true);
          break;
        default:
          break;
      }
      
    } catch (err) {
      console.error('Error performing action:', err);
    } finally {
      setConfirmDialogOpen(false);
      setConfirmAction(null);
    }
  };
    // Filter donations based on search term and status filter
  const filteredDonations = Array.isArray(donations) ? donations.filter(donation => {
    const matchesSearch = donation.food_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (donation.donor_name && donation.donor_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterStatus === 'all' || donation.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  }) : [];
    // Filter users based on search term and tab
  const filteredUsers = userTabValue === 0 
    ? (Array.isArray(donors) ? donors.filter(donor => donor.username.toLowerCase().includes(searchTerm.toLowerCase())) : [])
    : (Array.isArray(beneficiaries) ? beneficiaries.filter(beneficiary => beneficiary.username.toLowerCase().includes(searchTerm.toLowerCase())) : []);
  
  // Render loading state
  if (loading) {
    return (
      <Box sx={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Container maxWidth="sm">
          <Typography variant="h4" align="center" gutterBottom>
            Loading Admin Dashboard...
          </Typography>
          <LinearProgress color="primary" />
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
            Admin Dashboard
          </Typography>
          <IconButton color="inherit" aria-label="notifications">
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit" aria-label="profile" edge="end">
            <Avatar sx={{ bgcolor: theme.palette.secondary.main, width: 32, height: 32 }}>
              A
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
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, mt: 1 }}>
            <Avatar 
              sx={{ 
                width: 64, 
                height: 64,
                bgcolor: theme.palette.error.main,
                boxShadow: 2
              }}
            >
              <AdminIcon />
            </Avatar>
            <Box sx={{ ml: 2 }}>
              <Typography variant="h6" noWrap>
                Admin Panel
              </Typography>
              <Typography variant="body2" color="text.secondary">
                System Admin
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
              selected={activeSection === 'users'} 
              onClick={() => setActiveSection('users')}
              sx={{ borderRadius: 1, mb: 1 }}
            >
              <ListItemIcon>
                <PeopleIcon color={activeSection === 'users' ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText primary="User Management" />
            </ListItemButton>
            
            <ListItemButton 
              selected={activeSection === 'donations'} 
              onClick={() => setActiveSection('donations')}
              sx={{ borderRadius: 1, mb: 1 }}
            >
              <ListItemIcon>
                <DonationsIcon color={activeSection === 'donations' ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText primary="Donations" />
            </ListItemButton>
            
            <ListItemButton 
              selected={activeSection === 'requests'} 
              onClick={() => setActiveSection('requests')}
              sx={{ borderRadius: 1, mb: 1 }}
            >
              <ListItemIcon>
                <FoodIcon color={activeSection === 'requests' ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText primary="Requests" />
            </ListItemButton>
            
            <ListItemButton 
              selected={activeSection === 'settings'} 
              onClick={() => setActiveSection('settings')}
              sx={{ borderRadius: 1, mb: 1 }}
            >
              <ListItemIcon>
                <SettingsIcon color={activeSection === 'settings' ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText primary="Settings" />
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
          {/* Error Alert */}
          {error && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          {/* Dashboard Content */}
          <Box component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {activeSection === 'dashboard' && (
              <Grid container spacing={3}>
                <Grid size={12}>
                  <Typography variant="h4" component="h1" gutterBottom>
                    Platform Overview
                  </Typography>
                </Grid>
                
                {/* Stats cards */}
                <Grid size={{ xs: 12, md: 3 }}>
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
                    <Typography variant="h6" gutterBottom>Total Users</Typography>
                    <Typography variant="h3" component="div" sx={{ mt: 'auto', fontWeight: 'bold' }}>
                      {stats?.total_users || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {stats?.new_users_today || 0} new today
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid size={{ xs: 12, md: 3 }}>
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
                    <Typography variant="h6" gutterBottom>Total Donations</Typography>
                    <Typography variant="h3" component="div" sx={{ mt: 'auto', fontWeight: 'bold' }}>
                      {stats?.total_donations || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {stats?.new_donations_today || 0} new today
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid size={{ xs: 12, md: 3 }}>
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
                    <Typography variant="h6" gutterBottom>Food Donated (kg)</Typography>
                    <Typography variant="h3" component="div" sx={{ mt: 'auto', fontWeight: 'bold' }}>
                      {stats?.total_food_kg || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {stats?.food_kg_this_month || 0} this month
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid size={{ xs: 12, md: 3 }}>
                  <Paper 
                    elevation={2} 
                    sx={{ 
                      p: 3, 
                      height: '100%',
                      borderRadius: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      bgcolor: 'error.light',
                      color: 'white'
                    }}
                  >
                    <Typography variant="h6" gutterBottom>Pending Approvals</Typography>
                    <Typography variant="h3" component="div" sx={{ mt: 'auto', fontWeight: 'bold' }}>
                      {stats?.pending_approvals || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Needs attention
                    </Typography>
                  </Paper>
                </Grid>
                
                {/* Recent activity section */}
                <Grid size={{ xs: 12, md: 8 }}>
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
                        Recent Activity
                      </Typography>
                      <IconButton 
                        aria-label="refresh"
                        onClick={() => window.location.reload()}
                      >
                        <RefreshIcon />
                      </IconButton>
                    </Box>
                    
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Action</TableCell>
                            <TableCell>User</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Date</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {stats?.recent_activity?.slice(0, 5).map((activity, index) => (
                            <TableRow key={index}>
                              <TableCell>{activity.action}</TableCell>
                              <TableCell>{activity.user}</TableCell>
                              <TableCell>{activity.type}</TableCell>
                              <TableCell>
                                <Chip 
                                  label={activity.status} 
                                  color={
                                    activity.status === 'completed' ? 'success' : 
                                    activity.status === 'pending' ? 'warning' : 
                                    activity.status === 'rejected' ? 'error' : 'default'
                                  }
                                  size="small"
                                />
                              </TableCell>
                              <TableCell>{new Date(activity.timestamp).toLocaleString()}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Grid>
                
                {/* Quick actions card */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Paper 
                    elevation={2} 
                    sx={{ 
                      p: 3, 
                      mt: 3,
                      borderRadius: 3,
                    }}
                  >
                    <Typography variant="h5" component="h2" gutterBottom>
                      Quick Actions
                    </Typography>
                    
                    <List>
                      <ListItemButton onClick={() => setActiveSection('donations')}>
                        <ListItemIcon>
                          <ApproveIcon color="success" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Review Pending Donations" 
                          secondary={`${stats?.pending_donations || 0} donations waiting`}
                        />
                      </ListItemButton>
                      
                      <ListItemButton onClick={() => setActiveSection('users')}>
                        <ListItemIcon>
                          <PeopleIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Manage Users" 
                          secondary={`${stats?.total_users || 0} total users`}
                        />
                      </ListItemButton>
                      
                      <ListItemButton onClick={() => setActiveSection('requests')}>
                        <ListItemIcon>
                          <FoodIcon color="secondary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="View Food Requests" 
                          secondary={`${stats?.pending_requests || 0} pending requests`}
                        />
                      </ListItemButton>
                      
                      <ListItemButton onClick={() => setActiveSection('settings')}>
                        <ListItemIcon>
                          <SettingsIcon />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Platform Settings" 
                        />
                      </ListItemButton>
                    </List>
                  </Paper>
                </Grid>
              </Grid>
            )}
            
            {activeSection === 'users' && (
              <Grid container spacing={3}>
                <Grid size={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                      User Management
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <TextField
                        placeholder="Search users..."
                        size="small"
                        value={searchTerm}
                        onChange={handleSearch}
                        InputProps={{
                          startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                        }}
                      />
                      <Button
                        variant="contained"
                        startIcon={<RefreshIcon />}
                        onClick={() => window.location.reload()}
                      >
                        Refresh
                      </Button>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid size={12}>
                  <Paper sx={{ borderRadius: 3 }}>
                    <Tabs
                      value={userTabValue}
                      onChange={handleUserTabChange}
                      indicatorColor="primary"
                      textColor="primary"
                      variant="fullWidth"
                    >
                      <Tab label="Donors" />
                      <Tab label="Beneficiaries" />
                    </Tabs>
                    
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Join Date</TableCell>
                            <TableCell>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredUsers.map((user) => (
                            <TableRow key={user.user_id}>
                              <TableCell>{user.username}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>
                                <Chip                                  label={user.status === "active" ? "Active" : "Inactive"} 
                                  color={user.status === "active" ? "success" : "error"}
                                  size="small"
                                />
                              </TableCell>
                              <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <IconButton 
                                  size="small" 
                                  color="primary"
                                  onClick={() => handleOpenUserDialog(user)}
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton 
                                  size="small"                                  color={user.status === "active" ? "error" : "success"}
                                  onClick={() => handleOpenConfirmDialog(
                                    user.status === "active" ? 'deactivateUser' : 'activateUser',
                                    user.user_id
                                  )}
                                >
                                  {user.status === "active" ? <DeleteIcon /> : <ApproveIcon />}
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Grid>
              </Grid>
            )}
            
            {activeSection === 'donations' && (
              <Grid container spacing={3}>
                <Grid size={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                      Donations Management
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <TextField
                        placeholder="Search donations..."
                        size="small"
                        value={searchTerm}
                        onChange={handleSearch}
                        InputProps={{
                          startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                        }}
                      />
                      <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                          value={filterStatus}
                          label="Status"
                          onChange={handleFilterChange}
                        >
                          <MenuItem value="all">All Statuses</MenuItem>
                          <MenuItem value="pending">Pending</MenuItem>
                          <MenuItem value="approved">Approved</MenuItem>
                          <MenuItem value="rejected">Rejected</MenuItem>
                          <MenuItem value="fulfilled">Fulfilled</MenuItem>
                        </Select>
                      </FormControl>
                      <Button
                        variant="contained"
                        startIcon={<FilterIcon />}
                      >
                        Filter
                      </Button>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid size={12}>
                  <Paper sx={{ borderRadius: 3 }}>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Food Name</TableCell>
                            <TableCell>Donor</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Expiry Date</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>                          {filteredDonations.map((donation) => (
                            <TableRow key={donation.donation_id}>
                              <TableCell>{donation.food_name}</TableCell>
                              <TableCell>{donation.donor_id}</TableCell>
                              <TableCell>{donation.quantity} {donation.quantity_unit}</TableCell>
                              <TableCell>{new Date(donation.expiry_date).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <Chip 
                                  label={donation.status} 
                                  color={
                                    donation.status === 'available' ? 'success' : 
                                    donation.status === 'claimed' ? 'warning' : 
                                    donation.status === 'completed' ? 'info' : 'default'
                                  }
                                  size="small"
                                />
                              </TableCell>
                              <TableCell>
                                <IconButton 
                                  size="small" 
                                  color="primary"
                                  onClick={() => handleOpenDonationDialog(donation)}
                                >
                                  <EditIcon />
                                </IconButton>
                                {donation.status === 'pending' && (
                                  <>
                                    <IconButton 
                                      size="small" 
                                      color="success"
                                      onClick={() => handleOpenConfirmDialog('approveDonation', donation.donation_id)}
                                    >
                                      <ApproveIcon />
                                    </IconButton>
                                    <IconButton 
                                      size="small" 
                                      color="error"
                                      onClick={() => handleOpenConfirmDialog('rejectDonation', donation.donation_id)}
                                    >
                                      <RejectIcon />
                                    </IconButton>
                                  </>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Grid>
              </Grid>
            )}
            
            {activeSection === 'requests' && (
              <Grid container spacing={3}>
                <Grid size={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                      Food Requests
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <TextField
                        placeholder="Search requests..."
                        size="small"
                        value={searchTerm}
                        onChange={handleSearch}
                        InputProps={{
                          startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                        }}
                      />
                      <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                          value={filterStatus}
                          label="Status"
                          onChange={handleFilterChange}
                        >
                          <MenuItem value="all">All Statuses</MenuItem>
                          <MenuItem value="pending">Pending</MenuItem>
                          <MenuItem value="approved">Approved</MenuItem>
                          <MenuItem value="fulfilled">Fulfilled</MenuItem>
                          <MenuItem value="canceled">Canceled</MenuItem>
                        </Select>
                      </FormControl>
                      <Button
                        variant="contained"
                        startIcon={<FilterIcon />}
                      >
                        Filter
                      </Button>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid size={12}>
                  <Paper sx={{ borderRadius: 3 }}>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Beneficiary</TableCell>
                            <TableCell>Request Type</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Request Date</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {requests.map((request) => (
                            <TableRow key={request.id}>
                              <TableCell>{request.beneficiary_name}</TableCell>
                              <TableCell>{request.food_type}</TableCell>
                              <TableCell>{request.quantity_requested}</TableCell>
                              <TableCell>{new Date(request.request_date).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <Chip 
                                  label={request.status} 
                                  color={
                                    request.status === 'fulfilled' ? 'success' : 
                                    request.status === 'pending' ? 'warning' : 
                                    request.status === 'canceled' ? 'error' : 'default'
                                  }
                                  size="small"
                                />
                              </TableCell>
                              <TableCell>
                                <IconButton 
                                  size="small" 
                                  color="primary"
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton 
                                  size="small" 
                                  color="error"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Grid>
              </Grid>
            )}
            
            {activeSection === 'settings' && (
              <Grid container spacing={3}>
                <Grid size={12}>
                  <Typography variant="h4" component="h1" gutterBottom>
                    Platform Settings
                  </Typography>
                </Grid>
                
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper sx={{ p: 3, borderRadius: 3 }}>
                    <Typography variant="h5" component="h2" gutterBottom>
                      General Settings
                    </Typography>
                    
                    <Box sx={{ mt: 3 }}>
                      <TextField
                        fullWidth
                        label="Platform Name"
                        defaultValue="FoodShare"
                        margin="normal"
                      />
                      
                      <TextField
                        fullWidth
                        label="Admin Email"
                        defaultValue="admin@foodshare.org"
                        margin="normal"
                      />
                      
                      <TextField
                        fullWidth
                        label="Contact Phone"
                        defaultValue="+1 (555) 123-4567"
                        margin="normal"
                      />
                      
                      <FormControl fullWidth margin="normal">
                        <InputLabel>Default Language</InputLabel>
                        <Select
                          defaultValue="en"
                        >
                          <MenuItem value="en">English</MenuItem>
                          <MenuItem value="es">Spanish</MenuItem>
                          <MenuItem value="fr">French</MenuItem>
                        </Select>
                      </FormControl>
                      
                      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                          variant="contained"
                          color="primary"
                        >
                          Save Changes
                        </Button>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
                
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper sx={{ p: 3, borderRadius: 3 }}>
                    <Typography variant="h5" component="h2" gutterBottom>
                      Notification Settings
                    </Typography>
                    
                    <Box sx={{ mt: 3 }}>
                      <FormControl fullWidth margin="normal">
                        <InputLabel>Email Notifications</InputLabel>
                        <Select
                          defaultValue="all"
                        >
                          <MenuItem value="all">Send All</MenuItem>
                          <MenuItem value="important">Important Only</MenuItem>
                          <MenuItem value="none">None</MenuItem>
                        </Select>
                      </FormControl>
                      
                      <FormControl fullWidth margin="normal">
                        <InputLabel>SMS Notifications</InputLabel>
                        <Select
                          defaultValue="important"
                        >
                          <MenuItem value="all">Send All</MenuItem>
                          <MenuItem value="important">Important Only</MenuItem>
                          <MenuItem value="none">None</MenuItem>
                        </Select>
                      </FormControl>
                      
                      <TextField
                        fullWidth
                        label="Daily Report Email"
                        defaultValue="reports@foodshare.org"
                        margin="normal"
                      />
                      
                      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                          variant="contained"
                          color="primary"
                        >
                          Save Changes
                        </Button>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
                
                <Grid size={12}>
                  <Paper sx={{ p: 3, borderRadius: 3, mt: 3 }}>
                    <Typography variant="h5" component="h2" gutterBottom>
                      System Information
                    </Typography>
                    
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="subtitle1" gutterBottom>Platform Version</Typography>
                        <Typography variant="body1">v2.5.0</Typography>
                      </Grid>
                      
                      <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="subtitle1" gutterBottom>Last Updated</Typography>
                        <Typography variant="body1">May 5, 2025</Typography>
                      </Grid>
                      
                      <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="subtitle1" gutterBottom>Database Status</Typography>
                        <Chip label="Healthy" color="success" />
                      </Grid>
                      
                      <Grid size={12} sx={{ mt: 2 }}>
                        <Button
                          variant="outlined"
                          color="primary"
                          sx={{ mr: 2 }}
                        >
                          Check for Updates
                        </Button>
                        
                        <Button
                          variant="outlined"
                          color="secondary"
                        >
                          Backup Database
                        </Button>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            )}
          </Box>
        </Container>
      </Box>
      
      {/* User Detail Dialog */}
      <Dialog open={userDialogOpen} onClose={handleCloseUserDialog} maxWidth="sm" fullWidth>
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={12} display="flex" justifyContent="center">
                <Avatar 
                  sx={{ 
                    width: 100, 
                    height: 100,
                    bgcolor: theme.palette.primary.main,
                    fontSize: '2rem'
                  }}
                >
                  {selectedUser.username.charAt(0)}
                </Avatar>
              </Grid>
              
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Name"
                  value={selectedUser.username}
                  margin="normal"
                  disabled
                />
              </Grid>
              
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Email"
                  value={selectedUser.email}
                  margin="normal"
                  disabled
                />
              </Grid>
              
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={selectedUser.phone}
                  margin="normal"
                  disabled
                />
              </Grid>
              
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Join Date"
                  value={new Date(selectedUser.created_at).toLocaleDateString()}
                  margin="normal"
                  disabled
                />
              </Grid>
              
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Address"
                  value={selectedUser.address}
                  margin="normal"
                  disabled
                />
              </Grid>
              
              <Grid size={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <Typography variant="subtitle1" sx={{ mr: 2 }}>Status:</Typography>
                  <Chip                    label={selectedUser.status === "active" ? "Active" : "Inactive"} 
                    color={selectedUser.status === "active" ? "success" : "error"}
                  />
                </Box>
              </Grid>
              
              {userTabValue === 0 && (
                <Grid size={12}>
                  <Typography variant="subtitle1" gutterBottom>Donation Statistics:</Typography>
                  <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Total Donations</Typography>
                      <Typography variant="h6">{selectedUser.stats?.total_donations || 0}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Food Donated (kg)</Typography>
                      <Typography variant="h6">{selectedUser.stats?.food_donated_kg || 0}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Avg. Rating</Typography>
                      <Typography variant="h6">{selectedUser.stats?.avg_rating || 'N/A'}</Typography>
                    </Box>
                  </Box>
                </Grid>
              )}
              
              {userTabValue === 1 && (
                <Grid size={12}>
                  <Typography variant="subtitle1" gutterBottom>Request Statistics:</Typography>
                  <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Total Requests</Typography>
                      <Typography variant="h6">{selectedUser.stats?.total_requests || 0}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Fulfilled Requests</Typography>
                      <Typography variant="h6">{selectedUser.stats?.fulfilled_requests || 0}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Beneficiaries Served</Typography>
                      <Typography variant="h6">{selectedUser.stats?.beneficiaries_served || 0}</Typography>
                    </Box>
                  </Box>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUserDialog}>Close</Button>
          <Button 
            variant="contained" 
            color={selectedUser?.status === "active" ? "error" : "success"}            onClick={() => handleOpenConfirmDialog(
              selectedUser?.status === "active" ? 'deactivateUser' : 'activateUser',
              selectedUser?.user_id
            )}
          >
            {selectedUser?.status === "active" ? "Deactivate User" : "Activate User"}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Donation Detail Dialog */}
      <Dialog open={donationDialogOpen} onClose={handleCloseDonationDialog} maxWidth="md" fullWidth>
        <DialogTitle>Donation Details</DialogTitle>
        <DialogContent>
          {selectedDonation && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Food Name"
                  value={selectedDonation.food_name}
                  margin="normal"
                  disabled
                />
              </Grid>
              
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Donor"
                  value={selectedDonation.donor_name}
                  margin="normal"
                  disabled
                />
              </Grid>
              
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="Quantity"
                  value={`${selectedDonation.quantity} ${selectedDonation.unit}`}
                  margin="normal"
                  disabled
                />
              </Grid>
              
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="Expiry Date"
                  value={new Date(selectedDonation.expiry_date).toLocaleDateString()}
                  margin="normal"
                  disabled
                />
              </Grid>
              
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="Donation Date"
                  value={new Date(selectedDonation.donation_date).toLocaleDateString()}
                  margin="normal"
                  disabled
                />
              </Grid>
              
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={selectedDonation.description}
                  multiline
                  rows={3}
                  margin="normal"
                  disabled
                />
              </Grid>
              
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Pickup Location"
                  value={selectedDonation.pickup_location}
                  margin="normal"
                  disabled
                />
              </Grid>
              
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Pickup Time"
                  value={selectedDonation.pickup_time}
                  margin="normal"
                  disabled
                />
              </Grid>
              
              <Grid size={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <Typography variant="subtitle1" sx={{ mr: 2 }}>Status:</Typography>
                  <Chip 
                    label={selectedDonation.status} 
                    color={
                      selectedDonation.status === 'approved' ? 'success' : 
                      selectedDonation.status === 'pending' ? 'warning' : 
                      selectedDonation.status === 'rejected' ? 'error' : 'default'
                    }
                  />
                </Box>
              </Grid>
              
              {selectedDonation.status === 'pending' && (
                <Grid size={12}>
                  <Typography variant="subtitle1" gutterBottom>Admin Decision:</Typography>
                  <TextField
                    fullWidth
                    label="Notes"
                    placeholder="Add notes about this donation approval/rejection..."
                    multiline
                    rows={2}
                    margin="normal"
                  />
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDonationDialog}>Close</Button>
          {selectedDonation?.status === 'pending' && (
            <>
              <Button 
                variant="outlined" 
                color="error"
                onClick={() => handleOpenConfirmDialog('rejectDonation', selectedDonation?.donation_id)}
              >
                Reject
              </Button>
              <Button 
                variant="contained" 
                color="success"
                onClick={() => handleOpenConfirmDialog('approveDonation', selectedDonation?.donation_id)}
              >
                Approve
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
      
      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {confirmAction?.action === 'approveDonation' && "Are you sure you want to approve this donation?"}
            {confirmAction?.action === 'rejectDonation' && "Are you sure you want to reject this donation?"}
            {confirmAction?.action === 'activateUser' && "Are you sure you want to activate this user?"}
            {confirmAction?.action === 'deactivateUser' && "Are you sure you want to deactivate this user? This will prevent them from using the platform."}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleConfirmAction} 
            variant="contained" 
            color={
              confirmAction?.action === 'approveDonation' || confirmAction?.action === 'activateUser' 
                ? 'success' 
                : 'error'
            }
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboardPage;
