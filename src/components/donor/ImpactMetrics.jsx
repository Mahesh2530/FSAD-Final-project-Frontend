import { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Tabs, 
  Tab,
  Divider,
  useTheme
} from '@mui/material';
import { 
  LocalDining as MealIcon,
  Nature as NatureIcon,
  ShoppingBasket as BasketIcon,
  RestaurantMenu as FoodIcon,
  ShowChart as ChartIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

// Custom hook for chart animations
const useChartAnimation = () => {
  const [animate, setAnimate] = useState(true);
  
  // Reset animation on tab change
  const resetAnimation = () => {
    setAnimate(false);
    setTimeout(() => setAnimate(true), 50);
  };
  
  return { animate, resetAnimation };
};

const ImpactMetrics = ({ data }) => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const { animate, resetAnimation } = useChartAnimation();
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    resetAnimation();
  };
  
  // If no data to display
  if (!data) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No impact data available.
        </Typography>
      </Box>
    );
  }
  
  // Generate data for donation type pie chart
  const donationTypeData = [
    { name: 'Fresh Produce', value: 42 },
    { name: 'Bakery Items', value: 18 },
    { name: 'Non-Perishable', value: 25 },
    { name: 'Dairy', value: 7 },
    { name: 'Other', value: 8 }
  ];
  
  // Pie chart colors
  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.info.main,
    theme.palette.warning.main
  ];
  
  return (
    <Box>
      {/* Impact Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            component={motion.div}
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            sx={{ 
              borderRadius: 3,
              height: '100%',
              backgroundColor: theme.palette.primary.main,
              color: 'white',
              boxShadow: 3
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <BasketIcon fontSize="large" />
              <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1 }}>
                {data.total_donations}
              </Typography>
              <Typography variant="body1">
                Total Donations
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            component={motion.div}
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            sx={{ 
              borderRadius: 3,
              height: '100%',
              backgroundColor: theme.palette.secondary.main,
              color: 'white',
              boxShadow: 3
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <FoodIcon fontSize="large" />
              <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1 }}>
                {data.total_food_donated_kg} kg
              </Typography>
              <Typography variant="body1">
                Food Donated
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            component={motion.div}
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            sx={{ 
              borderRadius: 3,
              height: '100%',
              backgroundColor: theme.palette.success.main,
              color: 'white',
              boxShadow: 3
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <MealIcon fontSize="large" />
              <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1 }}>
                {data.total_meals_provided}
              </Typography>
              <Typography variant="body1">
                Meals Provided
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            component={motion.div}
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            sx={{ 
              borderRadius: 3,
              height: '100%',
              backgroundColor: theme.palette.info.main,
              color: 'white',
              boxShadow: 3
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <NatureIcon fontSize="large" />
              <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1 }}>
                {data.carbon_footprint_saved_kg} kg
              </Typography>
              <Typography variant="body1">
                CO₂ Saved
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Charts */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          borderRadius: 3,
          overflow: 'hidden'
        }}
      >
        <Typography variant="h5" component="h2" gutterBottom>
          Donation Analytics
        </Typography>
        
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
          aria-label="impact metrics tabs"
          sx={{ mb: 3 }}
        >
          <Tab icon={<ChartIcon />} label="Monthly Trend" />
          <Tab icon={<BasketIcon />} label="Donation Types" />
        </Tabs>
        
        <Divider sx={{ mb: 3 }} />
        
        {/* Monthly Trend Chart */}
        {tabValue === 0 && (
          <Box sx={{ height: 400, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.monthly_stats}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" orientation="left" stroke={theme.palette.primary.main} />
                <YAxis yAxisId="right" orientation="right" stroke={theme.palette.secondary.main} />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'donations') return [value, 'Donations'];
                    if (name === 'kg') return [`${value} kg`, 'Food Donated'];
                    return [value, name];
                  }}
                  labelFormatter={(label) => `Month: ${label}`}
                  contentStyle={{ 
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: theme.shape.borderRadius,
                  }}
                />
                <Legend />
                {animate && (
                  <>
                    <Bar 
                      yAxisId="left" 
                      dataKey="donations" 
                      fill={theme.palette.primary.main} 
                      name="Donations" 
                      animationDuration={1500}
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      yAxisId="right" 
                      dataKey="kg" 
                      fill={theme.palette.secondary.main} 
                      name="Food Donated (kg)" 
                      animationDuration={1500}
                      radius={[4, 4, 0, 0]}
                    />
                  </>
                )}
              </BarChart>
            </ResponsiveContainer>
          </Box>
        )}
        
        {/* Donation Types Pie Chart */}
        {tabValue === 1 && (
          <Box sx={{ height: 400, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donationTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={130}
                  innerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  animationDuration={1500}
                  animationBegin={animate ? 0 : 9999}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {donationTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value} kg`, 'Amount']}
                  contentStyle={{ 
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: theme.shape.borderRadius,
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        )}
      </Paper>
      
      {/* Impact Statement */}
      <Box 
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        sx={{ 
          mt: 4, 
          p: 3, 
          textAlign: 'center',
          bgcolor: theme.palette.background.paper,
          borderRadius: 3,
          boxShadow: 2
        }}
      >
        <Typography variant="h5" color="primary" gutterBottom>
          Your Impact Makes a Difference
        </Typography>
        <Typography variant="body1">
          Thanks to your donations, you've helped feed {data.total_meals_provided} people in need and saved {data.carbon_footprint_saved_kg} kg of CO₂ emissions.
          Keep up the great work!
        </Typography>
      </Box>
    </Box>
  );
};

export default ImpactMetrics;
