import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { green, brown } from '@mui/material/colors';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import OfflineNotification from './components/OfflineNotification';

// Pages
import HomePage from './pages/HomePage';
import QueryPage from './pages/QueryPage';
import WeatherPage from './pages/WeatherPage';
import CropInfoPage from './pages/CropInfoPage';
import FinancePage from './pages/FinancePage';
import SettingsPage from './pages/SettingsPage';

// Contexts
import { LanguageProvider } from './contexts/LanguageContext';
import { LocationProvider } from './contexts/LocationContext';
import { OfflineDataProvider } from './contexts/OfflineDataContext';
import { getOfflineService } from './services/OfflineService';

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
      <CssBaseline />
      <LanguageProvider>
        <LocationProvider>
          <OfflineDataProvider>
            <Router>
              <div className="App">
                <Header />
                {!isOnline && <OfflineNotification />}
                <main>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/query" element={<QueryPage />} />
                    <Route path="/weather" element={<WeatherPage />} />
                    <Route path="/crops" element={<CropInfoPage />} />
                    <Route path="/finance" element={<FinancePage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </Router>
          </OfflineDataProvider>
        </LocationProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;