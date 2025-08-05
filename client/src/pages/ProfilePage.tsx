import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Avatar,
  CircularProgress,
  Alert,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Tabs,
  Tab,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Person as PersonIcon,
  Edit as EditIcon,
  Visibility,
  VisibilityOff,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext.tsx';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext.tsx';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { user, isLoading: authLoading } = useAuth();
  
  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    profile: {
      farmSize: 0,
      farmLocation: {
        state: '',
        district: '',
        village: '',
      },
      crops: [] as string[],
      experience: 0,
      preferredLanguage: '',
    },
  });
  
  // Form errors
  const [formErrors, setFormErrors] = useState({
    name: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    'profile.farmSize': '',
    'profile.farmLocation.state': '',
    'profile.farmLocation.district': '',
    'profile.farmLocation.village': '',
    'profile.experience': '',
  });

  // Indian states for dropdown
  const indianStates = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
  ];

  // Sample districts for each state (simplified for demo)
  const getDistricts = (state: string) => {
    const districtMap: { [key: string]: string[] } = {
      'Andhra Pradesh': ['Anantapur', 'Chittoor', 'East Godavari', 'Guntur', 'Krishna'],
      'Gujarat': ['Ahmedabad', 'Amreli', 'Anand', 'Bharuch', 'Bhavnagar'],
      'Karnataka': ['Bangalore', 'Belgaum', 'Bellary', 'Bidar', 'Bijapur'],
      'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik'],
      'Punjab': ['Amritsar', 'Barnala', 'Bathinda', 'Faridkot', 'Fatehgarh Sahib'],
      'Uttar Pradesh': ['Agra', 'Aligarh', 'Allahabad', 'Ambedkar Nagar', 'Amethi'],
    };

    return districtMap[state] || ['Select state first'];
  };

  // Common crops in India
  const commonCrops = [
    'Rice',
    'Wheat',
    'Maize',
    'Jowar (Sorghum)',
    'Bajra (Pearl Millet)',
    'Cotton',
    'Sugarcane',
    'Pulses',
    'Groundnut',
    'Soybean',
    'Mustard',
    'Sunflower',
    'Potato',
    'Onion',
    'Tomato',
    'Chilli',
    'Turmeric',
    'Ginger',
    'Banana',
    'Mango',
  ];

  // Initialize form data with user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        profile: {
          farmSize: user.profile?.farmSize || 0,
          farmLocation: {
            state: user.profile?.farmLocation?.state || '',
            district: user.profile?.farmLocation?.district || '',
            village: user.profile?.farmLocation?.village || '',
          },
          crops: user.profile?.crops || [],
          experience: user.profile?.experience || 0,
          preferredLanguage: user.profile?.preferredLanguage || language,
        },
      });
    }
  }, [user, language]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    // Reset form errors and messages when changing tabs
    setFormErrors({
      name: '',
      phone: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      'profile.farmSize': '',
      'profile.farmLocation.state': '',
      'profile.farmLocation.district': '',
      'profile.farmLocation.village': '',
      'profile.experience': '',
    });
    setError(null);
    setSuccess(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;

    if (!name) return;

    if (name.includes('.')) {
      const keys = name.split('.');
      if (keys.length === 3 && keys[0] === 'profile' && keys[1] === 'farmLocation') {
        setFormData({
          ...formData,
          profile: {
            ...formData.profile,
            farmLocation: {
              ...formData.profile.farmLocation,
              [keys[2]]: value as string,
            },
          },
        });
      } else if (keys.length === 2 && keys[0] === 'profile') {
        setFormData({
          ...formData,
          profile: {
            ...formData.profile,
            [keys[1]]: value,
          },
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    // Clear error for this field if it exists
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors({
        ...formErrors,
        [name]: '',
      });
    }
  };

  const handleCropChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setFormData({
      ...formData,
      profile: {
        ...formData.profile,
        crops: e.target.value as string[],
      },
    });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    // Reset form errors and messages when toggling edit mode
    setFormErrors({
      name: '',
      phone: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      'profile.farmSize': '',
      'profile.farmLocation.state': '',
      'profile.farmLocation.district': '',
      'profile.farmLocation.village': '',
      'profile.experience': '',
    });
    setError(null);
    setSuccess(null);
  };

  const validateProfileForm = (): boolean => {
    let isValid = true;
    const newErrors = { ...formErrors };

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = t('profile.nameRequired');
      isValid = false;
    }

    // Validate phone
    if (!formData.phone) {
      newErrors.phone = t('profile.phoneRequired');
      isValid = false;
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = t('profile.invalidPhone');
      isValid = false;
    }

    // Validate farm details if user is a farmer
    if (user?.role === 'farmer') {
      if (formData.profile.farmSize < 0) {
        newErrors['profile.farmSize'] = t('profile.invalidFarmSize');
        isValid = false;
      }

      if (!formData.profile.farmLocation.state) {
        newErrors['profile.farmLocation.state'] = t('profile.stateRequired');
        isValid = false;
      }

      if (!formData.profile.farmLocation.district) {
        newErrors['profile.farmLocation.district'] = t('profile.districtRequired');
        isValid = false;
      }

      if (formData.profile.experience < 0) {
        newErrors['profile.experience'] = t('profile.invalidExperience');
        isValid = false;
      }
    }

    setFormErrors(newErrors);
    return isValid;
  };

  const validatePasswordForm = (): boolean => {
    let isValid = true;
    const newErrors = { ...formErrors };

    // Validate current password
    if (!formData.currentPassword) {
      newErrors.currentPassword = t('profile.currentPasswordRequired');
      isValid = false;
    }

    // Validate new password
    if (!formData.newPassword) {
      newErrors.newPassword = t('profile.newPasswordRequired');
      isValid = false;
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = t('profile.passwordLength');
      isValid = false;
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t('profile.confirmPasswordRequired');
      isValid = false;
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = t('profile.passwordsDoNotMatch');
      isValid = false;
    }

    setFormErrors(newErrors);
    return isValid;
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateProfileForm()) return;

    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      // Mock API call - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate successful update
      setSuccess(t('profile.updateSuccess'));
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || t('profile.updateError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePasswordForm()) return;

    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      // Mock API call - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate successful update
      setSuccess(t('profile.passwordUpdateSuccess'));
      
      // Reset password fields
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err: any) {
      setError(err.message || t('profile.passwordUpdateError'));
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            sx={{ width: 80, height: 80, mr: 3, bgcolor: 'primary.main' }}
            src={user.profile?.avatar || undefined}
          >
            {!user.profile?.avatar && <PersonIcon fontSize="large" />}
          </Avatar>
          <Box>
            <Typography variant="h5" component="h1">
              {user.name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {user.role === 'farmer'
                ? t('profile.farmer')
                : user.role === 'advisor'
                ? t('profile.advisor')
                : t('profile.vendor')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('profile.memberSince')}: {new Date(user.lastLogin || Date.now()).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="profile tabs"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label={t('profile.personalInfo')} id="profile-tab-0" aria-controls="profile-tabpanel-0" />
          <Tab label={t('profile.security')} id="profile-tab-1" aria-controls="profile-tabpanel-1" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            {isEditing ? (
              <Button
                startIcon={<CancelIcon />}
                onClick={handleEditToggle}
                color="inherit"
                disabled={isLoading}
              >
                {t('profile.cancel')}
              </Button>
            ) : (
              <Button
                startIcon={<EditIcon />}
                onClick={handleEditToggle}
                color="primary"
                variant="outlined"
              >
                {t('profile.edit')}
              </Button>
            )}
          </Box>

          <Box component="form" onSubmit={handleProfileUpdate}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('profile.name')}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing || isLoading}
                  error={!!formErrors.name}
                  helperText={formErrors.name}
                  inputProps={{
                    dir: language === 'ar' ? 'rtl' : 'ltr',
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('profile.email')}
                  name="email"
                  value={formData.email}
                  disabled={true} // Email cannot be changed
                  inputProps={{
                    dir: language === 'ar' ? 'rtl' : 'ltr',
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('profile.phone')}
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing || isLoading}
                  error={!!formErrors.phone}
                  helperText={formErrors.phone}
                  inputProps={{
                    dir: 'ltr',
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth disabled={!isEditing || isLoading}>
                  <InputLabel id="language-label">{t('profile.preferredLanguage')}</InputLabel>
                  <Select
                    labelId="language-label"
                    id="preferredLanguage"
                    name="profile.preferredLanguage"
                    value={formData.profile.preferredLanguage}
                    label={t('profile.preferredLanguage')}
                    onChange={handleChange}
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="hi">हिन्दी (Hindi)</MenuItem>
                    <MenuItem value="bn">বাংলা (Bengali)</MenuItem>
                    <MenuItem value="te">తెలుగు (Telugu)</MenuItem>
                    <MenuItem value="ta">தமிழ் (Tamil)</MenuItem>
                    <MenuItem value="mr">मराठी (Marathi)</MenuItem>
                    <MenuItem value="gu">ગુજરાતી (Gujarati)</MenuItem>
                    <MenuItem value="kn">ಕನ್ನಡ (Kannada)</MenuItem>
                    <MenuItem value="ml">മലയാളം (Malayalam)</MenuItem>
                    <MenuItem value="pa">ਪੰਜਾਬੀ (Punjabi)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {user.role === 'farmer' && (
                <>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        {t('profile.farmDetails')}
                      </Typography>
                    </Divider>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label={t('profile.farmSize')}
                      name="profile.farmSize"
                      type="number"
                      value={formData.profile.farmSize}
                      onChange={handleChange}
                      disabled={!isEditing || isLoading}
                      error={!!formErrors['profile.farmSize']}
                      helperText={
                        formErrors['profile.farmSize'] ||
                        t('profile.farmSizeHelperText')
                      }
                      InputProps={{
                        endAdornment: <InputAdornment position="end">acres</InputAdornment>,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label={t('profile.experience')}
                      name="profile.experience"
                      type="number"
                      value={formData.profile.experience}
                      onChange={handleChange}
                      disabled={!isEditing || isLoading}
                      error={!!formErrors['profile.experience']}
                      helperText={
                        formErrors['profile.experience'] ||
                        t('profile.experienceHelperText')
                      }
                      InputProps={{
                        endAdornment: <InputAdornment position="end">years</InputAdornment>,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <FormControl
                      fullWidth
                      error={!!formErrors['profile.farmLocation.state']}
                      disabled={!isEditing || isLoading}
                    >
                      <InputLabel id="state-label">{t('profile.state')}</InputLabel>
                      <Select
                        labelId="state-label"
                        id="state"
                        name="profile.farmLocation.state"
                        value={formData.profile.farmLocation.state}
                        label={t('profile.state')}
                        onChange={handleChange}
                      >
                        {indianStates.map((state) => (
                          <MenuItem key={state} value={state}>
                            {state}
                          </MenuItem>
                        ))}
                      </Select>
                      {formErrors['profile.farmLocation.state'] && (
                        <FormHelperText>{formErrors['profile.farmLocation.state']}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <FormControl
                      fullWidth
                      error={!!formErrors['profile.farmLocation.district']}
                      disabled={!isEditing || isLoading || !formData.profile.farmLocation.state}
                    >
                      <InputLabel id="district-label">{t('profile.district')}</InputLabel>
                      <Select
                        labelId="district-label"
                        id="district"
                        name="profile.farmLocation.district"
                        value={formData.profile.farmLocation.district}
                        label={t('profile.district')}
                        onChange={handleChange}
                      >
                        {getDistricts(formData.profile.farmLocation.state).map((district) => (
                          <MenuItem key={district} value={district}>
                            {district}
                          </MenuItem>
                        ))}
                      </Select>
                      {formErrors['profile.farmLocation.district'] && (
                        <FormHelperText>{formErrors['profile.farmLocation.district']}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label={t('profile.village')}
                      name="profile.farmLocation.village"
                      value={formData.profile.farmLocation.village}
                      onChange={handleChange}
                      disabled={!isEditing || isLoading}
                      error={!!formErrors['profile.farmLocation.village']}
                      helperText={formErrors['profile.farmLocation.village']}
                      inputProps={{
                        dir: language === 'ar' ? 'rtl' : 'ltr',
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth disabled={!isEditing || isLoading}>
                      <InputLabel id="crops-label">{t('profile.crops')}</InputLabel>
                      <Select
                        labelId="crops-label"
                        id="crops"
                        multiple
                        value={formData.profile.crops}
                        onChange={handleCropChange}
                        label={t('profile.crops')}
                        renderValue={(selected) => (selected as string[]).join(', ')}
                      >
                        {commonCrops.map((crop) => (
                          <MenuItem key={crop} value={crop}>
                            {crop}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>{t('profile.cropsHelperText')}</FormHelperText>
                    </FormControl>
                  </Grid>
                </>
              )}

              {isEditing && (
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isLoading}
                    startIcon={isLoading ? <CircularProgress size={20} /> : <SaveIcon />}
                  >
                    {t('profile.saveChanges')}
                  </Button>
                </Grid>
              )}
            </Grid>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Typography variant="h6" gutterBottom>
            {t('profile.changePassword')}
          </Typography>

          <Box component="form" onSubmit={handlePasswordUpdate} sx={{ mt: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t('profile.currentPassword')}
                  name="currentPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.currentPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                  error={!!formErrors.currentPassword}
                  helperText={formErrors.currentPassword}
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
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t('profile.newPassword')}
                  name="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.newPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                  error={!!formErrors.newPassword}
                  helperText={formErrors.newPassword}
                  InputProps={{
                    dir: language === 'ar' ? 'rtl' : 'ltr',
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t('profile.confirmPassword')}
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                  error={!!formErrors.confirmPassword}
                  helperText={formErrors.confirmPassword}
                  InputProps={{
                    dir: language === 'ar' ? 'rtl' : 'ltr',
                  }}
                />
              </Grid>

              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isLoading}
                  startIcon={isLoading ? <CircularProgress size={20} /> : <SaveIcon />}
                >
                  {t('profile.updatePassword')}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default ProfilePage;