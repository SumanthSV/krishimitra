import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  CircularProgress,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext.tsx';
import AuthService from '../services/AuthService.ts';

const ResetPasswordPage: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [tokenValid, setTokenValid] = useState(true);

  // Validate token on mount
  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      setError(t('resetPassword.invalidToken'));
    }
  }, [token, t]);

  const validateForm = (): boolean => {
    let isValid = true;

    // Reset errors
    setPasswordError('');
    setConfirmPasswordError('');
    setError(null);

    // Validate password
    if (!password) {
      setPasswordError(t('resetPassword.passwordRequired'));
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError(t('resetPassword.passwordLength'));
      isValid = false;
    }

    // Validate confirm password
    if (!confirmPassword) {
      setConfirmPasswordError(t('resetPassword.confirmPasswordRequired'));
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError(t('resetPassword.passwordsDoNotMatch'));
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError(t('resetPassword.invalidToken'));
      return;
    }

    if (validateForm()) {
      try {
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        const response = await AuthService.resetPassword(token, password);
        
        if (response.success) {
          setSuccess(response.message || t('resetPassword.successMessage'));
          // Clear the form
          setPassword('');
          setConfirmPassword('');
          
          // Redirect to login after 3 seconds
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } else {
          setError(response.message || t('resetPassword.errorMessage'));
        }
      } catch (err: any) {
        setError(err.message || t('resetPassword.errorMessage'));
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  if (!tokenValid) {
    return (
      <Container component="main" maxWidth="xs">
        <Paper
          elevation={3}
          sx={{
            mt: 8,
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 2,
          }}
        >
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            {t('resetPassword.title')}
          </Typography>

          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {t('resetPassword.invalidToken')}
          </Alert>

          <Box sx={{ mt: 3 }}>
            <Link component={RouterLink} to="/forgot-password" variant="body2">
              {t('resetPassword.requestNewLink')}
            </Link>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={3}
        sx={{
          mt: 8,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 2,
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          {t('resetPassword.title')}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
          {t('resetPassword.description')}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label={t('resetPassword.newPassword')}
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!passwordError}
            helperText={passwordError}
            disabled={isLoading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={toggleShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
              dir: language === 'ar' ? 'rtl' : 'ltr',
            }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label={t('resetPassword.confirmPassword')}
            type={showPassword ? 'text' : 'password'}
            id="confirmPassword"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={!!confirmPasswordError}
            helperText={confirmPasswordError}
            disabled={isLoading}
            InputProps={{
              dir: language === 'ar' ? 'rtl' : 'ltr',
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, bgcolor: 'primary.main', color: 'white' }}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              t('resetPassword.submit')
            )}
          </Button>

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Link component={RouterLink} to="/login" variant="body2">
              {t('resetPassword.backToLogin')}
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ResetPasswordPage;