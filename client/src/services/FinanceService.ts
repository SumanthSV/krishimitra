import { getLanguage } from '../utils/languageUtils';

// Types for financial data
export interface LoanInfo {
  id: string;
  name: {
    en: string;
    hi: string;
  };
  provider: string;
  type: 'agricultural' | 'equipment' | 'livestock' | 'storage' | 'marketing' | 'other';
  description: {
    en: string;
    hi: string;
  };
  eligibility: {
    en: string[];
    hi: string[];
  };
  interestRate: {
    min: number;
    max: number;
    notes: {
      en: string;
      hi: string;
    };
  };
  loanAmount: {
    min: number;
    max: number;
    currency: string;
  };
  tenure: {
    min: number;
    max: number;
    unit: 'months' | 'years';
  };
  processingFee: {
    type: 'percentage' | 'fixed';
    value: number;
    notes: {
      en: string;
      hi: string;
    };
  };
  documents: {
    en: string[];
    hi: string[];
  };
  benefits: {
    en: string[];
    hi: string[];
  };
  applicationProcess: {
    en: string;
    hi: string;
  };
  contactInfo: {
    phone: string;
    email: string;
    website: string;
  };
  availableStates: string[];
  availableDistricts: { [state: string]: string[] };
  lastUpdated: number;
}

export interface SchemeInfo {
  id: string;
  name: {
    en: string;
    hi: string;
  };
  provider: 'central' | 'state' | 'other';
  type: 'subsidy' | 'insurance' | 'credit' | 'infrastructure' | 'marketing' | 'other';
  category: 'general' | 'small_farmers' | 'women_farmers' | 'tribal_farmers' | 'other';
  description: {
    en: string;
    hi: string;
  };
  eligibility: {
    en: string[];
    hi: string[];
  };
  benefits: {
    en: string[];
    hi: string[];
  };
  documents: {
    en: string[];
    hi: string[];
  };
  applicationProcess: {
    en: string;
    hi: string;
  };
  contactInfo: {
    phone: string;
    email: string;
    website: string;
  };
  availableStates: string[];
  lastUpdated: number;
}

export interface InsuranceInfo {
  id: string;
  name: {
    en: string;
    hi: string;
  };
  provider: string;
  type: 'crop' | 'livestock' | 'equipment' | 'life' | 'health' | 'other';
  description: {
    en: string;
    hi: string;
  };
  coverage: {
    en: string[];
    hi: string[];
  };
  premium: {
    type: 'percentage' | 'fixed';
    value: number;
    notes: {
      en: string;
      hi: string;
    };
  };
  sumInsured: {
    min: number;
    max: number;
    currency: string;
  };
  eligibility: {
    en: string[];
    hi: string[];
  };
  documents: {
    en: string[];
    hi: string[];
  };
  claimProcess: {
    en: string;
    hi: string;
  };
  contactInfo: {
    phone: string;
    email: string;
    website: string;
  };
  availableStates: string[];
  lastUpdated: number;
}

// Mock loan data for offline use
const mockLoans: LoanInfo[] = [
  {
    id: 'loan-001',
    name: {
      en: 'Kisan Credit Card (KCC)',
      hi: 'किसान क्रेडिट कार्ड (KCC)',
    },
    provider: 'Various Banks',
    type: 'agricultural',
    description: {
      en: 'The Kisan Credit Card scheme provides farmers with affordable credit for their agricultural needs. It covers cultivation expenses, maintenance of farm assets, and consumption requirements.',
      hi: 'किसान क्रेडिट कार्ड योजना किसानों को उनकी कृषि आवश्यकताओं के लिए किफायती ऋण प्रदान करती है। इसमें खेती के खर्च, कृषि संपत्तियों के रखरखाव और उपभोग आवश्यकताओं को शामिल किया गया है।',
    },
    eligibility: {
      en: [
        'All farmers - individual or joint',
        'Tenant farmers',
        'Oral lessees',
        'Share croppers',
        'Self Help Groups (SHGs)',
        'Joint Liability Groups (JLGs)',
      ],
      hi: [
        'सभी किसान - व्यक्तिगत या संयुक्त',
        'किरायेदार किसान',
        'मौखिक पट्टेदार',
        'बटाईदार',
        'स्वयं सहायता समूह (SHGs)',
        'संयुक्त देयता समूह (JLGs)',
      ],
    },
    interestRate: {
      min: 7,
      max: 9,
      notes: {
        en: 'Interest subvention of 2% for prompt repayment, making effective rate 5-7%',
        hi: 'समय पर भुगतान के लिए 2% की ब्याज सहायता, प्रभावी दर 5-7% बनाती है',
      },
    },
    loanAmount: {
      min: 10000,
      max: 300000,
      currency: 'INR',
    },
    tenure: {
      min: 1,
      max: 5,
      unit: 'years',
    },
    processingFee: {
      type: 'percentage',
      value: 0.5,
      notes: {
        en: 'Processing fee capped at Rs. 1,500',
        hi: 'प्रोसेसिंग शुल्क अधिकतम रु. 1,500',
      },
    },
    documents: {
      en: [
        'Identity Proof (Aadhaar/Voter ID/Driving License)',
        'Address Proof',
        'Passport size photographs',
        'Land ownership documents or lease agreement',
        'Bank account details',
      ],
      hi: [
        'पहचान प्रमाण (आधार/वोटर आईडी/ड्राइविंग लाइसेंस)',
        'पता प्रमाण',
        'पासपोर्ट साइज फोटो',
        'भूमि स्वामित्व दस्तावेज या पट्टा समझौता',
        'बैंक खाता विवरण',
      ],
    },
    benefits: {
      en: [
        'Simplified renewal process',
        'Flexible withdrawal and repayment',
        'Interest applied only on the amount utilized',
        'Insurance coverage for crops',
        'No collateral required for loans up to Rs. 1.6 lakh',
      ],
      hi: [
        'सरलीकृत नवीनीकरण प्रक्रिया',
        'लचीली निकासी और पुनर्भुगतान',
        'ब्याज केवल उपयोग की गई राशि पर लागू',
        'फसलों के लिए बीमा कवरेज',
        'रु. 1.6 लाख तक के ऋण के लिए कोई संपार्श्विक आवश्यक नहीं',
      ],
    },
    applicationProcess: {
      en: 'Apply at your nearest bank branch or through online banking portal. Fill the KCC application form and submit required documents. The bank will verify your documents and conduct a field visit if necessary. Once approved, the KCC will be issued.',
      hi: 'अपनी निकटतम बैंक शाखा या ऑनलाइन बैंकिंग पोर्टल के माध्यम से आवेदन करें। KCC आवेदन पत्र भरें और आवश्यक दस्तावेज जमा करें। बैंक आपके दस्तावेजों को सत्यापित करेगा और यदि आवश्यक हो तो फील्ड विजिट करेगा। मंजूरी मिलने के बाद, KCC जारी किया जाएगा।',
    },
    contactInfo: {
      phone: '1800-180-1111',
      email: 'info@nabard.org',
      website: 'https://www.nabard.org',
    },
    availableStates: ['All India'],
    availableDistricts: { 'All India': ['All Districts'] },
    lastUpdated: Date.now(),
  },
  {
    id: 'loan-002',
    name: {
      en: 'Agricultural Term Loan',
      hi: 'कृषि अवधि ऋण',
    },
    provider: 'NABARD through Commercial Banks',
    type: 'equipment',
    description: {
      en: 'Agricultural Term Loans are provided for long-term investments in agriculture such as farm mechanization, land development, irrigation projects, and plantation crops.',
      hi: 'कृषि अवधि ऋण कृषि में दीर्घकालिक निवेश जैसे कृषि यंत्रीकरण, भूमि विकास, सिंचाई परियोजनाओं और बागान फसलों के लिए प्रदान किए जाते हैं।',
    },
    eligibility: {
      en: [
        'Farmers with land ownership',
        'Farmer Producer Organizations (FPOs)',
        'Agricultural entrepreneurs',
        'Self Help Groups (SHGs)',
      ],
      hi: [
        'भूमि स्वामित्व वाले किसान',
        'किसान उत्पादक संगठन (FPOs)',
        'कृषि उद्यमी',
        'स्वयं सहायता समूह (SHGs)',
      ],
    },
    interestRate: {
      min: 8.5,
      max: 12,
      notes: {
        en: 'Interest rates vary based on the purpose and amount of loan',
        hi: 'ब्याज दरें ऋण के उद्देश्य और राशि के आधार पर भिन्न होती हैं',
      },
    },
    loanAmount: {
      min: 50000,
      max: 2000000,
      currency: 'INR',
    },
    tenure: {
      min: 3,
      max: 15,
      unit: 'years',
    },
    processingFee: {
      type: 'percentage',
      value: 1,
      notes: {
        en: 'Processing fee may be waived during promotional periods',
        hi: 'प्रोमोशनल अवधि के दौरान प्रोसेसिंग शुल्क माफ किया जा सकता है',
      },
    },
    documents: {
      en: [
        'Identity Proof (Aadhaar/Voter ID/Driving License)',
        'Address Proof',
        'Land ownership documents',
        'Project report or cost estimate',
        'Bank account details',
        'Income proof or previous agricultural income details',
      ],
      hi: [
        'पहचान प्रमाण (आधार/वोटर आईडी/ड्राइविंग लाइसेंस)',
        'पता प्रमाण',
        'भूमि स्वामित्व दस्तावेज',
        'परियोजना रिपोर्ट या लागत अनुमान',
        'बैंक खाता विवरण',
        'आय प्रमाण या पिछली कृषि आय विवरण',
      ],
    },
    benefits: {
      en: [
        'Flexible repayment options based on cash flow',
        'Moratorium period available',
        'Subsidy available under various government schemes',
        'Tax benefits under Income Tax Act',
      ],
      hi: [
        'नकदी प्रवाह के आधार पर लचीले पुनर्भुगतान विकल्प',
        'अधिस्थगन अवधि उपलब्ध',
        'विभिन्न सरकारी योजनाओं के तहत सब्सिडी उपलब्ध',
        'आयकर अधिनियम के तहत कर लाभ',
      ],
    },
    applicationProcess: {
      en: 'Prepare a project report detailing the investment plan. Apply at your nearest bank branch with the project report and required documents. The bank will assess the technical feasibility and economic viability of the project. After approval, the loan will be disbursed in installments based on the progress of the project.',
      hi: 'निवेश योजना का विस्तृत विवरण देते हुए एक परियोजना रिपोर्ट तैयार करें। परियोजना रिपोर्ट और आवश्यक दस्तावेजों के साथ अपनी निकटतम बैंक शाखा में आवेदन करें। बैंक परियोजना की तकनीकी व्यवहार्यता और आर्थिक व्यवहार्यता का आकलन करेगा। मंजूरी के बाद, परियोजना की प्रगति के आधार पर ऋण किस्तों में वितरित किया जाएगा।',
    },
    contactInfo: {
      phone: '1800-111-111',
      email: 'info@nabard.org',
      website: 'https://www.nabard.org',
    },
    availableStates: ['All India'],
    availableDistricts: { 'All India': ['All Districts'] },
    lastUpdated: Date.now(),
  },
  {
    id: 'loan-003',
    name: {
      en: 'Dairy Entrepreneurship Development Scheme (DEDS)',
      hi: 'डेयरी उद्यमिता विकास योजना (DEDS)',
    },
    provider: 'NABARD through Commercial Banks',
    type: 'livestock',
    description: {
      en: 'The Dairy Entrepreneurship Development Scheme aims to promote setting up of dairy farms, purchase of milch animals, and creation of infrastructure for milk production and processing.',
      hi: 'डेयरी उद्यमिता विकास योजना का उद्देश्य डेयरी फार्म स्थापित करने, दुधारू पशुओं की खरीद और दूध उत्पादन और प्रसंस्करण के लिए बुनियादी ढांचे के निर्माण को बढ़ावा देना है।',
    },
    eligibility: {
      en: [
        'Farmers',
        'Individual entrepreneurs',
        'Self Help Groups (SHGs)',
        'Dairy Cooperative Societies',
        'Farmer Producer Organizations (FPOs)',
      ],
      hi: [
        'किसान',
        'व्यक्तिगत उद्यमी',
        'स्वयं सहायता समूह (SHGs)',
        'डेयरी सहकारी समितियां',
        'किसान उत्पादक संगठन (FPOs)',
      ],
    },
    interestRate: {
      min: 8,
      max: 12,
      notes: {
        en: 'Interest rates vary based on the bank and loan amount',
        hi: 'ब्याज दरें बैंक और ऋण राशि के आधार पर भिन्न होती हैं',
      },
    },
    loanAmount: {
      min: 100000,
      max: 2000000,
      currency: 'INR',
    },
    tenure: {
      min: 3,
      max: 7,
      unit: 'years',
    },
    processingFee: {
      type: 'percentage',
      value: 0.75,
      notes: {
        en: 'Processing fee may vary across banks',
        hi: 'प्रोसेसिंग शुल्क बैंकों के बीच भिन्न हो सकता है',
      },
    },
    documents: {
      en: [
        'Identity Proof (Aadhaar/Voter ID/Driving License)',
        'Address Proof',
        'Land ownership or lease documents',
        'Project report',
        'Bank account details',
        'Quotations for equipment/animals to be purchased',
      ],
      hi: [
        'पहचान प्रमाण (आधार/वोटर आईडी/ड्राइविंग लाइसेंस)',
        'पता प्रमाण',
        'भूमि स्वामित्व या पट्टा दस्तावेज',
        'परियोजना रिपोर्ट',
        'बैंक खाता विवरण',
        'खरीदे जाने वाले उपकरण/पशुओं के लिए कोटेशन',
      ],
    },
    benefits: {
      en: [
        '25% back-ended capital subsidy (33.33% for SC/ST farmers)',
        'Subsidy ceiling of Rs. 10 lakh for technical civil works',
        'Flexible repayment schedule',
        'Insurance coverage for animals and assets',
      ],
      hi: [
        '25% बैक-एंडेड पूंजी सब्सिडी (SC/ST किसानों के लिए 33.33%)',
        'तकनीकी सिविल कार्यों के लिए रु. 10 लाख की सब्सिडी सीमा',
        'लचीला पुनर्भुगतान कार्यक्रम',
        'पशुओं और संपत्तियों के लिए बीमा कवरेज',
      ],
    },
    applicationProcess: {
      en: 'Prepare a detailed project report for the dairy farm. Submit the application along with the project report and required documents to your nearest bank branch. The bank will forward the application to NABARD for approval of subsidy. After approval, the loan will be disbursed and the subsidy will be kept in a subsidy reserve fund account.',
      hi: 'डेयरी फार्म के लिए एक विस्तृत परियोजना रिपोर्ट तैयार करें। परियोजना रिपोर्ट और आवश्यक दस्तावेजों के साथ आवेदन अपनी निकटतम बैंक शाखा में जमा करें। बैंक सब्सिडी की मंजूरी के लिए आवेदन NABARD को अग्रेषित करेगा। मंजूरी के बाद, ऋण वितरित किया जाएगा और सब्सिडी को एक सब्सिडी रिजर्व फंड खाते में रखा जाएगा।',
    },
    contactInfo: {
      phone: '1800-180-1111',
      email: 'info@nabard.org',
      website: 'https://www.nabard.org',
    },
    availableStates: ['All India'],
    availableDistricts: { 'All India': ['All Districts'] },
    lastUpdated: Date.now(),
  },
];

// Mock scheme data for offline use
const mockSchemes: SchemeInfo[] = [
  {
    id: 'scheme-001',
    name: {
      en: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
      hi: 'प्रधानमंत्री किसान सम्मान निधि (PM-KISAN)',
    },
    provider: 'central',
    type: 'subsidy',
    category: 'general',
    description: {
      en: 'PM-KISAN is a Central Sector scheme with 100% funding from the Government of India. Under the scheme, income support of Rs. 6,000 per year is provided to all farmer families across the country in three equal installments of Rs. 2,000 each every four months.',
      hi: 'PM-KISAN भारत सरकार से 100% वित्त पोषण के साथ एक केंद्रीय क्षेत्र योजना है। इस योजना के तहत, देश भर के सभी किसान परिवारों को हर चार महीने में रु. 2,000 की तीन समान किस्तों में प्रति वर्ष रु. 6,000 की आय सहायता प्रदान की जाती है।',
    },
    eligibility: {
      en: [
        'All landholding farmer families with cultivable land',
        'Small and Marginal Farmers (SMF) with landholdings up to 2 hectares',
        'Subject to exclusion criteria based on higher income status',
      ],
      hi: [
        'खेती योग्य भूमि वाले सभी भूमिधारक किसान परिवार',
        '2 हेक्टेयर तक की भूमि वाले छोटे और सीमांत किसान (SMF)',
        'उच्च आय स्थिति के आधार पर बहिष्करण मानदंड के अधीन',
      ],
    },
    benefits: {
      en: [
        'Direct income support of Rs. 6,000 per year',
        'Amount transferred directly to bank accounts',
        'Helps farmers meet farm input costs',
        'Provides financial support for household needs',
      ],
      hi: [
        'प्रति वर्ष रु. 6,000 की प्रत्यक्ष आय सहायता',
        'राशि सीधे बैंक खातों में स्थानांतरित की जाती है',
        'किसानों को कृषि इनपुट लागत को पूरा करने में मदद करता है',
        'घरेलू जरूरतों के लिए वित्तीय सहायता प्रदान करता है',
      ],
    },
    documents: {
      en: [
        'Aadhaar Card',
        'Land Records',
        'Bank Account details',
        'Self-declaration form',
      ],
      hi: [
        'आधार कार्ड',
        'भूमि रिकॉर्ड',
        'बैंक खाता विवरण',
        'स्व-घोषणा पत्र',
      ],
    },
    applicationProcess: {
      en: 'Farmers can register through the local Common Service Centers (CSCs), Agriculture Officers, or online through the PM-KISAN portal. Required documents need to be submitted for verification. After verification by state/UT governments, the amount is directly transferred to the bank account of the beneficiary.',
      hi: 'किसान स्थानीय कॉमन सर्विस सेंटर (CSCs), कृषि अधिकारियों के माध्यम से, या PM-KISAN पोर्टल के माध्यम से ऑनलाइन पंजीकरण कर सकते हैं। सत्यापन के लिए आवश्यक दस्तावेज जमा करने होंगे। राज्य/केंद्र शासित प्रदेश सरकारों द्वारा सत्यापन के बाद, राशि सीधे लाभार्थी के बैंक खाते में स्थानांतरित की जाती है।',
    },
    contactInfo: {
      phone: '011-23381092',
      email: 'pmkisan-ict@gov.in',
      website: 'https://pmkisan.gov.in',
    },
    availableStates: ['All India'],
    lastUpdated: Date.now(),
  },
  {
    id: 'scheme-002',
    name: {
      en: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
      hi: 'प्रधानमंत्री फसल बीमा योजना (PMFBY)',
    },
    provider: 'central',
    type: 'insurance',
    category: 'general',
    description: {
      en: 'PMFBY provides comprehensive insurance coverage against crop failure due to non-preventable natural risks, thus helping stabilize farmers\'s income and encourage them to adopt innovative practices.',
      hi: 'PMFBY गैर-निवारणीय प्राकृतिक जोखिमों के कारण फसल विफलता के खिलाफ व्यापक बीमा कवरेज प्रदान करता है, इस प्रकार किसानों की आय को स्थिर करने में मदद करता है और उन्हें नवीन प्रथाओं को अपनाने के लिए प्रोत्साहित करता है।',
    },
    eligibility: {
      en: [
        'All farmers growing notified crops in notified areas',
        'Both loanee and non-loanee farmers',
        'Sharecroppers and tenant farmers',
      ],
      hi: [
        'अधिसूचित क्षेत्रों में अधिसूचित फसलों की खेती करने वाले सभी किसान',
        'ऋणी और गैर-ऋणी दोनों किसान',
        'बटाईदार और किरायेदार किसान',
      ],
    },
    benefits: {
      en: [
        'Low premium rates: 2% for Kharif, 1.5% for Rabi, and 5% for commercial/horticultural crops',
        'Full sum insured coverage for crop losses',
        'Coverage for prevented sowing, mid-season adversities, and post-harvest losses',
        'Use of technology for faster claim settlement',
      ],
      hi: [
        'कम प्रीमियम दरें: खरीफ के लिए 2%, रबी के लिए 1.5%, और वाणिज्यिक/बागवानी फसलों के लिए 5%',
        'फसल नुकसान के लिए पूर्ण बीमित राशि कवरेज',
        'रोकी गई बुवाई, मध्य-मौसम प्रतिकूलताओं और कटाई के बाद के नुकसान के लिए कवरेज',
        'तेज़ दावा निपटान के लिए प्रौद्योगिकी का उपयोग',
      ],
    },
    documents: {
      en: [
        'Land Records or Tenant/Sharecropping Agreement',
        'Aadhaar Card',
        'Bank Account details',
        'Sowing Certificate',
        'Premium payment receipt',
      ],
      hi: [
        'भूमि रिकॉर्ड या किरायेदार/बटाईदारी समझौता',
        'आधार कार्ड',
        'बैंक खाता विवरण',
        'बुवाई प्रमाणपत्र',
        'प्रीमियम भुगतान रसीद',
      ],
    },
    applicationProcess: {
      en: 'For loanee farmers, coverage is compulsory and premium is deducted from the loan amount. Non-loanee farmers can apply through the nearest bank branch, Common Service Centers, or online through the PMFBY portal. Premium needs to be paid before the cut-off date for the respective crop season.',
      hi: 'ऋणी किसानों के लिए, कवरेज अनिवार्य है और प्रीमियम ऋण राशि से काट लिया जाता है। गैर-ऋणी किसान निकटतम बैंक शाखा, कॉमन सर्विस सेंटर, या PMFBY पोर्टल के माध्यम से ऑनलाइन आवेदन कर सकते हैं। संबंधित फसल मौसम के लिए कट-ऑफ तिथि से पहले प्रीमियम का भुगतान करना होगा।',
    },
    contactInfo: {
      phone: '011-23384929',
      email: 'pmfby-agri@gov.in',
      website: 'https://pmfby.gov.in',
    },
    availableStates: ['All India'],
    lastUpdated: Date.now(),
  },
  {
    id: 'scheme-003',
    name: {
      en: 'Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)',
      hi: 'प्रधानमंत्री कृषि सिंचाई योजना (PMKSY)',
    },
    provider: 'central',
    type: 'infrastructure',
    category: 'general',
    description: {
      en: 'PMKSY aims to ensure access to some means of protective irrigation to all agricultural farms in the country, to produce 'per drop more crop', thus bringing much desired rural prosperity.',
      hi: 'PMKSY का उद्देश्य देश के सभी कृषि फार्मों को संरक्षित सिंचाई के कुछ साधनों तक पहुंच सुनिश्चित करना है, 'प्रति बूंद अधिक फसल' का उत्पादन करना है, इस प्रकार बहुत वांछित ग्रामीण समृद्धि लाना है।',
    },
    eligibility: {
      en: [
        'All farmers',
        'Priority to small and marginal farmers',
        'SC/ST farmers and women farmers',
      ],
      hi: [
        'सभी किसान',
        'छोटे और सीमांत किसानों को प्राथमिकता',
        'SC/ST किसान और महिला किसान',
      ],
    },
    benefits: {
      en: [
        'Subsidy for micro-irrigation systems (drip and sprinkler)',
        'Development of water sources for irrigation',
        'Improved water use efficiency',
        'Enhanced crop productivity',
        'Sustainable water conservation practices',
      ],
      hi: [
        'सूक्ष्म-सिंचाई प्रणालियों (ड्रिप और स्प्रिंकलर) के लिए सब्सिडी',
        'सिंचाई के लिए जल स्रोतों का विकास',
        'बेहतर जल उपयोग दक्षता',
        'बढ़ी हुई फसल उत्पादकता',
        'स्थायी जल संरक्षण प्रथाएं',
      ],
    },
    documents: {
      en: [
        'Land Records',
        'Aadhaar Card',
        'Bank Account details',
        'Quotation for micro-irrigation system (if applicable)',
        'Water source details',
      ],
      hi: [
        'भूमि रिकॉर्ड',
        'आधार कार्ड',
        'बैंक खाता विवरण',
        'सूक्ष्म-सिंचाई प्रणाली के लिए कोटेशन (यदि लागू हो)',
        'जल स्रोत विवरण',
      ],
    },
    applicationProcess: {
      en: 'Farmers can apply through the Agriculture Department of their respective state or through the PMKSY portal. The application needs to be submitted along with the required documents. After verification, the subsidy is provided for the implementation of the irrigation system.',
      hi: 'किसान अपने संबंधित राज्य के कृषि विभाग के माध्यम से या PMKSY पोर्टल के माध्यम से आवेदन कर सकते हैं। आवेदन को आवश्यक दस्तावेजों के साथ जमा करना होगा। सत्यापन के बाद, सिंचाई प्रणाली के कार्यान्वयन के लिए सब्सिडी प्रदान की जाती है।',
    },
    contactInfo: {
      phone: '011-23382651',
      email: 'pmksy-mowr@gov.in',
      website: 'https://pmksy.gov.in',
    },
    availableStates: ['All India'],
    lastUpdated: Date.now(),
  },
];

// Mock insurance data for offline use
const mockInsurance: InsuranceInfo[] = [
  {
    id: 'insurance-001',
    name: {
      en: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
      hi: 'प्रधानमंत्री फसल बीमा योजना (PMFBY)',
    },
    provider: 'Various Insurance Companies',
    type: 'crop',
    description: {
      en: 'PMFBY provides comprehensive risk coverage for crops against non-preventable natural risks from pre-sowing to post-harvest losses. It aims to stabilize farmers\'s income to ensure their continuance in farming.',
      hi: 'PMFBY बुवाई पूर्व से लेकर कटाई के बाद के नुकसान तक गैर-निवारणीय प्राकृतिक जोखिमों के खिलाफ फसलों के लिए व्यापक जोखिम कवरेज प्रदान करता है। इसका उद्देश्य किसानों की आय को स्थिर करना है ताकि खेती में उनकी निरंतरता सुनिश्चित हो सके।',
    },
    coverage: {
      en: [
        'Yield losses due to non-preventable risks like drought, flood, pests, etc.',
        'Prevented sowing due to adverse weather conditions',
        'Post-harvest losses for crops kept in the field for drying',
        'Localized calamities like landslide, hailstorm, etc.',
      ],
      hi: [
        'सूखा, बाढ़, कीट आदि जैसे गैर-निवारणीय जोखिमों के कारण उपज हानि',
        'प्रतिकूल मौसम की स्थिति के कारण रोकी गई बुवाई',
        'सुखाने के लिए खेत में रखी फसलों के लिए कटाई के बाद के नुकसान',
        'भूस्खलन, ओलावृष्टि आदि जैसी स्थानीय आपदाएं',
      ],
    },
    premium: {
      type: 'percentage',
      value: 2,
      notes: {
        en: '2% for Kharif crops, 1.5% for Rabi crops, and 5% for commercial/horticultural crops. Remaining premium is subsidized by the government.',
        hi: 'खरीफ फसलों के लिए 2%, रबी फसलों के लिए 1.5%, और वाणिज्यिक/बागवानी फसलों के लिए 5%। शेष प्रीमियम सरकार द्वारा सब्सिडी दी जाती है।',
      },
    },
    sumInsured: {
      min: 10000,
      max: 100000,
      currency: 'INR per hectare',
    },
    eligibility: {
      en: [
        'All farmers growing notified crops in notified areas',
        'Both loanee and non-loanee farmers',
        'Sharecroppers and tenant farmers',
      ],
      hi: [
        'अधिसूचित क्षेत्रों में अधिसूचित फसलों की खेती करने वाले सभी किसान',
        'ऋणी और गैर-ऋणी दोनों किसान',
        'बटाईदार और किरायेदार किसान',
      ],
    },
    documents: {
      en: [
        'Land Records or Tenant/Sharecropping Agreement',
        'Aadhaar Card',
        'Bank Account details',
        'Sowing Certificate',
        'Premium payment receipt',
      ],
      hi: [
        'भूमि रिकॉर्ड या किरायेदार/बटाईदारी समझौता',
        'आधार कार्ड',
        'बैंक खाता विवरण',
        'बुवाई प्रमाणपत्र',
        'प्रीमियम भुगतान रसीद',
      ],
    },
    claimProcess: {
      en: 'Claims are processed based on yield data from Crop Cutting Experiments (CCEs) conducted by the state government. If the actual yield is less than the threshold yield, all insured farmers in the notified area become eligible for claims. For localized calamities and post-harvest losses, farmers need to intimate the insurance company within 72 hours through the designated channel.',
      hi: 'दावों को राज्य सरकार द्वारा आयोजित फसल कटाई प्रयोगों (CCEs) से उपज डेटा के आधार पर संसाधित किया जाता है। यदि वास्तविक उपज सीमा उपज से कम है, तो अधिसूचित क्षेत्र में सभी बीमित किसान दावों के लिए पात्र हो जाते हैं। स्थानीय आपदाओं और कटाई के बाद के नुकसान के लिए, किसानों को निर्दिष्ट चैनल के माध्यम से 72 घंटों के भीतर बीमा कंपनी को सूचित करना होगा।',
    },
    contactInfo: {
      phone: '011-23384929',
      email: 'pmfby-agri@gov.in',
      website: 'https://pmfby.gov.in',
    },
    availableStates: ['All India'],
    lastUpdated: Date.now(),
  },
  {
    id: 'insurance-002',
    name: {
      en: 'Livestock Insurance Scheme',
      hi: 'पशुधन बीमा योजना',
    },
    provider: 'Various Insurance Companies',
    type: 'livestock',
    description: {
      en: 'The Livestock Insurance Scheme provides protection to farmers and cattle rearers against the loss of their animals due to death or permanent total disability. It aims to provide social and economic security to farmers dependent on livestock.',
      hi: 'पशुधन बीमा योजना किसानों और पशुपालकों को उनके पशुओं की मृत्यु या स्थायी पूर्ण विकलांगता के कारण होने वाले नुकसान के खिलाफ सुरक्षा प्रदान करती है। इसका उद्देश्य पशुधन पर निर्भर किसानों को सामाजिक और आर्थिक सुरक्षा प्रदान करना है।',
    },
    coverage: {
      en: [
        'Death of the animal due to diseases, accidents, or natural calamities',
        'Permanent total disability rendering the animal unproductive',
        'Surgical operations in some cases',
        'Emergency veterinary care in some policies',
      ],
      hi: [
        'बीमारियों, दुर्घटनाओं या प्राकृतिक आपदाओं के कारण पशु की मृत्यु',
        'स्थायी पूर्ण विकलांगता जो पशु को अनुत्पादक बना देती है',
        'कुछ मामलों में सर्जिकल ऑपरेशन',
        'कुछ पॉलिसियों में आपातकालीन पशु चिकित्सा देखभाल',
      ],
    },
    premium: {
      type: 'percentage',
      value: 3,
      notes: {
        en: 'Premium rates vary from 3% to 5% of the sum insured. Government provides 50% subsidy on the premium for a maximum of 2 animals per beneficiary.',
        hi: 'प्रीमियम दरें बीमित राशि के 3% से 5% तक भिन्न होती हैं। सरकार प्रति लाभार्थी अधिकतम 2 पशुओं के लिए प्रीमियम पर 50% सब्सिडी प्रदान करती है।',
      },
    },
    sumInsured: {
      min: 5000,
      max: 100000,
      currency: 'INR per animal',
    },
    eligibility: {
      en: [
        'All farmers and cattle rearers',
        'Animals should be healthy and between 2-10 years of age',
        'Animals should be properly tagged for identification',
      ],
      hi: [
        'सभी किसान और पशुपालक',
        'पशु स्वस्थ और 2-10 वर्ष की आयु के बीच होने चाहिए',
        'पहचान के लिए पशुओं को उचित रूप से टैग किया जाना चाहिए',
      ],
    },
    documents: {
      en: [
        'Identity Proof (Aadhaar/Voter ID)',
        'Address Proof',
        'Bank Account details',
        'Animal health certificate from a veterinarian',
        'Animal identification details (tag number, photographs)',
      ],
      hi: [
        'पहचान प्रमाण (आधार/वोटर आईडी)',
        'पता प्रमाण',
        'बैंक खाता विवरण',
        'पशु चिकित्सक से पशु स्वास्थ्य प्रमाणपत्र',
        'पशु पहचान विवरण (टैग नंबर, फोटोग्राफ)',
      ],
    },
    claimProcess: {
      en: 'In case of death of the insured animal, the farmer should inform the insurance company within 24 hours. A veterinarian will conduct a post-mortem and issue a death certificate. The farmer needs to submit the claim form along with the death certificate and other required documents to the insurance company. After verification, the claim amount is transferred to the farmer\'s bank account.',
      hi: 'बीमित पशु की मृत्यु के मामले में, किसान को 24 घंटों के भीतर बीमा कंपनी को सूचित करना चाहिए। एक पशु चिकित्सक पोस्टमार्टम करेगा और मृत्यु प्रमाणपत्र जारी करेगा। किसान को मृत्यु प्रमाणपत्र और अन्य आवश्यक दस्तावेजों के साथ दावा फॉर्म बीमा कंपनी को जमा करना होगा। सत्यापन के बाद, दावा राशि किसान के बैंक खाते में स्थानांतरित कर दी जाती है।',
    },
    contactInfo: {
      phone: '1800-180-1551',
      email: 'livestock-insurance@gov.in',
      website: 'https://dahd.nic.in',
    },
    availableStates: ['All India'],
    lastUpdated: Date.now(),
  },
  {
    id: 'insurance-003',
    name: {
      en: 'Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)',
      hi: 'प्रधानमंत्री जीवन ज्योति बीमा योजना (PMJJBY)',
    },
    provider: 'LIC and other Life Insurance Companies',
    type: 'life',
    description: {
      en: 'PMJJBY is a government-backed life insurance scheme aimed at increasing the penetration of life insurance coverage in India. It offers a life cover of Rs. 2 lakh at a very affordable premium of Rs. 330 per annum.',
      hi: 'PMJJBY भारत में जीवन बीमा कवरेज की पहुंच बढ़ाने के उद्देश्य से एक सरकार समर्थित जीवन बीमा योजना है। यह प्रति वर्ष रु. 330 के बहुत किफायती प्रीमियम पर रु. 2 लाख का जीवन कवर प्रदान करता है।',
    },
    coverage: {
      en: [
        'Death due to any reason',
        'Rs. 2 lakh sum assured',
      ],
      hi: [
        'किसी भी कारण से मृत्यु',
        'रु. 2 लाख की बीमित राशि',
      ],
    },
    premium: {
      type: 'fixed',
      value: 330,
      notes: {
        en: 'Rs. 330 per annum, auto-debited from the bank account',
        hi: 'प्रति वर्ष रु. 330, बैंक खाते से स्वतः डेबिट',
      },
    },
    sumInsured: {
      min: 200000,
      max: 200000,
      currency: 'INR',
    },
    eligibility: {
      en: [
        'Age between 18-50 years',
        'Must have a bank account',
        'Must provide Aadhaar as KYC document',
      ],
      hi: [
        'आयु 18-50 वर्ष के बीच',
        'बैंक खाता होना चाहिए',
        'KYC दस्तावेज के रूप में आधार प्रदान करना चाहिए',
      ],
    },
    documents: {
      en: [
        'Aadhaar Card',
        'Bank Account details',
        'Nomination details',
      ],
      hi: [
        'आधार कार्ड',
        'बैंक खाता विवरण',
        'नामांकन विवरण',
      ],
    },
    claimProcess: {
      en: 'In case of death of the insured person, the nominee needs to submit the claim form along with the death certificate and other required documents to the bank branch where the deceased had an account. The bank will forward the claim to the insurance company. After verification, the claim amount is transferred to the nominee\'s bank account.',
      hi: 'बीमित व्यक्ति की मृत्यु के मामले में, नामिती को मृत्यु प्रमाणपत्र और अन्य आवश्यक दस्तावेजों के साथ दावा फॉर्म उस बैंक शाखा में जमा करना होगा जहां मृतक का खाता था। बैंक दावे को बीमा कंपनी को अग्रेषित करेगा। सत्यापन के बाद, दावा राशि नामिती के बैंक खाते में स्थानांतरित कर दी जाती है।',
    },
    contactInfo: {
      phone: '1800-180-1111',
      email: 'pmjjby-support@gov.in',
      website: 'https://www.jansuraksha.gov.in',
    },
    availableStates: ['All India'],
    lastUpdated: Date.now(),
  },
];

// Function to fetch all loans
export const getAllLoans = async (): Promise<{ data: LoanInfo[], isOffline: boolean }> => {
  try {
    // In a real implementation, this would call an API
    // For now, we'll return mock data
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Store in local storage for offline use
    localStorage.setItem('loanData', JSON.stringify(mockLoans));
    
    return { data: mockLoans, isOffline: false };
  } catch (error) {
    console.warn('Failed to fetch loan data, using cached data:', error);
    
    // Try to get cached data
    const cachedDataJson = localStorage.getItem('loanData');
    if (cachedDataJson) {
      const cachedData: LoanInfo[] = JSON.parse(cachedDataJson);
      return { data: cachedData, isOffline: true };
    }
    
    // If no cached data, return mock data
    return { data: mockLoans, isOffline: true };
  }
};

// Function to fetch all schemes
export const getAllSchemes = async (): Promise<{ data: SchemeInfo[], isOffline: boolean }> => {
  try {
    // In a real implementation, this would call an API
    // For now, we'll return mock data
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Store in local storage for offline use
    localStorage.setItem('schemeData', JSON.stringify(mockSchemes));
    
    return { data: mockSchemes, isOffline: false };
  } catch (error) {
    console.warn('Failed to fetch scheme data, using cached data:', error);
    
    // Try to get cached data
    const cachedDataJson = localStorage.getItem('schemeData');
    if (cachedDataJson) {
      const cachedData: SchemeInfo[] = JSON.parse(cachedDataJson);
      return { data: cachedData, isOffline: true };
    }
    
    // If no cached data, return mock data
    return { data: mockSchemes, isOffline: true };
  }
};

// Function to fetch all insurance options
export const getAllInsurance = async (): Promise<{ data: InsuranceInfo[], isOffline: boolean }> => {
  try {
    // In a real implementation, this would call an API
    // For now, we'll return mock data
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Store in local storage for offline use
    localStorage.setItem('insuranceData', JSON.stringify(mockInsurance));
    
    return { data: mockInsurance, isOffline: false };
  } catch (error) {
    console.warn('Failed to fetch insurance data, using cached data:', error);
    
    // Try to get cached data
    const cachedDataJson = localStorage.getItem('insuranceData');
    if (cachedDataJson) {
      const cachedData: InsuranceInfo[] = JSON.parse(cachedDataJson);
      return { data: cachedData, isOffline: true };
    }
    
    // If no cached data, return mock data
    return { data: mockInsurance, isOffline: true };
  }
};

// Function to filter loans by state and district
export const filterLoansByLocation = async (state: string, district?: string): Promise<LoanInfo[]> => {
  try {
    // Get all loans
    const { data: allLoans } = await getAllLoans();
    
    // Filter loans based on location
    return allLoans.filter(loan => {
      // Check if loan is available in the specified state
      const isStateAvailable = loan.availableStates.includes('All India') || 
                              loan.availableStates.includes(state);
      
      // If district is specified, check if loan is available in the specified district
      if (district && isStateAvailable) {
        const districtsInState = loan.availableDistricts[state] || [];
        const isDistrictAvailable = districtsInState.includes('All Districts') || 
                                   districtsInState.includes(district);
        return isDistrictAvailable;
      }
      
      return isStateAvailable;
    });
  } catch (error) {
    console.error('Error filtering loans by location:', error);
    throw error;
  }
};

// Function to filter schemes by type and category
export const filterSchemes = async (type?: string, category?: string): Promise<SchemeInfo[]> => {
  try {
    // Get all schemes
    const { data: allSchemes } = await getAllSchemes();
    
    // Filter schemes based on type and category
    return allSchemes.filter(scheme => {
      // Check if scheme matches the specified type
      const isTypeMatch = !type || scheme.type === type;
      
      // Check if scheme matches the specified category
      const isCategoryMatch = !category || scheme.category === category;
      
      return isTypeMatch && isCategoryMatch;
    });
  } catch (error) {
    console.error('Error filtering schemes:', error);
    throw error;
  }
};

// Function to filter insurance by type and provider
export const filterInsurance = async (type?: string, provider?: string): Promise<InsuranceInfo[]> => {
  try {
    // Get all insurance options
    const { data: allInsurance } = await getAllInsurance();
    
    // Filter insurance based on type and provider
    return allInsurance.filter(insurance => {
      // Check if insurance matches the specified type
      const isTypeMatch = !type || insurance.type === type;
      
      // Check if insurance matches the specified provider
      const isProviderMatch = !provider || insurance.provider.includes(provider);
      
      return isTypeMatch && isProviderMatch;
    });
  } catch (error) {
    console.error('Error filtering insurance:', error);
    throw error;
  }
};

// Function to calculate loan EMI
export const calculateLoanEMI = (principal: number, interestRate: number, tenureInMonths: number): {
  emi: number;
  totalPayment: number;
  totalInterest: number;
  amortizationSchedule: Array<{
    month: number;
    emi: number;
    principal: number;
    interest: number;
    balance: number;
  }>;
} => {
  // Convert annual interest rate to monthly
  const monthlyInterestRate = interestRate / 12 / 100;
  
  // Calculate EMI using formula: EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
  const emi = principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, tenureInMonths) / (Math.pow(1 + monthlyInterestRate, tenureInMonths) - 1);
  
  // Calculate total payment and interest
  const totalPayment = emi * tenureInMonths;
  const totalInterest = totalPayment - principal;
  
  // Generate amortization schedule
  const amortizationSchedule = [];
  let remainingPrincipal = principal;
  
  for (let month = 1; month <= tenureInMonths; month++) {
    // Calculate interest for this month
    const interestForMonth = remainingPrincipal * monthlyInterestRate;
    
    // Calculate principal for this month
    const principalForMonth = emi - interestForMonth;
    
    // Update remaining principal
    remainingPrincipal -= principalForMonth;
    
    // Add to amortization schedule
    amortizationSchedule.push({
      month,
      emi,
      principal: principalForMonth,
      interest: interestForMonth,
      balance: remainingPrincipal > 0 ? remainingPrincipal : 0,
    });
  }
  
  return {
    emi,
    totalPayment,
    totalInterest,
    amortizationSchedule,
  };
};

// Function to get loan eligibility based on income and existing loans
export const getLoanEligibility = (monthlyIncome: number, existingEMIs: number, loanAmount: number, interestRate: number, tenureInMonths: number): {
  isEligible: boolean;
  maxEligibleAmount?: number;
  reason?: string;
} => {
  // Calculate EMI for the requested loan
  const { emi } = calculateLoanEMI(loanAmount, interestRate, tenureInMonths);
  
  // Calculate total EMI including existing EMIs
  const totalEMI = emi + existingEMIs;
  
  // Check if total EMI exceeds 50% of monthly income (standard banking practice)
  if (totalEMI > monthlyIncome * 0.5) {
    // Calculate maximum eligible loan amount
    const maxEMI = monthlyIncome * 0.5 - existingEMIs;
    
    // If maxEMI is negative or zero, the person is not eligible for any loan
    if (maxEMI <= 0) {
      return {
        isEligible: false,
        reason: 'Existing EMIs already exceed 50% of monthly income',
      };
    }
    
    // Calculate maximum eligible loan amount using the inverse of EMI formula
    // P = EMI * ((1 + r)^n - 1) / (r * (1 + r)^n)
    const monthlyInterestRate = interestRate / 12 / 100;
    const maxEligibleAmount = maxEMI * (Math.pow(1 + monthlyInterestRate, tenureInMonths) - 1) / (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, tenureInMonths));
    
    return {
      isEligible: false,
      maxEligibleAmount,
      reason: 'Total EMI exceeds 50% of monthly income',
    };
  }
  
  return { isEligible: true };
};