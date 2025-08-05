import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext.tsx';
import { useOfflineData } from '../contexts/OfflineDataContext.tsx';

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
        <div className="p-6">
          {children}
        </div>
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

  const handleTabChange = (newValue: number) => {
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
        // Simulate API delay
        // await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Always set the data from the sample data first
        // This ensures we always have data to display
        setFinanceData(sampleFinanceData);
        updateFinanceData(sampleFinanceData);
        
        // Check if we're offline and have cached data
        if (!navigator.onLine && cachedData.financeData) {
          setIsOfflineData(true);
        } else {
          setIsOfflineData(false);
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
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
        <h2 className="mt-4 text-lg font-medium text-gray-700">
          {t.loading}
        </h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">{t.error}:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  const filteredData = getFilteredData();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {t.title}
      </h1>
      
      {isOfflineData && (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6" role="alert">
          <p>{t.offline}</p>
        </div>
      )}
      
      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
            placeholder={t.search}
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex" aria-label="Tabs">
            <button
              onClick={() => handleTabChange(0)}
              className={`w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm ${tabValue === 0 ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              aria-current={tabValue === 0 ? 'page' : undefined}
              {...a11yProps(0)}
            >
              <div className="flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                {t.loans}
              </div>
            </button>
            <button
              onClick={() => handleTabChange(1)}
              className={`w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm ${tabValue === 1 ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              aria-current={tabValue === 1 ? 'page' : undefined}
              {...a11yProps(1)}
            >
              <div className="flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                {t.schemes}
              </div>
            </button>
            <button
              onClick={() => handleTabChange(2)}
              className={`w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm ${tabValue === 2 ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              aria-current={tabValue === 2 ? 'page' : undefined}
              {...a11yProps(2)}
            >
              <div className="flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                {t.insurance}
              </div>
            </button>
            <button
              onClick={() => handleTabChange(3)}
              className={`w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm ${tabValue === 3 ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              aria-current={tabValue === 3 ? 'page' : undefined}
              {...a11yProps(3)}
            >
              <div className="flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                {t.calculator}
              </div>
            </button>
          </nav>
        </div>
        
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {t.calculator}
                </h3>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.loanAmount}: ₹{loanAmount.toLocaleString()}
                  </label>
                  <input
                    type="range"
                    min="10000"
                    max="2000000"
                    step="10000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.interestRate}: {interestRate}%
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="20"
                    step="0.5"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.tenure}: {tenure} {t.years}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="1"
                    value={tenure}
                    onChange={(e) => setTenure(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                
                <button
                  onClick={calculateEMI}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  {t.calculate}
                </button>
              </div>
            </div>
            
            <div>
              {emiResult && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Calculation Results
                    </h3>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-green-600">
                        {t.monthlyEMI}
                      </h4>
                      <p className="text-2xl font-bold">
                        ₹{emiResult.emi.toLocaleString()}
                      </p>
                    </div>
                    
                    <hr className="my-4" />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">
                          {t.principal}
                        </h4>
                        <p className="text-lg font-semibold">
                          ₹{loanAmount.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">
                          {t.totalInterest}
                        </h4>
                        <p className="text-lg font-semibold">
                          ₹{emiResult.totalInterest.toLocaleString()}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <h4 className="text-sm font-medium text-gray-500">
                          {t.totalPayment}
                        </h4>
                        <p className="text-lg font-semibold">
                          ₹{emiResult.totalPayment.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabPanel>
      </div>

      {/* Details Dialog */}
      {detailsOpen && selectedItem && (
        <div className="fixed inset-0 z-10 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={handleDetailsClose}></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      {language === 'hi' && selectedItem.nameHi ? selectedItem.nameHi : selectedItem.name}
                    </h3>
                    <div className="mt-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">{t.provider}</h4>
                          <p className="mt-1">{selectedItem.provider}</p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">{t.type}</h4>
                          <p className="mt-1">{selectedItem.type}</p>
                        </div>
                        
                        {selectedItem.interestRate && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">{t.interestRate}</h4>
                            <p className="mt-1">{selectedItem.interestRate}</p>
                          </div>
                        )}
                        
                        {selectedItem.maxAmount && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">{t.loanAmount}</h4>
                            <p className="mt-1">{selectedItem.maxAmount}</p>
                          </div>
                        )}
                        
                        {selectedItem.tenure && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">{t.tenure}</h4>
                            <p className="mt-1">{selectedItem.tenure}</p>
                          </div>
                        )}
                        
                        {selectedItem.premium && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">{t.premium}</h4>
                            <p className="mt-1">{selectedItem.premium}</p>
                          </div>
                        )}
                      </div>
                      
                      {selectedItem.eligibility && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-500 mb-2">{t.eligibility}</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {selectedItem.eligibility.map((item: string, index: number) => (
                              <li key={index} className="text-sm">{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {selectedItem.benefits && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-500 mb-2">{t.benefits}</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {selectedItem.benefits.map((benefit: string, index: number) => (
                              <li key={index} className="text-sm">{benefit}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {selectedItem.coverage && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-500 mb-2">{t.coverage}</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {selectedItem.coverage.map((item: string, index: number) => (
                              <li key={index} className="text-sm">{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {selectedItem.contactInfo && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-500 mb-2">{t.contactInfo}</h4>
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              <span className="text-sm">{selectedItem.contactInfo.phone}</span>
                            </div>
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <span className="text-sm">{selectedItem.contactInfo.email}</span>
                            </div>
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                              </svg>
                              <span className="text-sm">{selectedItem.contactInfo.website}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {t.applyNow}
                </button>
                <button 
                  type="button" 
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleDetailsClose}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  function renderFinanceItems(items: any[], type: string) {
    if (items.length === 0) {
      return (
        <div className="p-6 text-center">
          <p className="text-gray-500">{t.noResults}</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div 
            key={item.id} 
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
          >
            <div className="p-6 flex-grow">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {language === 'hi' && item.nameHi ? item.nameHi : item.name}
              </h3>
              
              <p className="text-sm text-gray-500 mb-2">
                {item.provider}
              </p>
              
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mb-4">
                {item.type}
              </span>
              
              {item.interestRate && (
                <p className="text-sm mb-2">
                  <span className="font-medium">{t.interestRate}:</span> {item.interestRate}
                </p>
              )}
              
              {item.maxAmount && (
                <p className="text-sm mb-2">
                  <span className="font-medium">Max Amount:</span> {item.maxAmount}
                </p>
              )}
              
              {item.premium && (
                <p className="text-sm mb-2">
                  <span className="font-medium">{t.premium}:</span> {item.premium}
                </p>
              )}
              
              {item.benefits && item.benefits.length > 0 && (
                <p className="text-sm mb-2">
                  <span className="font-medium">{t.benefits}:</span> {item.benefits[0]}
                  {item.benefits.length > 1 && '...'}
                </p>
              )}
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
              <button 
                onClick={() => handleItemSelect(item)}
                className="text-green-600 hover:text-green-800 text-sm font-medium"
              >
                {t.viewDetails}
              </button>
              <button 
                className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-1 px-3 rounded transition duration-150 ease-in-out"
              >
                {t.applyNow}
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }
};

export default FinancePage;