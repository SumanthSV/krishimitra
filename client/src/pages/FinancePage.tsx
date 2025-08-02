import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
  CardActions,
  Button,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  AccountBalance as BankIcon,
  CreditCard as CreditIcon,
  Security as InsuranceIcon,
  Calculate as CalculateIcon,
  Info as InfoIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Language as WebsiteIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';
import { useOfflineData } from '../contexts/OfflineDataContext';

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
      id={`finance-tabpanel-${index}`}
      aria-labelledby={`finance-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `finance-tab-${index}`,
    'aria-controls': `finance-tabpanel-${index}`,
  };
}

const translations = {
  en: {
    title: 'Financial Services',
    loans: 'Loans',
    schemes: 'Government Schemes',
    insurance: 'Insurance',
    calculator: 'EMI Calculator',
    search: 'Search financial services...',
    loading: 'Loading financial data...',
    error: 'Failed to load financial data',
    offline: 'You are viewing cached financial data',
    interestRate: 'Interest Rate',
    loanAmount: 'Loan Amount',
    tenure: 'Tenure',
    eligibility: 'Eligibility',
    documents: 'Required Documents',
    benefits: 'Benefits',
    applicationProcess: 'Application Process',
    contactInfo: 'Contact Information',
    calculate: 'Calculate EMI',
    monthlyEMI: 'Monthly EMI',
    totalPayment: 'Total Payment',
    totalInterest: 'Total Interest',
    principal: 'Principal Amount',
    years: 'Years',
    months: 'Months',
    viewDetails: 'View Details',
    applyNow: 'Apply Now',
    downloadBrochure: 'Download Brochure',
    noResults: 'No financial services found matching your search',
    provider: 'Provider',
    type: 'Type',
    coverage: 'Coverage',
    premium: 'Premium',
    sumInsured: 'Sum Insured',
    claimProcess: 'Claim Process',
    features: 'Features',
    terms: 'Terms & Conditions',
  },
  hi: {
    title: 'वित्तीय सेवाएं',
    loans: 'ऋण',
    schemes: 'सरकारी योजनाएं',
    insurance: 'बीमा',
    calculator: 'EMI कैलकुलेटर',
    search: 'वित्तीय सेवाओं की खोज करें...',
    loading: 'वित्तीय डेटा लोड हो रहा है...',
    error: 'वित्तीय डेटा लोड करने में विफल',
    offline: 'आप कैश्ड वित्तीय डेटा देख रहे हैं',
    interestRate: 'ब्याज दर',
    loanAmount: 'ऋण राशि',
    tenure: 'अवधि',
    eligibility: 'पात्रता',
    documents: 'आवश्यक दस्तावेज',
    benefits: 'लाभ',
    applicationProcess: 'आवेदन प्रक्रिया',
    contactInfo: 'संपर्क जानकारी',
    calculate: 'EMI की गणना करें',
    monthlyEMI: 'मासिक EMI',
    totalPayment: 'कुल भुगतान',
    totalInterest: 'कुल ब्याज',
    principal: 'मूल राशि',
    years: 'वर्ष',
    months: 'महीने',
    viewDetails: 'विवरण देखें',
    applyNow: 'अभी आवेदन करें',
    downloadBrochure: 'ब्रोशर डाउनलोड करें',
    noResults: 'आपकी खोज से मेल खाती कोई वित्तीय सेवा नहीं मिली',
    provider: 'प्रदाता',
    type: 'प्रकार',
    coverage: 'कवरेज',
    premium: 'प्रीमियम',
    sumInsured: 'बीमित राशि',
    claimProcess: 'दावा प्रक्रिया',
    features: 'विशेषताएं',
    terms: 'नियम और शर्तें',
  },
};

// Sample financial data
const sampleFinanceData = {
  loans: [
    {
      id: 1,
      name: 'Kisan Credit Card',
      nameHi: 'किसान क्रेडिट कार्ड',
      provider: 'All Nationalized Banks',
      type: 'Agricultural Credit',
      interestRate: '7% - 9%',
      maxAmount: '₹ 3,00,000',
      tenure: '1-5 years',
      processingFee: '0.5% - 1%',
      eligibility: [
        'All farmers - individual or joint',
        'Tenant farmers',
        'Oral lessees',
        'Share croppers',
        'Self Help Groups (SHGs)',
        'Joint Liability Groups (JLGs)'
      ],
      documents: [
        'Identity Proof (Aadhaar/Voter ID)',
        'Address Proof',
        'Land ownership documents',
        'Bank account details',
        'Passport size photographs'
      ],
      benefits: [
        'Flexible withdrawal and repayment',
        'Interest subvention of 2%',
        'No collateral required up to ₹1.6 lakh',
        'Insurance coverage',
        'Simplified renewal process'
      ],
      applicationProcess: 'Visit nearest bank branch with required documents. Fill KCC application form and submit. Bank will verify documents and conduct field visit if necessary.',
      contactInfo: {
        phone: '1800-180-1111',
        email: 'info@nabard.org',
        website: 'https://www.nabard.org'
      }
    },
    {
      id: 2,
      name: 'Agricultural Term Loan',
      nameHi: 'कृषि अवधि ऋण',
      provider: 'NABARD through Banks',
      type: 'Equipment & Infrastructure',
      interestRate: '8.5% - 12%',
      maxAmount: '₹ 20,00,000',
      tenure: '3-15 years',
      processingFee: '1%',
      eligibility: [
        'Farmers with land ownership',
        'Farmer Producer Organizations',
        'Agricultural entrepreneurs',
        'Self Help Groups'
      ],
      documents: [
        'Identity and Address Proof',
        'Land ownership documents',
        'Project report',
        'Bank account details',
        'Income proof'
      ],
      benefits: [
        'Flexible repayment based on cash flow',
        'Moratorium period available',
        'Subsidy under various schemes',
        'Tax benefits'
      ],
      applicationProcess: 'Prepare detailed project report. Submit application with project report and documents to bank. Bank will assess feasibility and approve.',
      contactInfo: {
        phone: '1800-111-111',
        email: 'info@nabard.org',
        website: 'https://www.nabard.org'
      }
    }
  ],
  schemes: [
    {
      id: 1,
      name: 'PM-KISAN',
      nameHi: 'प्रधानमंत्री किसान सम्मान निधि',
      provider: 'Government of India',
      type: 'Income Support',
      benefits: [
        '₹6,000 per year in 3 installments',
        'Direct bank transfer',
        'No paperwork after registration',
        'Covers all landholding farmers'
      ],
      eligibility: [
        'All landholding farmer families',
        'Small and Marginal Farmers',
        'Subject to exclusion criteria'
      ],
      documents: [
        'Aadhaar Card',
        'Land Records',
        'Bank Account details',
        'Self-declaration form'
      ],
      applicationProcess: 'Register through CSCs, Agriculture Officers, or online portal. Submit required documents for verification.',
      contactInfo: {
        phone: '011-23381092',
        email: 'pmkisan-ict@gov.in',
        website: 'https://pmkisan.gov.in'
      }
    },
    {
      id: 2,
      name: 'PMFBY',
      nameHi: 'प्रधानमंत्री फसल बीमा योजना',
      provider: 'Government of India',
      type: 'Crop Insurance',
      benefits: [
        'Low premium rates (2% for Kharif, 1.5% for Rabi)',
        'Coverage for prevented sowing',
        'Post-harvest losses coverage',
        'Technology for faster claims'
      ],
      eligibility: [
        'All farmers growing notified crops',
        'Both loanee and non-loanee farmers',
        'Sharecroppers and tenant farmers'
      ],
      documents: [
        'Land Records',
        'Aadhaar Card',
        'Bank Account details',
        'Sowing Certificate'
      ],
      applicationProcess: 'Apply through bank branch or online portal. Premium payment before cut-off date.',
      contactInfo: {
        phone: '011-23384929',
        email: 'pmfby-agri@gov.in',
        website: 'https://pmfby.gov.in'
      }
    }
  ],
  insurance: [
    {
      id: 1,
      name: 'Crop Insurance',
      nameHi: 'फसल बीमा',
      provider: 'Various Insurance Companies',
      type: 'Crop Protection',
      coverage: [
        'Yield losses due to natural calamities',
        'Prevented sowing',
        'Post-harvest losses',
        'Localized disasters'
      ],
      premium: '2% - 5% of sum insured',
      sumInsured: '₹10,000 - ₹1,00,000 per hectare',
      claimProcess: 'Claims processed based on yield data from Crop Cutting Experiments. For localized calamities, inform within 72 hours.',
      contactInfo: {
        phone: '011-23384929',
        email: 'pmfby-agri@gov.in',
        website: 'https://pmfby.gov.in'
      }
    },
    {
      id: 2,
      name: 'Livestock Insurance',
      nameHi: 'पशुधन बीमा',
      provider: 'Various Insurance Companies',
      type: 'Animal Protection',
      coverage: [
        'Death due to diseases/accidents',
        'Permanent disability',
        'Surgical operations',
        'Emergency veterinary care'
      ],
      premium: '3% - 5% of sum insured',
      sumInsured: '₹5,000 - ₹1,00,000 per animal',
      claimProcess: 'Inform insurance company within 24 hours of animal death. Veterinarian will conduct post-mortem and issue death certificate.',
      contactInfo: {
        phone: '1800-180-1551',
        email: 'livestock-insurance@gov.in',
        website: 'https://dahd.nic.in'
      }
    }
  ],
  lastUpdated: new Date().toISOString(),
};

const FinancePage: React.FC = () => {
  const { language } = useLanguage();
  const { cachedData, updateFinanceData } = useOfflineData();
  const theme = useTheme();
  
  const t = translations[language as keyof typeof translations] || translations.en;
  
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [financeData, setFinanceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOfflineData, setIsOfflineData] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  
  // EMI Calculator state
  const [loanAmount, setLoanAmount] = useState(100000);
  const [interestRate, setInterestRate] = useState(10);
  const [tenure, setTenure] = useState(5);
  const [emiResult, setEmiResult] = useState<any>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleItemSelect = (item: any) => {
    setSelectedItem(item);
    setDetailsOpen(true);
  };

  const handleDetailsClose = () => {
    setDetailsOpen(false);
    setSelectedItem(null);
  };

  const calculateEMI = () => {
    const monthlyRate = interestRate / 12 / 100;
    const tenureMonths = tenure * 12;
    
    const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / 
                (Math.pow(1 + monthlyRate, tenureMonths) - 1);
    
    const totalPayment = emi * tenureMonths;
    const totalInterest = totalPayment - loanAmount;
    
    setEmiResult({
      emi: Math.round(emi),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest)
    });
  };

  useEffect(() => {
    const fetchFinanceData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        if (navigator.onLine) {
          setFinanceData(sampleFinanceData);
          setIsOfflineData(false);
          updateFinanceData(sampleFinanceData);
        } else {
          if (cachedData.financeData) {
            setFinanceData(cachedData.financeData);
            setIsOfflineData(true);
          } else {
            throw new Error('No internet connection and no cached data available');
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchFinanceData();
  }, [cachedData.financeData, updateFinanceData]);

  const getFilteredData = () => {
    if (!financeData) return [];
    
    let data = [];
    switch (tabValue) {
      case 0:
        data = financeData.loans;
        break;
      case 1:
        data = financeData.schemes;
        break;
      case 2:
        data = financeData.insurance;
        break;
      default:
        data = [];
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      data = data.filter((item: any) => 
        item.name.toLowerCase().includes(query) ||
        (item.nameHi && item.nameHi.toLowerCase().includes(query)) ||
        item.provider.toLowerCase().includes(query) ||
        item.type.toLowerCase().includes(query)
      );
    }
    
    return data;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          {t.loading}
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{t.error}: {error}</Alert>
      </Container>
    );
  }

  const filteredData = getFilteredData();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t.title}
      </Typography>
      
      {isOfflineData && (
        <Alert severity="info" sx={{ mb: 3 }}>
          {t.offline}
        </Alert>
      )}
      
      {/* Search Bar */}
      <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder={t.search}
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* Tabs */}
      <Paper elevation={3} sx={{ borderRadius: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="finance tabs"
            variant="fullWidth"
          >
            <Tab 
              label={t.loans} 
              icon={<CreditIcon />} 
              iconPosition="start"
              {...a11yProps(0)} 
            />
            <Tab 
              label={t.schemes} 
              icon={<BankIcon />} 
              iconPosition="start"
              {...a11yProps(1)} 
            />
            <Tab 
              label={t.insurance} 
              icon={<InsuranceIcon />} 
              iconPosition="start"
              {...a11yProps(2)} 
            />
            <Tab 
              label={t.calculator} 
              icon={<CalculateIcon />} 
              iconPosition="start"
              {...a11yProps(3)} 
            />
          </Tabs>
        </Box>
        
        {/* Loans Tab */}
        <TabPanel value={tabValue} index={0}>
          {renderFinanceItems(filteredData, 'loan')}
        </TabPanel>
        
        {/* Schemes Tab */}
        <TabPanel value={tabValue} index={1}>
          {renderFinanceItems(filteredData, 'scheme')}
        </TabPanel>
        
        {/* Insurance Tab */}
        <TabPanel value={tabValue} index={2}>
          {renderFinanceItems(filteredData, 'insurance')}
        </TabPanel>
        
        {/* Calculator Tab */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {t.calculator}
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography gutterBottom>
                      {t.loanAmount}: ₹{loanAmount.toLocaleString()}
                    </Typography>
                    <Slider
                      value={loanAmount}
                      onChange={(_, value) => setLoanAmount(value as number)}
                      min={10000}
                      max={2000000}
                      step={10000}
                      valueLabelDisplay="auto"
                      valueLabelFormat={(value) => `₹${value.toLocaleString()}`}
                    />
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography gutterBottom>
                      {t.interestRate}: {interestRate}%
                    </Typography>
                    <Slider
                      value={interestRate}
                      onChange={(_, value) => setInterestRate(value as number)}
                      min={5}
                      max={20}
                      step={0.5}
                      valueLabelDisplay="auto"
                      valueLabelFormat={(value) => `${value}%`}
                    />
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography gutterBottom>
                      {t.tenure}: {tenure} {t.years}
                    </Typography>
                    <Slider
                      value={tenure}
                      onChange={(_, value) => setTenure(value as number)}
                      min={1}
                      max={30}
                      step={1}
                      valueLabelDisplay="auto"
                      valueLabelFormat={(value) => `${value} years`}
                    />
                  </Box>
                  
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={calculateEMI}
                    sx={{ mt: 2 }}
                  >
                    {t.calculate}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              {emiResult && (
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Calculation Results
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" color="primary">
                        {t.monthlyEMI}
                      </Typography>
                      <Typography variant="h4">
                        ₹{emiResult.emi.toLocaleString()}
                      </Typography>
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          {t.principal}
                        </Typography>
                        <Typography variant="h6">
                          ₹{loanAmount.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          {t.totalInterest}
                        </Typography>
                        <Typography variant="h6">
                          ₹{emiResult.totalInterest.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                          {t.totalPayment}
                        </Typography>
                        <Typography variant="h6">
                          ₹{emiResult.totalPayment.toLocaleString()}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              )}
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>

      {/* Details Dialog */}
      <Dialog 
        open={detailsOpen} 
        onClose={handleDetailsClose}
        maxWidth="md"
        fullWidth
      >
        {selectedItem && (
          <>
            <DialogTitle>
              {language === 'hi' && selectedItem.nameHi ? selectedItem.nameHi : selectedItem.name}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    {t.provider}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {selectedItem.provider}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    {t.type}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {selectedItem.type}
                  </Typography>
                </Grid>
                
                {selectedItem.interestRate && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      {t.interestRate}
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {selectedItem.interestRate}
                    </Typography>
                  </Grid>
                )}
                
                {selectedItem.maxAmount && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      {t.loanAmount}
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {selectedItem.maxAmount}
                    </Typography>
                  </Grid>
                )}
                
                {selectedItem.tenure && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      {t.tenure}
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {selectedItem.tenure}
                    </Typography>
                  </Grid>
                )}
                
                {selectedItem.premium && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      {t.premium}
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {selectedItem.premium}
                    </Typography>
                  </Grid>
                )}
                
                {selectedItem.eligibility && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      {t.eligibility}
                    </Typography>
                    <List dense>
                      {selectedItem.eligibility.map((item: string, index: number) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <InfoIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary={item} />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                )}
                
                {selectedItem.benefits && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      {t.benefits}
                    </Typography>
                    <List dense>
                      {selectedItem.benefits.map((benefit: string, index: number) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <InfoIcon fontSize="small" color="primary" />
                          </ListItemIcon>
                          <ListItemText primary={benefit} />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                )}
                
                {selectedItem.coverage && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      {t.coverage}
                    </Typography>
                    <List dense>
                      {selectedItem.coverage.map((item: string, index: number) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <InfoIcon fontSize="small" color="primary" />
                          </ListItemIcon>
                          <ListItemText primary={item} />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                )}
                
                {selectedItem.contactInfo && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      {t.contactInfo}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PhoneIcon sx={{ mr: 1, fontSize: 'small' }} />
                        <Typography variant="body2">
                          {selectedItem.contactInfo.phone}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <EmailIcon sx={{ mr: 1, fontSize: 'small' }} />
                        <Typography variant="body2">
                          {selectedItem.contactInfo.email}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <WebsiteIcon sx={{ mr: 1, fontSize: 'small' }} />
                        <Typography variant="body2">
                          {selectedItem.contactInfo.website}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDetailsClose}>
                Close
              </Button>
              <Button variant="contained" color="primary">
                {t.applyNow}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );

  function renderFinanceItems(items: any[], type: string) {
    if (items.length === 0) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1">{t.noResults}</Typography>
        </Box>
      );
    }

    return (
      <Grid container spacing={3}>
        {items.map((item) => (
          <Grid item xs={12} md={6} lg={4} key={item.id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': { 
                  boxShadow: theme.shadows[8],
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease-in-out'
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="div" gutterBottom>
                  {language === 'hi' && item.nameHi ? item.nameHi : item.name}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {item.provider}
                </Typography>
                
                <Chip 
                  label={item.type} 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                
                {item.interestRate && (
                  <Typography variant="body2" paragraph>
                    <strong>{t.interestRate}:</strong> {item.interestRate}
                  </Typography>
                )}
                
                {item.maxAmount && (
                  <Typography variant="body2" paragraph>
                    <strong>Max Amount:</strong> {item.maxAmount}
                  </Typography>
                )}
                
                {item.premium && (
                  <Typography variant="body2" paragraph>
                    <strong>{t.premium}:</strong> {item.premium}
                  </Typography>
                )}
                
                {item.benefits && item.benefits.length > 0 && (
                  <Typography variant="body2" paragraph>
                    <strong>{t.benefits}:</strong> {item.benefits[0]}
                    {item.benefits.length > 1 && '...'}
                  </Typography>
                )}
              </CardContent>
              
              <CardActions>
                <Button 
                  size="small" 
                  onClick={() => handleItemSelect(item)}
                >
                  {t.viewDetails}
                </Button>
                <Button 
                  size="small" 
                  variant="contained"
                  color="primary"
                >
                  {t.applyNow}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }
};

export default FinancePage;