import express from 'express';
import { query, body, validationResult } from 'express-validator';
import logger from '../utils/logger';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

/**
 * GET /api/finance/loans
 * Get available loan schemes
 */
router.get('/loans', [
  query('state').optional().isString(),
  query('category').optional().isIn(['agricultural', 'equipment', 'livestock', 'storage']),
  query('amount').optional().isFloat({ min: 0 }),
  query('purpose').optional().isString()
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array()
    });
  }

  const { state, category, amount, purpose } = req.query;

  // Mock loan data
  const loans = generateMockLoanData(state as string, category as string, amount as string);

  res.json({
    success: true,
    data: loans
  });
}));

/**
 * GET /api/finance/schemes
 * Get government schemes
 */
router.get('/schemes', [
  query('state').optional().isString(),
  query('category').optional().isIn(['subsidy', 'insurance', 'credit', 'infrastructure']),
  query('beneficiary').optional().isIn(['small_farmers', 'women_farmers', 'tribal_farmers', 'all'])
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array()
    });
  }

  const { state, category, beneficiary } = req.query;

  // Mock scheme data
  const schemes = generateMockSchemeData(state as string, category as string, beneficiary as string);

  res.json({
    success: true,
    data: schemes
  });
}));

/**
 * GET /api/finance/insurance
 * Get insurance options
 */
router.get('/insurance', [
  query('type').optional().isIn(['crop', 'livestock', 'equipment', 'life']),
  query('state').optional().isString(),
  query('crop').optional().isString()
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array()
    });
  }

  const { type, state, crop } = req.query;

  // Mock insurance data
  const insurance = generateMockInsuranceData(type as string, state as string, crop as string);

  res.json({
    success: true,
    data: insurance
  });
}));

/**
 * POST /api/finance/calculate-emi
 * Calculate EMI for loans
 */
router.post('/calculate-emi', [
  body('principal').isFloat({ min: 1000 }).withMessage('Principal amount must be at least 1000'),
  body('interestRate').isFloat({ min: 0.1, max: 50 }).withMessage('Interest rate must be between 0.1 and 50'),
  body('tenure').isInt({ min: 1, max: 30 }).withMessage('Tenure must be between 1 and 30 years')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array()
    });
  }

  const { principal, interestRate, tenure } = req.body;

  // Calculate EMI
  const monthlyRate = interestRate / 12 / 100;
  const tenureMonths = tenure * 12;
  
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / 
              (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  
  const totalPayment = emi * tenureMonths;
  const totalInterest = totalPayment - principal;

  // Generate amortization schedule
  const schedule = [];
  let remainingPrincipal = principal;

  for (let month = 1; month <= Math.min(tenureMonths, 12); month++) { // Show first year
    const interestPayment = remainingPrincipal * monthlyRate;
    const principalPayment = emi - interestPayment;
    remainingPrincipal -= principalPayment;

    schedule.push({
      month,
      emi: Math.round(emi),
      principal: Math.round(principalPayment),
      interest: Math.round(interestPayment),
      balance: Math.round(remainingPrincipal)
    });
  }

  res.json({
    success: true,
    data: {
      input: { principal, interestRate, tenure },
      results: {
        emi: Math.round(emi),
        totalPayment: Math.round(totalPayment),
        totalInterest: Math.round(totalInterest)
      },
      schedule
    }
  });
}));

/**
 * GET /api/finance/eligibility
 * Check loan eligibility
 */
router.get('/eligibility', [
  query('income').isFloat({ min: 0 }).withMessage('Income is required'),
  query('landSize').optional().isFloat({ min: 0 }),
  query('existingLoans').optional().isFloat({ min: 0 }),
  query('creditScore').optional().isInt({ min: 300, max: 900 })
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array()
    });
  }

  const { income, landSize = 0, existingLoans = 0, creditScore = 650 } = req.query;

  const monthlyIncome = parseFloat(income as string);
  const eligibility = calculateLoanEligibility(monthlyIncome, parseFloat(landSize as string), parseFloat(existingLoans as string), parseInt(creditScore as string));

  res.json({
    success: true,
    data: eligibility
  });
}));

// Helper functions
function generateMockLoanData(state?: string, category?: string, amount?: string) {
  const loans = [
    {
      id: 'kcc-001',
      name: 'Kisan Credit Card (KCC)',
      provider: 'All Nationalized Banks',
      category: 'agricultural',
      interestRate: { min: 7, max: 9 },
      maxAmount: 300000,
      tenure: { min: 1, max: 5, unit: 'years' },
      processingFee: 0.5,
      eligibility: [
        'All farmers - individual or joint',
        'Tenant farmers and sharecroppers',
        'Self Help Groups (SHGs)'
      ],
      documents: [
        'Identity Proof (Aadhaar/Voter ID)',
        'Address Proof',
        'Land ownership documents',
        'Bank account details'
      ],
      benefits: [
        'Flexible withdrawal and repayment',
        'Interest subvention of 2%',
        'No collateral required up to ₹1.6 lakh',
        'Insurance coverage'
      ],
      applicationProcess: 'Visit nearest bank branch with required documents',
      contactInfo: {
        phone: '1800-180-1111',
        email: 'info@nabard.org',
        website: 'https://www.nabard.org'
      }
    },
    {
      id: 'atl-001',
      name: 'Agricultural Term Loan',
      provider: 'NABARD through Banks',
      category: 'equipment',
      interestRate: { min: 8.5, max: 12 },
      maxAmount: 2000000,
      tenure: { min: 3, max: 15, unit: 'years' },
      processingFee: 1,
      eligibility: [
        'Farmers with land ownership',
        'Farmer Producer Organizations',
        'Agricultural entrepreneurs'
      ],
      documents: [
        'Project report',
        'Land ownership documents',
        'Income proof',
        'Bank account details'
      ],
      benefits: [
        'Flexible repayment based on cash flow',
        'Moratorium period available',
        'Subsidy under various schemes'
      ],
      applicationProcess: 'Submit detailed project report to bank',
      contactInfo: {
        phone: '1800-111-111',
        email: 'info@nabard.org',
        website: 'https://www.nabard.org'
      }
    }
  ];

  // Filter based on query parameters
  let filteredLoans = loans;
  
  if (category) {
    filteredLoans = filteredLoans.filter(loan => loan.category === category);
  }
  
  if (amount) {
    const requestedAmount = parseFloat(amount);
    filteredLoans = filteredLoans.filter(loan => loan.maxAmount >= requestedAmount);
  }

  return filteredLoans;
}

function generateMockSchemeData(state?: string, category?: string, beneficiary?: string) {
  const schemes = [
    {
      id: 'pmkisan-001',
      name: 'PM-KISAN',
      fullName: 'Pradhan Mantri Kisan Samman Nidhi',
      provider: 'Government of India',
      category: 'subsidy',
      beneficiary: 'all',
      benefits: [
        '₹6,000 per year in 3 installments',
        'Direct bank transfer',
        'No paperwork after registration'
      ],
      eligibility: [
        'All landholding farmer families',
        'Small and Marginal Farmers',
        'Subject to exclusion criteria'
      ],
      documents: [
        'Aadhaar Card',
        'Land Records',
        'Bank Account details'
      ],
      applicationProcess: 'Register through CSCs or online portal',
      contactInfo: {
        phone: '011-23381092',
        email: 'pmkisan-ict@gov.in',
        website: 'https://pmkisan.gov.in'
      }
    },
    {
      id: 'pmfby-001',
      name: 'PMFBY',
      fullName: 'Pradhan Mantri Fasal Bima Yojana',
      provider: 'Government of India',
      category: 'insurance',
      beneficiary: 'all',
      benefits: [
        'Low premium rates (2% for Kharif, 1.5% for Rabi)',
        'Coverage for prevented sowing',
        'Post-harvest losses coverage'
      ],
      eligibility: [
        'All farmers growing notified crops',
        'Both loanee and non-loanee farmers'
      ],
      documents: [
        'Land Records',
        'Aadhaar Card',
        'Bank Account details',
        'Sowing Certificate'
      ],
      applicationProcess: 'Apply through bank or online portal',
      contactInfo: {
        phone: '011-23384929',
        email: 'pmfby-agri@gov.in',
        website: 'https://pmfby.gov.in'
      }
    }
  ];

  // Filter based on query parameters
  let filteredSchemes = schemes;
  
  if (category) {
    filteredSchemes = filteredSchemes.filter(scheme => scheme.category === category);
  }
  
  if (beneficiary && beneficiary !== 'all') {
    filteredSchemes = filteredSchemes.filter(scheme => 
      scheme.beneficiary === beneficiary || scheme.beneficiary === 'all'
    );
  }

  return filteredSchemes;
}

function generateMockInsuranceData(type?: string, state?: string, crop?: string) {
  const insurance = [
    {
      id: 'crop-ins-001',
      name: 'Crop Insurance',
      provider: 'Various Insurance Companies',
      type: 'crop',
      coverage: [
        'Yield losses due to natural calamities',
        'Prevented sowing',
        'Post-harvest losses'
      ],
      premium: { type: 'percentage', value: 2, max: 5 },
      sumInsured: { min: 10000, max: 100000, unit: 'per hectare' },
      eligibility: [
        'All farmers growing notified crops',
        'Both loanee and non-loanee farmers'
      ],
      claimProcess: 'Claims processed based on yield data from Crop Cutting Experiments',
      contactInfo: {
        phone: '011-23384929',
        email: 'pmfby-agri@gov.in',
        website: 'https://pmfby.gov.in'
      }
    },
    {
      id: 'livestock-ins-001',
      name: 'Livestock Insurance',
      provider: 'Various Insurance Companies',
      type: 'livestock',
      coverage: [
        'Death due to diseases/accidents',
        'Permanent disability',
        'Surgical operations'
      ],
      premium: { type: 'percentage', value: 3, max: 5 },
      sumInsured: { min: 5000, max: 100000, unit: 'per animal' },
      eligibility: [
        'All farmers and cattle rearers',
        'Animals between 2-10 years of age'
      ],
      claimProcess: 'Inform within 24 hours, veterinarian post-mortem required',
      contactInfo: {
        phone: '1800-180-1551',
        email: 'livestock-insurance@gov.in',
        website: 'https://dahd.nic.in'
      }
    }
  ];

  // Filter based on type
  if (type) {
    return insurance.filter(ins => ins.type === type);
  }

  return insurance;
}

function calculateLoanEligibility(monthlyIncome: number, landSize: number, existingLoans: number, creditScore: number) {
  // Basic eligibility calculation
  const maxEMI = monthlyIncome * 0.5; // 50% of income
  const availableEMI = maxEMI - existingLoans;
  
  // Assume 10% interest rate and 5 years tenure for calculation
  const interestRate = 10;
  const tenureMonths = 5 * 12;
  const monthlyRate = interestRate / 12 / 100;
  
  // Calculate maximum loan amount
  const maxLoanAmount = availableEMI * (Math.pow(1 + monthlyRate, tenureMonths) - 1) / 
                       (monthlyRate * Math.pow(1 + monthlyRate, tenureMonths));

  // Adjust based on credit score
  let creditMultiplier = 1;
  if (creditScore >= 750) creditMultiplier = 1.2;
  else if (creditScore >= 700) creditMultiplier = 1.1;
  else if (creditScore < 600) creditMultiplier = 0.8;

  // Adjust based on land size (collateral)
  let landMultiplier = 1;
  if (landSize > 5) landMultiplier = 1.3;
  else if (landSize > 2) landMultiplier = 1.1;

  const finalEligibleAmount = Math.round(maxLoanAmount * creditMultiplier * landMultiplier);

  return {
    eligible: availableEMI > 0 && creditScore >= 500,
    maxLoanAmount: Math.max(0, finalEligibleAmount),
    maxEMI: Math.round(availableEMI),
    creditScore,
    factors: {
      income: monthlyIncome,
      landSize,
      existingLoans,
      creditScore
    },
    recommendations: generateEligibilityRecommendations(availableEMI, creditScore, landSize)
  };
}

function generateEligibilityRecommendations(availableEMI: number, creditScore: number, landSize: number): string[] {
  const recommendations = [];

  if (availableEMI <= 0) {
    recommendations.push('Reduce existing loan burden before applying for new loans');
  }

  if (creditScore < 650) {
    recommendations.push('Improve credit score by timely repayment of existing loans');
  }

  if (landSize < 1) {
    recommendations.push('Consider group lending or joint liability schemes');
  }

  if (recommendations.length === 0) {
    recommendations.push('You have good eligibility for agricultural loans');
  }

  return recommendations;
}

export default router;