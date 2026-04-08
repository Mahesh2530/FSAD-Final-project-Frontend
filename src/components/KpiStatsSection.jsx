import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Fallback data in case API fails
const fallbackData = {
  total_food_saved_kg: 7580,
  total_donations: 1245,
  total_meals_served: 22740,
  total_beneficiaries: 5680
};

const SectionHeading = styled(Typography)(({ theme }) => ({
  position: 'relative',
  marginBottom: theme.spacing(6),
  fontWeight: 700,
  textAlign: 'center',
  paddingBottom: theme.spacing(2),
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 80,
    height: 4,
    backgroundColor: theme.palette.primary.main,
    borderRadius: theme.shape.borderRadius,
  }
}));

const KpiCardStyled = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[1],
  transition: 'all 0.3s ease',
  border: '2px solid transparent',
  '&:hover': {
    boxShadow: theme.shadows[4],
    transform: 'translateY(-8px)',
    borderColor: theme.palette.primary.main,
  }
}));

// KPI Card Component
const KpiCard = ({ icon, title, value, animatedValue, suffix = '' }) => {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <KpiCardStyled>
        <Typography variant="h3" sx={{ mb: 2 }}>
          {icon}
        </Typography>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
          {title}
        </Typography>
        <Typography 
          variant="h4" 
          color="primary" 
          fontWeight={700}
        >
          {animatedValue.toLocaleString()}{suffix}
        </Typography>
      </KpiCardStyled>
    </Box>
  );
};

const KpiStatsSection = () => {
  const [countedValues, setCountedValues] = useState({
    foodSaved: 0,
    donations: 0,
    mealsServed: 0,
    beneficiaries: 0
  });
  const [loading, setLoading] = useState(true);
  
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      // Simulate loading for better UX
      const loadingTimer = setTimeout(() => {
        setLoading(false);
      }, 1000);

      // Animation for counters
      const duration = 2000; // 2 seconds for counter animation
      const frameRate = 30; // frames per second
      const totalFrames = duration / (1000 / frameRate);
      
      let frame = 0;
      const counter = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        
        setCountedValues({
          foodSaved: Math.round(progress * fallbackData.total_food_saved_kg),
          donations: Math.round(progress * fallbackData.total_donations),
          mealsServed: Math.round(progress * fallbackData.total_meals_served),
          beneficiaries: Math.round(progress * fallbackData.total_beneficiaries)
        });
        
        if (frame === totalFrames) {
          clearInterval(counter);
          setHasAnimated(true);
        }
      }, 1000 / frameRate);
      
      return () => {
        clearInterval(counter);
        clearTimeout(loadingTimer);
      };
    }
  }, [isInView, hasAnimated]);

  return (
    <Box 
      component="section" 
      ref={sectionRef} 
      sx={{ 
        py: { xs: 8, md: 12 }, 
        bgcolor: 'background.paper'
      }}
    >
      <Container maxWidth="lg">
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeading variant="h3" component="h2">
            Our Impact
          </SectionHeading>
        </Box>
            {/* Loading State */}
        {loading && (
          <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            sx={{ py: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <CircularProgress size={48} color="primary" sx={{ mb: 2 }} />
            <Typography color="text.secondary">Loading statistics...</Typography>
          </Box>
        )}
        
        {/* KPI Cards Grid */}
        {!loading && (
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <KpiCard 
                icon="🍎"
                title="Food Saved"
                value={fallbackData.total_food_saved_kg}
                animatedValue={countedValues.foodSaved}
                suffix=" kg"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <KpiCard 
                icon="📦"
                title="Donations Made"
                value={fallbackData.total_donations}
                animatedValue={countedValues.donations}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <KpiCard 
                icon="🍽️"
                title="Meals Served"
                value={fallbackData.total_meals_served}
                animatedValue={countedValues.mealsServed}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <KpiCard 
                icon="👨‍👩‍👧‍👦"
                title="People Helped"
                value={fallbackData.total_beneficiaries}
                animatedValue={countedValues.beneficiaries}
              />
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default KpiStatsSection;
