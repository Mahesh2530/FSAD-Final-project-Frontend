import { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Grid, 
  Typography, 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  CardMedia, 
  Chip, 
  Divider,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Search as SearchIcon, 
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Restaurant as FoodIcon,
  MyLocation as MyLocationIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
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

const SearchDonations = ({ onSearch, onRequest, loading }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // State for search form
  const [searchData, setSearchData] = useState({
    keyword: '',
    food_category: '',
    location: ''
  });
  
  // State for search results
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  // State for pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  
  // State for location fetching
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);
  
  // State for dialogs and notifications
  const [confirmRequest, setConfirmRequest] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Format date for display
  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchData({
      ...searchData,
      [name]: value
    });
  };
  
  // Handle search submission
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    
    // Validate that at least one field is filled
    if (!searchData.keyword && !searchData.food_category && !searchData.location) {
      setError('Please provide at least one search parameter');
      return;
    }
    
    setIsSearching(true);
    setHasSearched(true);
    
    try {
      const result = await onSearch(searchData);
      
      if (result.success) {
        setSearchResults(result.data);
        // Reset to first page when new search is performed
        setPage(1);
      } else {
        setError(result.error || 'Search failed. Please try again.');
        setSearchResults([]);
      }
    } catch (err) {
      setError(err.message || 'An error occurred while searching.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };
  
  // Use browser geolocation
  const getCurrentLocation = () => {
    setLocationLoading(true);
    setLocationError(null);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Here you would normally convert coordinates to an address using a geocoding service
          // For this example, we'll just use the coordinates
          const location = `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`;
          setSearchData({
            ...searchData,
            location
          });
          setLocationLoading(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLocationError('Failed to get your location. Please enter it manually.');
          setLocationLoading(false);
        },
        { timeout: 10000 }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser');
      setLocationLoading(false);
    }
  };
  
  // Clear search form
  const clearForm = () => {
    setSearchData({
      keyword: '',
      food_category: '',
      location: ''
    });
    
    if (hasSearched) {
      setSearchResults([]);
      setHasSearched(false);
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
        // Remove the requested donation from search results
        setSearchResults(searchResults.filter(
          donation => donation.donation_id !== selectedDonation.donation_id
        ));
        
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
  
  // Calculate pagination
  const totalPages = Math.ceil(searchResults.length / itemsPerPage);
  const displayedDonations = searchResults.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  
  // Handle page change
  const handlePageChange = (event, value) => {
    setPage(value);
    // Scroll to top of the results when page changes
    window.scrollTo({
      top: document.getElementById('search-results').offsetTop - 100,
      behavior: 'smooth'
    });
  };
  
  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSuccess(false);
    setError(null);
    setLocationError(null);
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
      
      {/* Location error message */}
      <Snackbar
        open={Boolean(locationError)}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          elevation={6} 
          variant="filled" 
          onClose={handleSnackbarClose} 
          severity="warning"
          sx={{ width: '100%' }}
        >
          {locationError}
        </Alert>
      </Snackbar>
      
      {/* Search Form */}
      <Paper 
        component={motion.form}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        elevation={2} 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 3,
          boxShadow: 3
        }}
        onSubmit={handleSearch}
      >
        <Typography variant="h6" gutterBottom>
          Search for Available Donations
        </Typography>
        
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={4}>
            <TextField
              name="keyword"
              label="Keyword"
              value={searchData.keyword}
              onChange={handleInputChange}
              fullWidth
              placeholder="e.g., vegetables, bread"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="food-category-label">Food Category</InputLabel>
              <Select
                labelId="food-category-label"
                name="food_category"
                value={searchData.food_category}
                onChange={handleInputChange}
                label="Food Category"
              >
                <MenuItem value="">All Categories</MenuItem>
                <MenuItem value="perishable">Perishable</MenuItem>
                <MenuItem value="non_perishable">Non-Perishable</MenuItem>
                <MenuItem value="prepared">Prepared Food</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Box sx={{ position: 'relative' }}>
              <TextField
                name="location"
                label="Location"
                value={searchData.location}
                onChange={handleInputChange}
                fullWidth
                placeholder="Enter location"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton 
                        onClick={getCurrentLocation}
                        disabled={locationLoading}
                        size="small"
                        color="primary"
                        aria-label="use current location"
                      >
                        {locationLoading ? (
                          <CircularProgress size={20} />
                        ) : (
                          <MyLocationIcon fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Grid>
          
          <Grid item xs={12} sx={{ mt: 1, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={clearForm}
              disabled={isSearching || (!searchData.keyword && !searchData.food_category && !searchData.location)}
            >
              Clear
            </Button>
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSearching || (!searchData.keyword && !searchData.food_category && !searchData.location)}
              startIcon={isSearching ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
            >
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Search Results */}
      <Box id="search-results">
        {isSearching && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress size={50} />
          </Box>
        )}
        
        {!isSearching && hasSearched && searchResults.length === 0 && (
          <Box 
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
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
              Try adjusting your search criteria or search for something else.
            </Typography>
          </Box>
        )}
        
        {!isSearching && searchResults.length > 0 && (
          <Box 
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="subtitle1" gutterBottom>
              Found {searchResults.length} donation{searchResults.length !== 1 ? 's' : ''}
            </Typography>
            
            <Grid container spacing={3}>
              <AnimatePresence>
                {displayedDonations.map((donation, index) => (
                  <Grid item xs={12} sm={6} key={donation.donation_id}>
                    <Card 
                      component={motion.div}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      exit={{ opacity: 0, x: -50 }}
                      whileHover={{ 
                        y: -5,
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
              </AnimatePresence>
            </Grid>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination 
                  count={totalPages} 
                  page={page} 
                  onChange={handlePageChange} 
                  color="primary"
                  variant="outlined"
                  shape="rounded"
                  size={isMobile ? 'small' : 'medium'}
                />
              </Box>
            )}
          </Box>
        )}
      </Box>
      
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

export default SearchDonations;
