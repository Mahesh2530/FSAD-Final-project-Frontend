import { useState } from 'react';
import PropTypes from 'prop-types';
import { 
  Box, 
  Paper, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button, 
  Chip, 
  LinearProgress, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Divider,
  CardActionArea,
  Tabs,
  Tab,
  Alert,
  useTheme,
  Snackbar
} from '@mui/material';
import { 
  EmojiEvents as TrophyIcon,
  Redeem as RedeemIcon,
  Stars as StarsIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';

const Rewards = ({ data, onRedeem }) => {
  const theme = useTheme();
  
  // State
  const [tabValue, setTabValue] = useState(0);
  const [redemptionDialog, setRedemptionDialog] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState(null);
  const [rewardCode, setRewardCode] = useState('');
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Open redemption dialog
  const handleOpenRedeem = (reward) => {
    setSelectedReward(reward);
    setRedemptionDialog(true);
  };
  
  // Close redemption dialog
  const handleCloseRedeem = () => {
    setRedemptionDialog(false);
    setSelectedReward(null);
    setRewardCode('');
  };
  
  // Handle reward redemption
  const handleRedeemReward = async () => {
    if (!selectedReward) return;
    
    try {
      const result = await onRedeem(selectedReward.reward_id);
      
      if (result.success) {
        setRewardCode(result.data.reward_code);
        setSuccessMessage(`You've successfully redeemed the ${selectedReward.name} reward!`);
        setSuccess(true);
      } else {
        setError(result.error || 'Failed to redeem reward. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while redeeming the reward.');
    }
  };
  
  // Handle close snackbar
  const handleCloseSnackbar = () => {
    setSuccess(false);
  };
  // If no data to display
  if (!data) {
    return (
      <Paper
        elevation={3}
        sx={{ p: 4, textAlign: 'center', borderRadius: 2, my: 2 }}
      >
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Rewards Data Unavailable
        </Typography>
        <Typography variant="body2" color="text.secondary">
          We're having trouble loading your rewards information. Please try again later.
        </Typography>
        <Button
          variant="outlined" 
          sx={{ mt: 2 }}
          onClick={() => window.location.reload()}
        >
          Refresh
        </Button>
      </Paper>
    );
  }
    // Display a note if we're using backup data
  const isUsingBackupData = data?.isBackupData;
  
  // Calculate level progress
  const getLevelProgress = () => {
    const levels = {
      'Bronze': { min: 0, max: 500 },
      'Silver': { min: 500, max: 1500 },
      'Gold': { min: 1500, max: 3000 },
      'Platinum': { min: 3000, max: 5000 }
    };
    
    const currentLevel = levels[data.level];
    if (!currentLevel) return { progress: 0, nextLevel: null };
    
    const nextLevelName = 
      data.level === 'Bronze' ? 'Silver' :
      data.level === 'Silver' ? 'Gold' :
      data.level === 'Gold' ? 'Platinum' : null;
    
    if (!nextLevelName) return { progress: 100, nextLevel: null };
    
    const nextLevel = levels[nextLevelName];
    const progress = ((data.points - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100;
    
    return { 
      progress, 
      nextLevel: nextLevelName, 
      pointsToNext: nextLevel.min - data.points 
    };
  };
  
  const levelInfo = getLevelProgress();
  
  // Format date for display
  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };
    return (
    <Box>
      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      {/* Show a notice when displaying backup data */}
      {data.isBackupData && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Using demo rewards data. The rewards service is currently unavailable.
        </Alert>
      )}
      
      {/* Success message */}
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
      
      {/* Points and Level Card */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          borderRadius: 3,
          mb: 4,
          overflow: 'hidden',
          background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
          color: 'white'
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TrophyIcon sx={{ fontSize: 48, mr: 2 }} />
              <Box>
                <Typography variant="h5" component="div" gutterBottom>
                  {data.level} Level
                </Typography>
                <Typography variant="body1">
                  You have <strong>{data.points} points</strong> to redeem
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          {levelInfo.nextLevel && (
            <Grid item xs={12} md={6}>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Progress to {levelInfo.nextLevel}</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {levelInfo.pointsToNext} points to go
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={levelInfo.progress}
                  sx={{ 
                    height: 10, 
                    borderRadius: 5,
                    backgroundColor: 'rgba(255,255,255,0.3)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: 'white'
                    }
                  }}
                />
              </Box>
            </Grid>
          )}
        </Grid>
      </Paper>
      
      {/* Rewards Tabs */}
      <Paper 
        elevation={2} 
        sx={{ 
          borderRadius: 3,
          overflow: 'hidden'
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
          aria-label="rewards tabs"
          sx={{ px: 2, pt: 2 }}
        >
          <Tab icon={<RedeemIcon />} label="Available Rewards" />
          <Tab icon={<CheckCircleIcon />} label="Redeemed Rewards" />
        </Tabs>
        
        <Divider sx={{ mt: 2 }} />
        
        <Box sx={{ p: 3 }}>
          {/* Available Rewards Tab */}
          {tabValue === 0 && (
            <Grid container spacing={3}>
              {data.rewards_available && data.rewards_available.length > 0 ? (
                data.rewards_available.map((reward) => (
                  <Grid item xs={12} md={6} lg={4} key={reward.reward_id}>
                    <Card 
                      component={motion.div}
                      whileHover={{ scale: 1.03 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      sx={{ 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 3,
                        overflow: 'hidden',
                      }}
                    >
                      <CardActionArea onClick={() => handleOpenRedeem(reward)}>
                        <CardMedia
                          component="img"
                          height="140"
                          image={reward.image_url}
                          alt={reward.name}
                        />
                        <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                          <Typography variant="h6" component="div" gutterBottom>
                            {reward.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {reward.description}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Chip 
                              icon={<StarsIcon />} 
                              label={`${reward.points_required} points`}
                              color={data.points >= reward.points_required ? "primary" : "default"}
                              variant={data.points >= reward.points_required ? "filled" : "outlined"}
                            />
                            <Typography variant="caption" color="text.secondary">
                              Expires: {formatDate(reward.expires_at)}
                            </Typography>
                          </Box>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Typography variant="body1" color="text.secondary" textAlign="center">
                    No rewards available at the moment.
                  </Typography>
                </Grid>
              )}
            </Grid>
          )}
          
          {/* Redeemed Rewards Tab */}
          {tabValue === 1 && (
            <Grid container spacing={3}>
              {data.rewards_redeemed && data.rewards_redeemed.length > 0 ? (
                data.rewards_redeemed.map((reward) => (
                  <Grid item xs={12} md={6} lg={4} key={reward.reward_id}>
                    <Card 
                      component={motion.div}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      sx={{ 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 3,
                        overflow: 'hidden',
                        opacity: 0.7
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="140"
                        image={reward.image_url}
                        alt={reward.name}
                        sx={{ filter: 'grayscale(0.5)' }}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box sx={{ position: 'relative' }}>
                          <Typography variant="h6" component="div" gutterBottom>
                            {reward.name}
                          </Typography>
                          <Chip 
                            icon={<CheckCircleIcon />} 
                            label="Redeemed"
                            color="success"
                            size="small"
                            sx={{ position: 'absolute', top: 0, right: 0 }}
                          />
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {reward.description}
                        </Typography>
                        
                        <Typography variant="caption" color="text.secondary" display="block">
                          Redeemed on: {formatDate(reward.redeemed_at)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Typography variant="body1" color="text.secondary" textAlign="center">
                    You haven't redeemed any rewards yet.
                  </Typography>
                </Grid>
              )}
            </Grid>
          )}
        </Box>
      </Paper>
      
      {/* Redemption Dialog */}
      <Dialog
        open={redemptionDialog}
        onClose={handleCloseRedeem}
        aria-labelledby="redemption-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="redemption-dialog-title">Redeem Reward</DialogTitle>
        <DialogContent>
          {selectedReward && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <img 
                  src={selectedReward.image_url} 
                  alt={selectedReward.name} 
                  style={{ width: '100%', borderRadius: theme.shape.borderRadius }}
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <Typography variant="h6" gutterBottom>
                  {selectedReward.name}
                </Typography>
                <Typography variant="body1" paragraph>
                  {selectedReward.description}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Partner: {selectedReward.partner}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <StarsIcon color="primary" sx={{ mr: 1 }} />
                  <Typography 
                    variant="body1" 
                    fontWeight="bold" 
                    color={data.points >= selectedReward.points_required ? "primary" : "error"}
                  >
                    {selectedReward.points_required} points
                  </Typography>
                </Box>
                
                {data.points < selectedReward.points_required && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    You need {selectedReward.points_required - data.points} more points to redeem this reward.
                  </Alert>
                )}
                
                {rewardCode && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    Your reward code: <strong>{rewardCode}</strong>
                  </Alert>
                )}
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRedeem}>
            {rewardCode ? 'Close' : 'Cancel'}
          </Button>
          {!rewardCode && (
            <Button 
              onClick={handleRedeemReward} 
              variant="contained" 
              color="primary"
              disabled={!selectedReward || data.points < selectedReward.points_required}
              startIcon={<RedeemIcon />}
            >
              Redeem
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Rewards;

// PropTypes validation
Rewards.propTypes = {
  data: PropTypes.shape({
    donor_id: PropTypes.string,
    points: PropTypes.number,
    level: PropTypes.string,
    rewards_available: PropTypes.array,
    rewards_redeemed: PropTypes.array,
    isBackupData: PropTypes.bool
  }),
  onRedeem: PropTypes.func
};
