import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Button, 
  Chip, 
  CircularProgress, 
  Alert,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Pagination,
  useMediaQuery
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import DashboardNavbar from '../components/DashboardNavbar';
import Footer from '../components/Footer';
import { api } from '../utils/apiUtils';
import { authService } from '../utils/authUtils';

// Styled components
const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.default,
}));

const MainContent = styled(Container)(({ theme }) => ({
  flex: 1,
  paddingTop: theme.spacing(12),
  paddingBottom: theme.spacing(6),
}));

const PageTitle = styled(motion.div)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  textAlign: 'center',
}));

const MotionCard = motion.create(Card);
const NotificationCard = styled(MotionCard)(({ theme, isRead }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  backgroundColor: isRead ? '#ffffff' : '#EBF5FF',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
  },
}));

const StatusBadge = styled(Chip)(({ theme, type }) => {
  let color;
  switch (type) {
    case 'donation_status':
      color = theme.palette.info.main;
      break;
    case 'expiry_alert':
      color = theme.palette.warning.main;
      break;
    case 'request_update':
      color = theme.palette.secondary.main;
      break;
    default:
      color = theme.palette.grey[500];
  }
  
  return {
    backgroundColor: color,
    color: '#ffffff',
    fontWeight: 600,
    fontSize: '0.75rem',
  };
});

const MarkAsReadButton = styled(Button)(({ theme }) => ({
  marginLeft: 'auto',
  borderRadius: theme.shape.borderRadius * 2,
  minWidth: 'auto',
  padding: theme.spacing(0.5, 2),
  fontSize: '0.75rem',
  transition: 'all 0.3s ease',
  backgroundColor: theme.palette.success.main,
  color: '#ffffff',
  '&:hover': {
    backgroundColor: theme.palette.success.dark,
    transform: 'scale(1.1)',
  },
}));

const AlertBanner = styled(Alert)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  display: 'flex',
  alignItems: 'center',
}));

const PaginationContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginTop: theme.spacing(4),
}));

// Helper function to format dates
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Helper function to map notification types to readable text
const getNotificationTypeText = (type) => {
  switch (type) {
    case 'donation_status':
      return 'Donation Status';
    case 'expiry_alert':
      return 'Expiry Alert';
    case 'request_update':
      return 'Request Update';
    default:
      return 'General';
  }
};

const NotificationsPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // State
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(5);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  
  // Get current user from local storage
  const getUserFromLocalStorage = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  };
  
  const currentUser = getUserFromLocalStorage();
  
  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);
  
  // Fetch notifications
  const fetchNotifications = async () => {
    if (!currentUser?.user_id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(
        `/api/v1/notifications?user_id=${currentUser.user_id}&page=${page}&size=${pageSize}`
      );
      
      setNotifications(response.data.content);
      setTotalPages(response.data.total_pages);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };
  
  // Load notifications on page load or page change
  useEffect(() => {
    if (currentUser?.user_id) {
      fetchNotifications();
    }
  }, [page, currentUser]);
  
  // Handle mark as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      await api.patch(`/api/v1/notifications/${notificationId}/read`);
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.notification_id === notificationId
            ? { ...notification, is_read: true }
            : notification
        )
      );
      
      // Show success message
      setSuccess('Notification marked as read!');
      
      // Auto-dismiss success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark notification as read');
    }
  };
  
  // Handle page change
  const handlePageChange = (event, value) => {
    setPage(value - 1); // API uses 0-based indexing
  };
  
  // Handle logout
  const handleLogout = async () => {
    const result = await authService.logout();
    if (result.success) {
      navigate('/login');
    } else {
      setError('Logout failed. Please try again.');
    }
  };
  
  // Card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: index => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: 0.5 + (index * 0.2), 
        duration: 0.5 
      }
    })
  };
  
  // Title animation variants
  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        delay: 0.3, 
        duration: 0.5 
      }
    }
  };
  
  // Error animation variants
  const errorVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.5 
      }
    },
    shake: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.5 }
    }
  };
    return (
    <PageContainer>
      <DashboardNavbar currentPage="notifications" onLogout={() => setLogoutDialogOpen(true)} />
      
      <MainContent maxWidth="md">
        <PageTitle
          variants={titleVariants}
          initial="hidden"
          animate="visible"
        >
          <Typography variant="h3" component="h1" fontWeight="bold">
            Your Notifications
          </Typography>
        </PageTitle>
        
        <AnimatePresence>
          {error && (
            <motion.div
              variants={errorVariants}
              initial="hidden"
              animate={["visible", "shake"]}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
            >
              <AlertBanner 
                severity="error"
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => setError(null)}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
              >
                {error}
              </AlertBanner>
            </motion.div>
          )}
          
          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <AlertBanner 
                severity="success"
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => setSuccess(null)}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
              >
                {success}
              </AlertBanner>
            </motion.div>
          )}
        </AnimatePresence>
        
        {loading ? (
          <Box display="flex" justifyContent="center" my={8}>
            <CircularProgress size={50} />
          </Box>
        ) : notifications.length === 0 ? (
          <Box textAlign="center" my={6}>
            <Typography variant="h6" color="textSecondary">
              No notifications to display.
            </Typography>
          </Box>
        ) : (
          <>
            {notifications.map((notification, index) => (
              <NotificationCard
                key={notification.notification_id}
                isRead={notification.is_read}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                aria-label={`Notification: ${notification.message}`}
              >
                <CardContent>
                  <Grid container spacing={2} alignItems="flex-start">
                    <Grid item xs={12}>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <StatusBadge 
                          label={getNotificationTypeText(notification.type)} 
                          type={notification.type}
                          size="small"
                        />
                        {!notification.is_read && (
                          <MarkAsReadButton
                            size="small"
                            variant="contained"
                            startIcon={<AssignmentTurnedInIcon />}
                            onClick={() => handleMarkAsRead(notification.notification_id)}
                            aria-label="Mark notification as read"
                          >
                            Mark as Read
                          </MarkAsReadButton>
                        )}
                      </Box>
                      <Typography variant="body1" mb={2}>
                        {notification.message}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {formatDate(notification.created_at)}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </NotificationCard>
            ))}
            
            {totalPages > 1 && (
              <PaginationContainer>
                <Pagination 
                  count={totalPages} 
                  page={page + 1} // API uses 0-based indexing
                  onChange={handlePageChange}
                  color="primary"
                  shape="rounded"
                  size={isMobile ? "small" : "medium"}
                  showFirstButton
                  showLastButton
                  sx={{
                    '& .MuiPaginationItem-root': {
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.1)',
                      },
                    },
                  }}
                />
              </PaginationContainer>
            )}
          </>
        )}
      </MainContent>
      
      <Footer />
      
      {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
        PaperProps={{
          style: {
            borderRadius: theme.shape.borderRadius,
            padding: theme.spacing(1),
          },
        }}
      >
        <DialogTitle id="logout-dialog-title">
          {"Confirm Logout"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="logout-dialog-description">
            Are you sure you want to log out of FoodShare?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setLogoutDialogOpen(false)} 
            color="primary"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleLogout} 
            color="error" 
            variant="contained"
            autoFocus
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default NotificationsPage;
