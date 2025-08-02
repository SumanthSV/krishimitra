import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Button,
  TextField,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slider,
  useTheme
} from '@mui/material';
import {
  Language as LanguageIcon,
  LocationOn as LocationIcon,
  Notifications as NotificationIcon,
  Palette as ThemeIcon,
  Storage as StorageIcon,
  Security as SecurityIcon,
  Info as InfoIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Upload as UploadIcon
} from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';
import { useLocation } from '../contexts/LocationContext';
import { useOfflineData } from '../contexts/OfflineDataContext';

const translations = {
  en: {
    title: 'Settings',
    language: 'Language',
    location: 'Location',
    notifications: 'Notifications',
    theme: 'Theme',
    storage: 'Storage',
    security: 'Security',
    about: 'About',
    currentLanguage: 'Current Language',
    selectLanguage: 'Select Language',
    currentLocation: 'Current Location',
    setLocation: 'Set Location',
    autoDetect: 'Auto-detect location',
    manualLocation: 'Set manual location',
    state: 'State',
    district: 'District',
    enableNotifications: 'Enable Notifications',
    weatherAlerts: 'Weather Alerts',
    cropAdvisories: 'Crop Advisories',
    marketUpdates: 'Market Updates',
    lightTheme: 'Light Theme',
    darkTheme: 'Dark Theme',
    systemTheme: 'System Theme',
    cacheSize: 'Cache Size',
    clearCache: 'Clear Cache',
    exportData: 'Export Data',
    importData: 'Import Data',
    changePassword: 'Change Password',
    twoFactorAuth: 'Two-Factor Authentication',
    appVersion: 'App Version',
    buildNumber: 'Build Number',
    lastUpdated: 'Last Updated',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    contactSupport: 'Contact Support',
    save: 'Save',
    cancel: 'Cancel',
    success: 'Settings saved successfully',
    error: 'Failed to save settings',
    confirmClearCache: 'Are you sure you want to clear all cached data?',
    confirmExportData: 'Export all your data?',
    locationDetected: 'Location detected successfully',
    locationError: 'Failed to detect location',
    notificationPermission: 'Notification permission required',
  },
  hi: {
    title: 'सेटिंग्स',
    language: 'भाषा',
    location: 'स्थान',
    notifications: 'सूचनाएं',
    theme: 'थीम',
    storage: 'स्टोरेज',
    security: 'सुरक्षा',
    about: 'के बारे में',
    currentLanguage: 'वर्तमान भाषा',
    selectLanguage: 'भाषा चुनें',
    currentLocation: 'वर्तमान स्थान',
    setLocation: 'स्थान सेट करें',
    autoDetect: 'स्थान स्वतः पहचानें',
    manualLocation: 'मैन्युअल स्थान सेट करें',
    state: 'राज्य',
    district: 'जिला',
    enableNotifications: 'सूचनाएं सक्षम करें',
    weatherAlerts: 'मौसम अलर्ट',
    cropAdvisories: 'फसल सलाह',
    marketUpdates: 'बाजार अपडेट',
    lightTheme: 'लाइट थीम',
    darkTheme: 'डार्क थीम',
    systemTheme: 'सिस्टम थीम',
    cacheSize: 'कैश साइज़',
    clearCache: 'कैश साफ़ करें',
    exportData: 'डेटा निर्यात करें',
    importData: 'डेटा आयात करें',
    changePassword: 'पासवर्ड बदलें',
    twoFactorAuth: 'दो-कारक प्रमाणीकरण',
    appVersion: 'ऐप संस्करण',
    buildNumber: 'बिल्ड नंबर',
    lastUpdated: 'अंतिम अपडेट',
    privacyPolicy: 'गोपनीयता नीति',
    termsOfService: 'सेवा की शर्तें',
    contactSupport: 'सहायता से संपर्क करें',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    success: 'सेटिंग्स सफलतापूर्वक सहेजी गईं',
    error: 'सेटिंग्स सहेजने में विफल',
    confirmClearCache: 'क्या आप वाकई सभी कैश्ड डेटा साफ़ करना चाहते हैं?',
    confirmExportData: 'अपना सारा डेटा निर्यात करें?',
    locationDetected: 'स्थान सफलतापूर्वक पहचाना गया',
    locationError: 'स्थान पहचानने में विफल',
    notificationPermission: 'सूचना अनुमति आवश्यक',
  },
};

const SettingsPage: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const { locationData, setManualLocation, refreshLocation } = useLocation();
  const { clearCache } = useOfflineData();
  const theme = useTheme();
  
  const t = translations[language as keyof typeof translations] || translations.en;
  
  const [settings, setSettings] = useState({
    notifications: {
      enabled: true,
      weatherAlerts: true,
      cropAdvisories: true,
      marketUpdates: false,
    },
    theme: 'light',
    autoLocation: true,
    manualState: '',
    manualDistrict: '',
  });
  
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    message: '',
    action: () => {},
  });
  
  const [alert, setAlert] = useState<{
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
  } | null>(null);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'bn', name: 'বাংলা' },
    { code: 'te', name: 'తెలుగు' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'mr', name: 'मराठी' },
    { code: 'gu', name: 'ગુજરાતી' },
    { code: 'kn', name: 'ಕನ್ನಡ' },
    { code: 'ml', name: 'മലയാളം' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ' },
  ];

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('krishimitra_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    }
  }, []);

  const saveSettings = () => {
    try {
      localStorage.setItem('krishimitra_settings', JSON.stringify(settings));
      setAlert({ type: 'success', message: t.success });
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      setAlert({ type: 'error', message: t.error });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    setAlert({ type: 'success', message: 'Language changed successfully' });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleLocationDetect = async () => {
    try {
      await refreshLocation();
      setAlert({ type: 'success', message: t.locationDetected });
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      setAlert({ type: 'error', message: t.locationError });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const handleManualLocationSet = () => {
    if (settings.manualState && settings.manualDistrict) {
      setManualLocation(settings.manualState, settings.manualDistrict);
      setAlert({ type: 'success', message: 'Location set successfully' });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const handleClearCache = () => {
    setConfirmDialog({
      open: true,
      title: 'Clear Cache',
      message: t.confirmClearCache,
      action: () => {
        clearCache();
        setAlert({ type: 'success', message: 'Cache cleared successfully' });
        setTimeout(() => setAlert(null), 3000);
        setConfirmDialog(prev => ({ ...prev, open: false }));
      },
    });
  };

  const handleExportData = () => {
    setConfirmDialog({
      open: true,
      title: 'Export Data',
      message: t.confirmExportData,
      action: () => {
        // Export data logic here
        const data = {
          settings,
          locationData,
          cachedData: localStorage.getItem('krishimitra_cache'),
          timestamp: new Date().toISOString(),
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `krishimitra-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        setAlert({ type: 'success', message: 'Data exported successfully' });
        setTimeout(() => setAlert(null), 3000);
        setConfirmDialog(prev => ({ ...prev, open: false }));
      },
    });
  };

  const getCacheSize = () => {
    try {
      let totalSize = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key) && key.startsWith('krishimitra_')) {
          totalSize += localStorage[key].length;
        }
      }
      return `${(totalSize / 1024).toFixed(2)} KB`;
    } catch (error) {
      return 'Unknown';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t.title}
      </Typography>
      
      {alert && (
        <Alert severity={alert.type} sx={{ mb: 3 }}>
          {alert.message}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        {/* Language Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LanguageIcon sx={{ mr: 1 }} />
                <Typography variant="h6">{t.language}</Typography>
              </Box>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>{t.selectLanguage}</InputLabel>
                <Select
                  value={language}
                  label={t.selectLanguage}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                >
                  {languages.map((lang) => (
                    <MenuItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <Typography variant="body2" color="text.secondary">
                {t.currentLanguage}: {languages.find(l => l.code === language)?.name}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Location Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationIcon sx={{ mr: 1 }} />
                <Typography variant="h6">{t.location}</Typography>
              </Box>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.autoLocation}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      autoLocation: e.target.checked 
                    }))}
                  />
                }
                label={t.autoDetect}
                sx={{ mb: 2 }}
              />
              
              {settings.autoLocation ? (
                <Box>
                  <Typography variant="body2" gutterBottom>
                    {t.currentLocation}: {
                      locationData.district && locationData.state
                        ? `${locationData.district}, ${locationData.state}`
                        : locationData.coordinates
                        ? `${locationData.coordinates.latitude.toFixed(2)}, ${locationData.coordinates.longitude.toFixed(2)}`
                        : 'Not set'
                    }
                  </Typography>
                  <Button 
                    variant="outlined" 
                    onClick={handleLocationDetect}
                    disabled={locationData.isLoading}
                  >
                    {locationData.isLoading ? 'Detecting...' : 'Detect Location'}
                  </Button>
                </Box>
              ) : (
                <Box>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>{t.state}</InputLabel>
                    <Select
                      value={settings.manualState}
                      label={t.state}
                      onChange={(e) => setSettings(prev => ({ 
                        ...prev, 
                        manualState: e.target.value 
                      }))}
                    >
                      {indianStates.map((state) => (
                        <MenuItem key={state} value={state}>
                          {state}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <TextField
                    fullWidth
                    label={t.district}
                    value={settings.manualDistrict}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      manualDistrict: e.target.value 
                    }))}
                    sx={{ mb: 2 }}
                  />
                  
                  <Button 
                    variant="outlined" 
                    onClick={handleManualLocationSet}
                    disabled={!settings.manualState || !settings.manualDistrict}
                  >
                    {t.setLocation}
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Notification Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <NotificationIcon sx={{ mr: 1 }} />
                <Typography variant="h6">{t.notifications}</Typography>
              </Box>
              
              <List>
                <ListItem>
                  <ListItemText primary={t.enableNotifications} />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.notifications.enabled}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        notifications: {
                          ...prev.notifications,
                          enabled: e.target.checked
                        }
                      }))}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemText primary={t.weatherAlerts} />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.notifications.weatherAlerts}
                      disabled={!settings.notifications.enabled}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        notifications: {
                          ...prev.notifications,
                          weatherAlerts: e.target.checked
                        }
                      }))}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemText primary={t.cropAdvisories} />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.notifications.cropAdvisories}
                      disabled={!settings.notifications.enabled}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        notifications: {
                          ...prev.notifications,
                          cropAdvisories: e.target.checked
                        }
                      }))}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemText primary={t.marketUpdates} />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.notifications.marketUpdates}
                      disabled={!settings.notifications.enabled}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        notifications: {
                          ...prev.notifications,
                          marketUpdates: e.target.checked
                        }
                      }))}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Theme Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ThemeIcon sx={{ mr: 1 }} />
                <Typography variant="h6">{t.theme}</Typography>
              </Box>
              
              <FormControl fullWidth>
                <InputLabel>Theme</InputLabel>
                <Select
                  value={settings.theme}
                  label="Theme"
                  onChange={(e) => setSettings(prev => ({ 
                    ...prev, 
                    theme: e.target.value 
                  }))}
                >
                  <MenuItem value="light">{t.lightTheme}</MenuItem>
                  <MenuItem value="dark">{t.darkTheme}</MenuItem>
                  <MenuItem value="system">{t.systemTheme}</MenuItem>
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>

        {/* Storage Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <StorageIcon sx={{ mr: 1 }} />
                <Typography variant="h6">{t.storage}</Typography>
              </Box>
              
              <Typography variant="body2" gutterBottom>
                {t.cacheSize}: {getCacheSize()}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<DeleteIcon />}
                  onClick={handleClearCache}
                  size="small"
                >
                  {t.clearCache}
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={handleExportData}
                  size="small"
                >
                  {t.exportData}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Security Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SecurityIcon sx={{ mr: 1 }} />
                <Typography variant="h6">{t.security}</Typography>
              </Box>
              
              <List>
                <ListItem button>
                  <ListItemText primary={t.changePassword} />
                </ListItem>
                
                <ListItem>
                  <ListItemText primary={t.twoFactorAuth} />
                  <ListItemSecondaryAction>
                    <Switch />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* About */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <InfoIcon sx={{ mr: 1 }} />
                <Typography variant="h6">{t.about}</Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    {t.appVersion}
                  </Typography>
                  <Typography variant="body1">1.0.0</Typography>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    {t.buildNumber}
                  </Typography>
                  <Typography variant="body1">2024.01.001</Typography>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    {t.lastUpdated}
                  </Typography>
                  <Typography variant="body1">
                    {new Date().toLocaleDateString()}
                  </Typography>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button variant="text" size="small">
                  {t.privacyPolicy}
                </Button>
                <Button variant="text" size="small">
                  {t.termsOfService}
                </Button>
                <Button variant="text" size="small">
                  {t.contactSupport}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Save Button */}
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={saveSettings}
          sx={{ minWidth: 200 }}
        >
          {t.save}
        </Button>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog(prev => ({ ...prev, open: false }))}
      >
        <DialogTitle>{confirmDialog.title}</DialogTitle>
        <DialogContent>
          <Typography>{confirmDialog.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(prev => ({ ...prev, open: false }))}>
            {t.cancel}
          </Button>
          <Button onClick={confirmDialog.action} variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SettingsPage;