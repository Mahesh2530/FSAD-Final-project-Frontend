import { useState } from 'react';
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Button, 
  Chip, 
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  Badge,
  IconButton,
  Alert,
  Snackbar,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Paper,
  useMediaQuery
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Restaurant as FoodIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  ClearAll as ClearIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';

// Food category colors
const categoryColors = {
  'perishable': '#4caf50', // Green for perishable items
  'non_perishable': '#2196f3', // Blue for non-perishable items
  'prepared': '#ff9800', // Orange for prepared foods
  'other': '#9e9e9e' // Grey for others
};

// Category labels for display
const categoryLabels = {
  'perishable': 'Perishable',
  'non_perishable': 'Non-Perishable',
  'prepared': 'Prepared Food',
  'other': 'Other'
};

const BrowseDonations = ({ donations = [], onRequest, loading }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // State for dialogs and notifications
  const [confirmRequest, setConfirmRequest] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Filtering state
  const [filterCategory, setFilterCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Format date for display
  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch (err) {
      return dateString;
    }
  };
  
  // Open confirm request dialog
  const handleOpenRequest = (donation) => {
    setSelectedDonation(donation);
    setConfirmRequest(true);
  };
  
  // Close confirm request dialog
  const handleCloseRequest = () => {
    setConfirmRequest(false);
    setSelectedDonation(null);
  };
  
  // Handle request creation
  const handleRequest = async () => {
    if (!selectedDonation) return;
    
    try {
      const result = await onRequest(selectedDonation.donation_id);
      
      if (result.success) {
        setSuccessMessage('Donation requested successfully!');
        setSuccess(true);
      } else {
        setError(result.error || 'Failed to request donation. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while requesting the donation.');
    } finally {
      handleCloseRequest();
    }
  };
  
  // Handle filter and search changes
  const handleFilterChange = (event) => {
    setFilterCategory(event.target.value);
  };
  
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  
  const clearFilters = () => {
    setFilterCategory('');
    setSearchTerm('');
  };
  
  // Filter donations based on category and search term
  const filteredDonations = donations.filter(donation => {
    const matchesCategory = !filterCategory || donation.food_category === filterCategory;
    const matchesSearch = !searchTerm || 
      donation.food_description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSuccess(false);
    setError(null);
  };
  
  return (
    <Box>
      {/* Success message */}
      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          elevation={6} 
          variant="filled" 
          onClose={handleSnackbarClose} 
          severity="success"
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
      
      {/* Error message */}
      <Snackbar
        open={Boolean(error)}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          elevation={6} 
          variant="filled" 
          onClose={handleSnackbarClose} 
          severity="error"
          sx={{ 
            width: '100%',
            animation: 'shake 0.5s',
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
      
      {/* Filters */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 2, 
          mb: 3, 
          borderRadius: 2,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2,
          width: { xs: '100%', sm: 'auto' }
        }}>
          <TextField
            label="Search donations"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: { sm: 200 } }}
          />
          
          <FormControl variant="outlined" size="small" sx={{ minWidth: { sm: 200 } }}>
            <InputLabel id="category-filter-label">Food Category</InputLabel>
            <Select
              labelId="category-filter-label"
              value={filterCategory}
              onChange={handleFilterChange}
              label="Food Category"
              startAdornment={<FilterIcon fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />}
            >
              <MenuItem value="">All Categories</MenuItem>
              <MenuItem value="perishable">Perishable</MenuItem>
              <MenuItem value="non_perishable">Non-Perishable</MenuItem>
              <MenuItem value="prepared">Prepared Food</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button 
            size="small" 
            variant="outlined" 
            color="primary"
            onClick={clearFilters}
            startIcon={<ClearIcon />}
            disabled={!filterCategory && !searchTerm}
          >
            Clear Filters
          </Button>
          
          <Typography variant="body2" color="text.secondary">
            {filteredDonations.length} donations found
          </Typography>
        </Box>
      </Paper>
      
      {/* Loading indicator */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress size={50} />
        </Box>
      )}
      
      {/* No results message */}
      {!loading && filteredDonations.length === 0 && (
        <Box 
          sx={{ 
            py: 6, 
            textAlign: 'center',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 1
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No donations found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Try adjusting your filters or check back later.
          </Typography>
        </Box>
      )}
      
      {/* Donations Grid */}
      {!loading && filteredDonations.length > 0 && (
        <Grid container spacing={3} id="donations-grid">
          {filteredDonations.map((donation, index) => (
            <Grid item xs={12} sm={6} key={donation.donation_id}>
              <Card 
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  y: -10,
                  boxShadow: '0 10px 20px rgba(0,0,0,0.1)' 
                }}
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: 2
                }}
              >
                <CardMedia
                  component="img"
                  height="180"
                  image={`https://source.unsplash.com/random/400x200/?food,${donation.food_category}`}
                  alt={donation.food_description}
                />
                
                <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" component="h2" noWrap sx={{ maxWidth: '70%' }}>
                      {donation.food_description}
                    </Typography>
                    
                    <Chip
                      label={categoryLabels[donation.food_category] || donation.food_category}
                      size="small"
                      sx={{
                        bgcolor: categoryColors[donation.food_category] || theme.palette.primary.main,
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <FoodIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      Quantity: {donation.quantity_kg} kg
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CalendarIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      Expires: {formatDate(donation.expiry_date)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body2" noWrap>
                      Pickup Location
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                    Available for pickup: {formatDate(donation.pickup_window_start)} to {formatDate(donation.pickup_window_end)}
                  </Typography>
                </CardContent>
                
                <Divider />
                
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    Posted: {formatDate(donation.created_at)}
                  </Typography>
                  
                  <Button
                    component={motion.button}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handleOpenRequest(donation)}
                    sx={{ borderRadius: 20, px: 2 }}
                  >
                    Request
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Request Confirmation Dialog */}
      <Dialog
        open={confirmRequest}
        onClose={handleCloseRequest}
        aria-labelledby="request-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="request-dialog-title">Confirm Donation Request</DialogTitle>
        <DialogContent>
          {selectedDonation && (
            <>
              <Typography variant="h6" gutterBottom>
                {selectedDonation.food_description}
              </Typography>
              
              <Typography variant="body1" paragraph>
                Are you sure you want to request this donation? The donor will be notified, and you will be able to arrange pickup details if your request is approved.
              </Typography>
              
              <Typography variant="body2">
                <strong>Quantity:</strong> {selectedDonation.quantity_kg} kg
              </Typography>
              
              <Typography variant="body2">
                <strong>Expires on:</strong> {formatDate(selectedDonation.expiry_date)}
              </Typography>
              
              <Typography variant="body2">
                <strong>Pickup window:</strong> {formatDate(selectedDonation.pickup_window_start)} to {formatDate(selectedDonation.pickup_window_end)}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRequest}>
            Cancel
          </Button>
          <Button 
            onClick={handleRequest} 
            variant="contained" 
            color="primary"
          >
            Confirm Request
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BrowseDonations;
