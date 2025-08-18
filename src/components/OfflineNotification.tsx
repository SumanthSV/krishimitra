import React from 'react';
import { Alert, Snackbar, Typography } from '@mui/material';
import { useLanguage } from '../contexts/LanguageContext.tsx';

const translations = {
  en: {
    offline: 'You are currently offline',
    offlineFeatures: 'You can still access saved information and use basic features',
  },
  hi: {
    offline: 'आप वर्तमान में ऑफलाइन हैं',
    offlineFeatures: 'आप अभी भी सहेजी गई जानकारी तक पहुंच सकते हैं और बुनियादी सुविधाओं का उपयोग कर सकते हैं',
  },
  // Add more languages as needed
};

const OfflineNotification: React.FC = () => {
  const [open, setOpen] = React.useState(true);
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.en;

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Snackbar 
      open={open} 
      onClose={handleClose} 
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert 
        onClose={handleClose} 
        severity="warning" 
        variant="filled"
        sx={{ width: '100%' }}
      >
        <Typography variant="body1">
          {t.offline}
        </Typography>
        <Typography variant="body2">
          {t.offlineFeatures}
        </Typography>
      </Alert>
    </Snackbar>
  );
};

export default OfflineNotification;