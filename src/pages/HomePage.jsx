import { Box } from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import MissionSection from '../components/MissionSection';
import KpiStatsSection from '../components/KpiStatsSection';
import CtaSection from '../components/CtaSection';

const HomePage = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      
      <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', pt: 8 }}>
        <HeroSection />
        <MissionSection />
        <KpiStatsSection />
        <CtaSection />
      </Box>
      
      <Footer />
    </Box>
  );
};

export default HomePage;
