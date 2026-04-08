import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Paper,
  Stack
} from '@mui/material';
import { styled } from '@mui/material/styles';

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

const ImagePlaceholder = styled(Box)(({ theme }) => ({
  height: 256,
  width: '100%',
  backgroundColor: theme.palette.secondary.main,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.common.white,
  fontWeight: 700,
  fontSize: '1.25rem',
}));

const MissionSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

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
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeading variant="h3" component="h2">
            Our Mission
          </SectionHeading>
        </Box>
        
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} lg={6}>
            <Box
              component={motion.div}
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Stack spacing={3}>
                <Typography variant="body1" color="text.secondary">
                  At FoodShare, we believe that no food should go to waste while people go hungry. Our mission is to create a community-driven platform that connects those with surplus food to those who need it most.
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  By facilitating the redistribution of excess food from restaurants, grocery stores, and individuals to community organizations and people in need, we aim to reduce food waste, combat hunger, and build a more sustainable and compassionate world.
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Every day, tons of perfectly good food are thrown away while millions struggle to put meals on the table. We're changing that, one connection at a time.
                </Typography>
              </Stack>
            </Box>
          </Grid>
          
          <Grid item xs={12} lg={6}>
            <Box
              component={motion.div}
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
            >
              <Paper 
                elevation={4} 
                sx={{ 
                  borderRadius: 2, 
                  overflow: 'hidden',
                  transition: 'box-shadow 0.3s',
                  '&:hover': {
                    boxShadow: 8,
                  }
                }}
              >
                <ImagePlaceholder>
                  Food Sharing Image
                </ImagePlaceholder>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};


export default MissionSection;
