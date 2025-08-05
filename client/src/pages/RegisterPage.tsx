import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext.tsx';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext.tsx';

interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: 'farmer' | 'advisor' | 'vendor' | 'financier' | 'agri_expert' | 'government_officer';
  profile: {
    // Common fields
    preferredLanguage: string;
    
    // Farmer-specific fields
    farmLocation?: {
      state: string;
      district: string;
      village?: string;
    };
    farmSize?: number;
    farmParcels?: number;
    farmingType?: 'crop' | 'livestock' | 'mixed' | 'other';
    hasIrrigation?: boolean;
    hasSmartphone?: boolean;
    
    // Financier-specific fields
    organizationName?: string;
    operationAreas?: string[];
    loanTypes?: string[];
    
    // Vendor-specific fields
    businessName?: string;
    productTypes?: string[];
    operatingLocations?: string[];
  };
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
  
  // Farmer-specific errors
  'profile.farmLocation.state'?: string;
  'profile.farmLocation.district'?: string;
  'profile.farmLocation.village'?: string;
  'profile.farmSize'?: string;
  'profile.farmParcels'?: string;
  'profile.farmingType'?: string;
  
  // Financier-specific errors
  'profile.organizationName'?: string;
  'profile.operationAreas'?: string;
  'profile.loanTypes'?: string;
  
  // Vendor-specific errors
  'profile.businessName'?: string;
  'profile.productTypes'?: string;
  'profile.operatingLocations'?: string;
}

const RegisterPage: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { register, isAuthenticated, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'farmer',
    profile: {
      farmLocation: {
        state: '',
        district: '',
        village: '',
      },
      farmSize: 0,
      farmParcels: 1,
      farmingType: 'crop',
      hasIrrigation: false,
      hasSmartphone: true,
      organizationName: '',
      operationAreas: [],
      loanTypes: [],
      businessName: '',
      productTypes: [],
      operatingLocations: [],
      preferredLanguage: language,
    },
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

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

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
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors({
        ...formErrors,
        [name]: undefined,
      });
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const validateStep = (step: number): boolean => {
    let isValid = true;
    const newErrors: FormErrors = {};

    if (step === 0) {
      // Validate personal information
      if (!formData.name.trim()) {
        newErrors.name = t('register.nameRequired');
        isValid = false;
      }

      if (!formData.email) {
        newErrors.email = t('register.emailRequired');
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = t('register.invalidEmail');
        isValid = false;
      }

      if (!formData.phone) {
        newErrors.phone = t('register.phoneRequired');
        isValid = false;
      } else if (!/^[0-9]{10}$/.test(formData.phone)) {
        newErrors.phone = t('register.invalidPhone');
        isValid = false;
      }

      if (!formData.password) {
        newErrors.password = t('register.passwordRequired');
        isValid = false;
      } else if (formData.password.length < 8) {
        newErrors.password = t('register.passwordLength');
        isValid = false;
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = t('register.confirmPasswordRequired');
        isValid = false;
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = t('register.passwordsDoNotMatch');
        isValid = false;
      }
    } else if (step === 1) {
      // Validate role and role-specific fields
      if (!formData.role) {
        newErrors.role = t('register.roleRequired');
        isValid = false;
      }

      if (formData.role === 'farmer') {
        if (!formData.profile.farmLocation?.state) {
          newErrors['profile.farmLocation.state'] = t('register.stateRequired');
          isValid = false;
        }

        if (!formData.profile.farmLocation?.district) {
          newErrors['profile.farmLocation.district'] = t('register.districtRequired');
          isValid = false;
        }
        
        if (formData.profile.farmSize === undefined || formData.profile.farmSize < 0) {
          newErrors['profile.farmSize'] = t('register.farmSizeRequired');
          isValid = false;
        }
        
        if (formData.profile.farmParcels === undefined || formData.profile.farmParcels < 1) {
          newErrors['profile.farmParcels'] = t('register.farmParcelsRequired');
          isValid = false;
        }
        
        if (!formData.profile.farmingType) {
          newErrors['profile.farmingType'] = t('register.farmingTypeRequired');
          isValid = false;
        }
      } else if (formData.role === 'financier') {
        if (!formData.profile.organizationName) {
          newErrors['profile.organizationName'] = t('register.organizationNameRequired');
          isValid = false;
        }
        
        if (!formData.profile.operationAreas || formData.profile.operationAreas.length === 0) {
          newErrors['profile.operationAreas'] = t('register.operationAreasRequired');
          isValid = false;
        }
      } else if (formData.role === 'vendor') {
        if (!formData.profile.businessName) {
          newErrors['profile.businessName'] = t('register.businessNameRequired');
          isValid = false;
        }
        
        if (!formData.profile.productTypes || formData.profile.productTypes.length === 0) {
          newErrors['profile.productTypes'] = t('register.productTypesRequired');
          isValid = false;
        }
      }
    }

    setFormErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateStep(activeStep)) {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...registrationData } = formData;
      await register(registrationData);
    }
  };

  const steps = [t('register.step1'), t('register.step2'), t('register.review')];

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label={t('register.name')}
              name="name"
              autoComplete="name"
              autoFocus
              value={formData.name}
              onChange={handleChange}
              error={!!formErrors.name}
              helperText={formErrors.name}
              disabled={isLoading}
              inputProps={{
                dir: language === 'ar' ? 'rtl' : 'ltr',
              }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label={t('register.email')}
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              error={!!formErrors.email}
              helperText={formErrors.email}
              disabled={isLoading}
              inputProps={{
                dir: language === 'ar' ? 'rtl' : 'ltr',
              }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="phone"
              label={t('register.phone')}
              name="phone"
              autoComplete="tel"
              value={formData.phone}
              onChange={handleChange}
              error={!!formErrors.phone}
              helperText={formErrors.phone}
              disabled={isLoading}
              inputProps={{
                dir: 'ltr',
              }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label={t('register.password')}
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              error={!!formErrors.password}
              helperText={formErrors.password}
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
              label={t('register.confirmPassword')}
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!formErrors.confirmPassword}
              helperText={formErrors.confirmPassword}
              disabled={isLoading}
              InputProps={{
                dir: language === 'ar' ? 'rtl' : 'ltr',
              }}
            />
          </>
        );

      case 1:
        return (
          <>
            <FormControl fullWidth margin="normal" error={!!formErrors.role}>
              <InputLabel id="role-label">{t('register.role')}</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                name="role"
                value={formData.role}
                label={t('register.role')}
                onChange={handleChange}
                disabled={isLoading}
              >
                <MenuItem value="farmer">{t('register.farmer')}</MenuItem>
                <MenuItem value="financier">{t('register.financier')}</MenuItem>
                <MenuItem value="vendor">{t('register.vendor')}</MenuItem>
                <MenuItem value="advisor">{t('register.advisor')}</MenuItem>
                <MenuItem value="agri_expert">{t('register.agriExpert')}</MenuItem>
                <MenuItem value="government_officer">{t('register.governmentOfficer')}</MenuItem>
              </Select>
              {formErrors.role && <FormHelperText>{formErrors.role}</FormHelperText>}
            </FormControl>

            {/* Farmer-specific fields */}
            {formData.role === 'farmer' && (
              <>
                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                  {t('register.farmerDetails')}
                </Typography>
                
                <FormControl
                  fullWidth
                  margin="normal"
                  error={!!formErrors['profile.farmLocation.state']}
                >
                  <InputLabel id="state-label">{t('register.state')}</InputLabel>
                  <Select
                    labelId="state-label"
                    id="state"
                    name="profile.farmLocation.state"
                    value={formData.profile.farmLocation?.state || ''}
                    label={t('register.state')}
                    onChange={handleChange}
                    disabled={isLoading}
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

                <FormControl
                  fullWidth
                  margin="normal"
                  error={!!formErrors['profile.farmLocation.district']}
                  disabled={!formData.profile.farmLocation?.state}
                >
                  <InputLabel id="district-label">{t('register.district')}</InputLabel>
                  <Select
                    labelId="district-label"
                    id="district"
                    name="profile.farmLocation.district"
                    value={formData.profile.farmLocation?.district || ''}
                    label={t('register.district')}
                    onChange={handleChange}
                    disabled={isLoading || !formData.profile.farmLocation?.state}
                  >
                    {getDistricts(formData.profile.farmLocation?.state || '').map((district) => (
                      <MenuItem key={district} value={district}>
                        {district}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors['profile.farmLocation.district'] && (
                    <FormHelperText>{formErrors['profile.farmLocation.district']}</FormHelperText>
                  )}
                </FormControl>
                
                <TextField
                  margin="normal"
                  fullWidth
                  id="village"
                  label={t('register.village')}
                  name="profile.farmLocation.village"
                  value={formData.profile.farmLocation?.village || ''}
                  onChange={handleChange}
                  error={!!formErrors['profile.farmLocation.village']}
                  helperText={formErrors['profile.farmLocation.village']}
                  disabled={isLoading}
                />
                
                <TextField
                  margin="normal"
                  fullWidth
                  id="farmSize"
                  label={t('register.farmSize')}
                  name="profile.farmSize"
                  type="number"
                  value={formData.profile.farmSize}
                  onChange={handleChange}
                  error={!!formErrors['profile.farmSize']}
                  helperText={formErrors['profile.farmSize']}
                  disabled={isLoading}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">{t('register.acres')}</InputAdornment>,
                  }}
                />
                
                <TextField
                  margin="normal"
                  fullWidth
                  id="farmParcels"
                  label={t('register.farmParcels')}
                  name="profile.farmParcels"
                  type="number"
                  value={formData.profile.farmParcels}
                  onChange={handleChange}
                  error={!!formErrors['profile.farmParcels']}
                  helperText={formErrors['profile.farmParcels']}
                  disabled={isLoading}
                />
                
                <FormControl fullWidth margin="normal" error={!!formErrors['profile.farmingType']}>
                  <InputLabel id="farmingType-label">{t('register.farmingType')}</InputLabel>
                  <Select
                    labelId="farmingType-label"
                    id="farmingType"
                    name="profile.farmingType"
                    value={formData.profile.farmingType || 'crop'}
                    label={t('register.farmingType')}
                    onChange={handleChange}
                    disabled={isLoading}
                  >
                    <MenuItem value="crop">{t('register.cropFarming')}</MenuItem>
                    <MenuItem value="livestock">{t('register.livestockFarming')}</MenuItem>
                    <MenuItem value="mixed">{t('register.mixedFarming')}</MenuItem>
                    <MenuItem value="other">{t('register.otherFarming')}</MenuItem>
                  </Select>
                  {formErrors['profile.farmingType'] && (
                    <FormHelperText>{formErrors['profile.farmingType']}</FormHelperText>
                  )}
                </FormControl>
                
                <FormControl fullWidth margin="normal">
                  <InputLabel id="irrigation-label">{t('register.hasIrrigation')}</InputLabel>
                  <Select
                    labelId="irrigation-label"
                    id="hasIrrigation"
                    name="profile.hasIrrigation"
                    value={formData.profile.hasIrrigation ? 'yes' : 'no'}
                    label={t('register.hasIrrigation')}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        profile: {
                          ...formData.profile,
                          hasIrrigation: e.target.value === 'yes',
                        },
                      });
                    }}
                    disabled={isLoading}
                  >
                    <MenuItem value="yes">{t('register.yes')}</MenuItem>
                    <MenuItem value="no">{t('register.no')}</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl fullWidth margin="normal">
                  <InputLabel id="smartphone-label">{t('register.hasSmartphone')}</InputLabel>
                  <Select
                    labelId="smartphone-label"
                    id="hasSmartphone"
                    name="profile.hasSmartphone"
                    value={formData.profile.hasSmartphone ? 'yes' : 'no'}
                    label={t('register.hasSmartphone')}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        profile: {
                          ...formData.profile,
                          hasSmartphone: e.target.value === 'yes',
                        },
                      });
                    }}
                    disabled={isLoading}
                  >
                    <MenuItem value="yes">{t('register.yes')}</MenuItem>
                    <MenuItem value="no">{t('register.no')}</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}
            
            {/* Financier-specific fields */}
            {formData.role === 'financier' && (
              <>
                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                  {t('register.financierDetails')}
                </Typography>
                
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="organizationName"
                  label={t('register.organizationName')}
                  name="profile.organizationName"
                  value={formData.profile.organizationName || ''}
                  onChange={handleChange}
                  error={!!formErrors['profile.organizationName']}
                  helperText={formErrors['profile.organizationName']}
                  disabled={isLoading}
                />
                
                <FormControl fullWidth margin="normal" error={!!formErrors['profile.operationAreas']}>
                  <InputLabel id="operationAreas-label">{t('register.operationAreas')}</InputLabel>
                  <Select
                    labelId="operationAreas-label"
                    id="operationAreas"
                    name="profile.operationAreas"
                    multiple
                    value={formData.profile.operationAreas || []}
                    label={t('register.operationAreas')}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        profile: {
                          ...formData.profile,
                          operationAreas: e.target.value as string[],
                        },
                      });
                    }}
                    disabled={isLoading}
                  >
                    {indianStates.map((state) => (
                      <MenuItem key={state} value={state}>
                        {state}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors['profile.operationAreas'] && (
                    <FormHelperText>{formErrors['profile.operationAreas']}</FormHelperText>
                  )}
                </FormControl>
                
                <FormControl fullWidth margin="normal">
                  <InputLabel id="loanTypes-label">{t('register.loanTypes')}</InputLabel>
                  <Select
                    labelId="loanTypes-label"
                    id="loanTypes"
                    name="profile.loanTypes"
                    multiple
                    value={formData.profile.loanTypes || []}
                    label={t('register.loanTypes')}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        profile: {
                          ...formData.profile,
                          loanTypes: e.target.value as string[],
                        },
                      });
                    }}
                    disabled={isLoading}
                  >
                    <MenuItem value="short_term">{t('register.shortTermLoan')}</MenuItem>
                    <MenuItem value="long_term">{t('register.longTermLoan')}</MenuItem>
                    <MenuItem value="equipment">{t('register.equipmentLoan')}</MenuItem>
                    <MenuItem value="crop">{t('register.cropLoan')}</MenuItem>
                    <MenuItem value="land">{t('register.landLoan')}</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}
            
            {/* Vendor-specific fields */}
            {formData.role === 'vendor' && (
              <>
                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                  {t('register.vendorDetails')}
                </Typography>
                
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="businessName"
                  label={t('register.businessName')}
                  name="profile.businessName"
                  value={formData.profile.businessName || ''}
                  onChange={handleChange}
                  error={!!formErrors['profile.businessName']}
                  helperText={formErrors['profile.businessName']}
                  disabled={isLoading}
                />
                
                <FormControl fullWidth margin="normal" error={!!formErrors['profile.productTypes']}>
                  <InputLabel id="productTypes-label">{t('register.productTypes')}</InputLabel>
                  <Select
                    labelId="productTypes-label"
                    id="productTypes"
                    name="profile.productTypes"
                    multiple
                    value={formData.profile.productTypes || []}
                    label={t('register.productTypes')}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        profile: {
                          ...formData.profile,
                          productTypes: e.target.value as string[],
                        },
                      });
                    }}
                    disabled={isLoading}
                  >
                    <MenuItem value="seeds">{t('register.seeds')}</MenuItem>
                    <MenuItem value="fertilizers">{t('register.fertilizers')}</MenuItem>
                    <MenuItem value="pesticides">{t('register.pesticides')}</MenuItem>
                    <MenuItem value="machinery">{t('register.machinery')}</MenuItem>
                    <MenuItem value="tools">{t('register.tools')}</MenuItem>
                    <MenuItem value="irrigation">{t('register.irrigationEquipment')}</MenuItem>
                  </Select>
                  {formErrors['profile.productTypes'] && (
                    <FormHelperText>{formErrors['profile.productTypes']}</FormHelperText>
                  )}
                </FormControl>
                
                <FormControl fullWidth margin="normal">
                  <InputLabel id="operatingLocations-label">{t('register.operatingLocations')}</InputLabel>
                  <Select
                    labelId="operatingLocations-label"
                    id="operatingLocations"
                    name="profile.operatingLocations"
                    multiple
                    value={formData.profile.operatingLocations || []}
                    label={t('register.operatingLocations')}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        profile: {
                          ...formData.profile,
                          operatingLocations: e.target.value as string[],
                        },
                      });
                    }}
                    disabled={isLoading}
                  >
                    {indianStates.map((state) => (
                      <MenuItem key={state} value={state}>
                        {state}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </>
            )}
            
            {/* Language preference for all roles */}
            <FormControl fullWidth margin="normal">
              <InputLabel id="language-label">{t('register.preferredLanguage')}</InputLabel>
              <Select
                labelId="language-label"
                id="preferredLanguage"
                name="profile.preferredLanguage"
                value={formData.profile.preferredLanguage}
                label={t('register.preferredLanguage')}
                onChange={handleChange}
                disabled={isLoading}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="hi">हिंदी (Hindi)</MenuItem>
                <MenuItem value="pa">ਪੰਜਾਬੀ (Punjabi)</MenuItem>
                <MenuItem value="bn">বাংলা (Bengali)</MenuItem>
                <MenuItem value="te">తెలుగు (Telugu)</MenuItem>
                <MenuItem value="ta">தமிழ் (Tamil)</MenuItem>
                <MenuItem value="mr">मराठी (Marathi)</MenuItem>
                <MenuItem value="gu">ગુજરાતી (Gujarati)</MenuItem>
                <MenuItem value="kn">ಕನ್ನಡ (Kannada)</MenuItem>
                <MenuItem value="ml">മലയാളം (Malayalam)</MenuItem>
              </Select>
            </FormControl>
          </>
        );

      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t('register.reviewTitle')}
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">{t('register.name')}</Typography>
                <Typography variant="body1">{formData.name}</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">{t('register.email')}</Typography>
                <Typography variant="body1">{formData.email}</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">{t('register.phone')}</Typography>
                <Typography variant="body1">{formData.phone}</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">{t('register.role')}</Typography>
                <Typography variant="body1">
                  {formData.role === 'farmer'
                    ? t('register.farmer')
                    : formData.role === 'advisor'
                    ? t('register.advisor')
                    : formData.role === 'vendor'
                    ? t('register.vendor')
                    : formData.role === 'financier'
                    ? t('register.financier')
                    : formData.role === 'agri_expert'
                    ? t('register.agri_expert')
                    : t('register.government_officer')}
                </Typography>
              </Grid>

              {/* Display role-specific fields in review */}
              {formData.role === 'farmer' && (
                <>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" color="primary">{t('register.farmerDetails')}</Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1">{t('register.state')}</Typography>
                    <Typography variant="body1">{formData.profile.farmLocation?.state}</Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1">{t('register.district')}</Typography>
                    <Typography variant="body1">{formData.profile.farmLocation?.district}</Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1">{t('register.village')}</Typography>
                    <Typography variant="body1">{formData.profile.farmLocation?.village || '-'}</Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1">{t('register.farmSize')}</Typography>
                    <Typography variant="body1">{formData.profile.farmSize} {t('register.acres')}</Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1">{t('register.farmParcels')}</Typography>
                    <Typography variant="body1">{formData.profile.farmParcels}</Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1">{t('register.farmingType')}</Typography>
                    <Typography variant="body1">
                      {formData.profile.farmingType === 'crop' ? t('register.cropFarming') :
                       formData.profile.farmingType === 'livestock' ? t('register.livestockFarming') :
                       formData.profile.farmingType === 'mixed' ? t('register.mixedFarming') :
                       t('register.otherFarming')}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1">{t('register.hasIrrigation')}</Typography>
                    <Typography variant="body1">{formData.profile.hasIrrigation ? t('register.yes') : t('register.no')}</Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1">{t('register.hasSmartphone')}</Typography>
                    <Typography variant="body1">{formData.profile.hasSmartphone ? t('register.yes') : t('register.no')}</Typography>
                  </Grid>
                </>
              )}
              
              {formData.role === 'financier' && (
                <>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" color="primary">{t('register.financierDetails')}</Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1">{t('register.organizationName')}</Typography>
                    <Typography variant="body1">{formData.profile.organizationName}</Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1">{t('register.operationAreas')}</Typography>
                    <Typography variant="body1">
                      {formData.profile.operationAreas && formData.profile.operationAreas.length > 0 
                        ? formData.profile.operationAreas.join(', ') 
                        : '-'}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1">{t('register.loanTypes')}</Typography>
                    <Typography variant="body1">
                      {formData.profile.loanTypes && formData.profile.loanTypes.length > 0 
                        ? formData.profile.loanTypes.map(type => {
                            switch(type) {
                              case 'short_term': return t('register.shortTermLoan');
                              case 'long_term': return t('register.longTermLoan');
                              case 'equipment': return t('register.equipmentLoan');
                              case 'crop': return t('register.cropLoan');
                              case 'land': return t('register.landLoan');
                              default: return type;
                            }
                          }).join(', ') 
                        : '-'}
                    </Typography>
                  </Grid>
                </>
              )}
              
              {formData.role === 'vendor' && (
                <>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" color="primary">{t('register.vendorDetails')}</Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1">{t('register.businessName')}</Typography>
                    <Typography variant="body1">{formData.profile.businessName}</Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1">{t('register.productTypes')}</Typography>
                    <Typography variant="body1">
                      {formData.profile.productTypes && formData.profile.productTypes.length > 0 
                        ? formData.profile.productTypes.map(type => {
                            switch(type) {
                              case 'seeds': return t('register.seeds');
                              case 'fertilizers': return t('register.fertilizers');
                              case 'pesticides': return t('register.pesticides');
                              case 'machinery': return t('register.machinery');
                              case 'tools': return t('register.tools');
                              case 'irrigation': return t('register.irrigationEquipment');
                              default: return type;
                            }
                          }).join(', ') 
                        : '-'}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1">{t('register.operatingLocations')}</Typography>
                    <Typography variant="body1">
                      {formData.profile.operatingLocations && formData.profile.operatingLocations.length > 0 
                        ? formData.profile.operatingLocations.join(', ') 
                        : '-'}
                    </Typography>
                  </Grid>
                </>
              )}
              
              {formData.role === 'agri_expert' && (
                <>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" color="primary">{t('register.agri_expert')}</Typography>
                  </Grid>
                  
                  {/* Agri expert doesn't have specific fields in the current implementation */}
                  {/* We can add them here if needed in the future */}
                </>
              )}
              
              {formData.role === 'government_officer' && (
                <>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" color="primary">{t('register.government_officer')}</Typography>
                  </Grid>
                  
                  {/* Government officer doesn't have specific fields in the current implementation */}
                  {/* We can add them here if needed in the future */}
                </>
              )}
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">{t('register.preferredLanguage')}</Typography>
                <Typography variant="body1">
                  {formData.profile.preferredLanguage === 'en' ? 'English' :
                   formData.profile.preferredLanguage === 'hi' ? 'हिंदी (Hindi)' :
                   formData.profile.preferredLanguage === 'pa' ? 'ਪੰਜਾਬੀ (Punjabi)' :
                   formData.profile.preferredLanguage === 'bn' ? 'বাংলা (Bengali)' :
                   formData.profile.preferredLanguage === 'te' ? 'తెలుగు (Telugu)' :
                   formData.profile.preferredLanguage === 'ta' ? 'தமிழ் (Tamil)' :
                   formData.profile.preferredLanguage === 'mr' ? 'मराठी (Marathi)' :
                   formData.profile.preferredLanguage === 'gu' ? 'ગુજરાતી (Gujarati)' :
                   formData.profile.preferredLanguage === 'kn' ? 'ಕನ್ನಡ (Kannada)' :
                   formData.profile.preferredLanguage === 'ml' ? 'മലയാളം (Malayalam)' :
                   formData.profile.preferredLanguage}
                </Typography>
              </Grid>
            </Grid>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              {t('register.termsAgreement')}
            </Typography>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container component="main" maxWidth="sm">
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
          {t('register.title')}
        </Typography>

        <Stepper activeStep={activeStep} sx={{ width: '100%', mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" sx={{ mt: 1, width: '100%' }}>
          {renderStepContent(activeStep)}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              disabled={activeStep === 0 || isLoading}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              {t('register.back')}
            </Button>

            <Box sx={{ position: 'relative' }}>
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    t('register.submit')
                  )}
                </Button>
              ) : (
                <Button variant="contained" color="primary" onClick={handleNext}>
                  {t('register.next')}
                </Button>
              )}
            </Box>
          </Box>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Link component={RouterLink} to="/login" variant="body2">
            {t('register.alreadyHaveAccount')}
          </Link>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage;