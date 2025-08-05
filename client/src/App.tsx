import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, useMediaQuery } from '@mui/material';
import { green, brown } from '@mui/material/colors';

// Initialize i18n
import './i18n/index.ts';

// Components
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import Sidebar from './components/Sidebar.tsx';
import OfflineNotification from './components/OfflineNotification.tsx';

// Pages
import HomePage from './pages/HomePage.tsx';
import ChatPage from './pages/ChatPage.tsx';
import WeatherPage from './pages/WeatherPage.tsx';
import CropInfoPage from './pages/CropInfoPage.tsx';
import FinancePage from './pages/FinancePage.tsx';
import SettingsPage from './pages/SettingsPage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import RegisterPage from './pages/RegisterPage.tsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.tsx';
import ResetPasswordPage from './pages/ResetPasswordPage.tsx';
import ProfilePage from './pages/ProfilePage.tsx';

// Contexts
<<<<<<< HEAD
import { LanguageProvider } from './contexts/LanguageContext.tsx';
import { LocationProvider } from './contexts/LocationContext.tsx';
import { OfflineDataProvider } from './contexts/OfflineDataContext.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { getOfflineService } from './services/OfflineService.ts';
=======
import { LanguageProvider } from './contexts/LanguageContext';
import { LocationProvider } from './contexts/LocationContext';
import { OfflineDataProvider } from './contexts/OfflineDataContext';
import { getOfflineService } from './services/OfflineService';
>>>>>>> 80234744171ebc6b5412a958112010fc029dccdf

const theme = createTheme({
  palette: {
    primary: {
      main: green[600],
    },
    secondary: {
      main: brown[500],
    },
  },
  typography: {
    fontFamily: '"Roboto", "Noto Sans", sans-serif',
  },
});

function App() {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const drawerWidth = 240;
  
  // Close sidebar by default on mobile
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);
  
  // Handle window resize to close sidebar on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < theme.breakpoints.values.md) {
        setSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [theme.breakpoints.values.md]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initialize offline service
    getOfflineService().catch(error => {
      console.error('Failed to initialize offline service:', error);
    });
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      {/* <CssBaseline /> */}
      <LanguageProvider>
        <LocationProvider>
          <Router>
            <AuthProvider>
              <OfflineDataProvider>
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                  <Header sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                  {!isOnline && <OfflineNotification />}
                  <Box sx={{ display: 'flex', flexGrow: 1 }}>
                    <Sidebar open={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} drawerWidth={drawerWidth} />
                    <Box
                      component="main"
                      sx={{
                        flexGrow: 1,
                        p: { xs: 2, sm: 3 }, // Smaller padding on mobile
                        width: '100%',
                        marginLeft: { 
                          xs: 0, // No margin on mobile (sidebar overlays content)
                          md: sidebarOpen ? `${30}px` : `${theme.spacing(7)}px` // Margin on desktop
                        },
                        transition: theme.transitions.create(['margin', 'width'], {
                          easing: theme.transitions.easing.sharp,
                          duration: theme.transitions.duration.leavingScreen,
                        }),
                      }}
                    >
                      <Box sx={{ height: '64px' }} /> {/* Toolbar spacer */}
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/chat" element={<ChatPage />} />
                        <Route path="/weather" element={<WeatherPage />} />
                        <Route path="/crops" element={<CropInfoPage />} />
                        <Route path="/finance" element={<FinancePage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                      </Routes>
                    </Box>
                  </Box>
                  {/* <Footer /> */}
                </Box>
              </OfflineDataProvider>
            </AuthProvider>
          </Router>
        </LocationProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;