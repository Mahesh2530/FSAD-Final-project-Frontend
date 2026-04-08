import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import './App.css';
import HomePage from './pages/HomePage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import DonorDashboardPage from './pages/DonorDashboardPage.jsx';
import BeneficiaryDashboardPage from './pages/BeneficiaryDashboardPage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';
import SearchDonationsPage from './pages/SearchDonationsPage.jsx';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#FF6B35', // Primary orange color
      contrastText: '#fff',
    },
    secondary: {
      main: '#2EC4B6', // Teal accent color
    },
    background: {
      default: '#FCFCFC', // Light background for the site
      paper: '#FFFFFF',   // White for cards and containers
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
    error: {
      main: '#F44336', // Red for error states
    },
    success: {
      main: '#4CAF50', // Green for success states
    }
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          transition: 'all 0.3s ease',
        },
        contained: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/donor" element={<DonorDashboardPage />} />
          <Route path="/beneficiary" element={<BeneficiaryDashboardPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/search-donations" element={<SearchDonationsPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}


export default App
