import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createTheme } from '@mui/material/styles';
import {  useMediaQuery } from '@mui/material';
import { green, brown } from '@mui/material/colors';


// Components
import Header from './components/Header.tsx';
import Sidebar from './components/Sidebar.tsx';
import OfflineNotification from './components/OfflineNotification.tsx';

// Pages
import HomePage from './pages/HomePage.tsx';
import ChatPage from './pages/ChatPage.tsx';
import PoliciesPage from './pages/PoliciesPage.tsx';
import CropInfoPage from './pages/CropInfoPage.tsx';
import BankPolicies from './pages/Bank_policies.tsx';

// Contexts

import { LanguageProvider } from './contexts/LanguageContext.tsx';
import { OfflineDataProvider } from './contexts/OfflineDataContext.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { getOfflineService } from './services/OfflineService.ts';


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
  const drawerWidth = 210;
  
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
    <LanguageProvider>
        <Router>
          <AuthProvider>
            <OfflineDataProvider>
              <div className="flex flex-col min-h-screen bg-white  text-gray-900 dark:text-gray-100">
                <Header sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                {!isOnline && <OfflineNotification />}
                <div className="flex flex-1">
                  <Sidebar open={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} drawerWidth={210} />
                  <main
                    className={`flex-1 p-0 transition-all duration-300 max-w-full ml-0`}
                  >
                    <div className="h-16" /> {/* Toolbar spacer */}
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/chat" element={<ChatPage />} />
                      <Route path="/govt-schemes" element={<PoliciesPage />} />
                      <Route path="/crops" element={<CropInfoPage />} />
                      <Route path="/bank-policies" element={<BankPolicies />} />
                    </Routes>
                  </main>
                </div>
                {/* <Footer /> */}
              </div>
            </OfflineDataProvider>
          </AuthProvider>
        </Router>
      </LanguageProvider>

  );
}

export default App;