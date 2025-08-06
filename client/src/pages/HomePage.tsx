import React from 'react';
import { Link } from 'react-router-dom';
// import {  Grass, AccountBalance, QuestionAnswer, ArrowForward } from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext.tsx';
import { useLocation } from '../contexts/LocationContext.tsx';
// import HomepageImage from '../assests/Land-Property-removebg-preview-Picsart-AiImageEnhancer.png'
// import HomepageImage from '../assests/Forest.png'
import HomepageImage from '../assests/Forest-2.png'
import {
  Sprout,
  Banknote,
  ArrowRight,
  Cloud,
 Leaf, Bot, Sun, Wallet, Languages
} from 'lucide-react';

const features = [
  {
    icon: "https://images.unsplash.com/photo-1498408040764-ab6eb772a145?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y3JvcHN8ZW58MHx8MHx8fDA%3D",
    title: "Crop Info",
    description: "Explore region-specific crop details, optimal sowing periods, pest risks, and fertilizers to maximize your yield. Designed to help farmers make informed choices for every season.",
    link: "/crop-info",
  },
  {
    icon: <Bot className="w-8 h-8 text-green-700" />,
    title: "ChatBot",
    description: "Instantly chat with our AI-powered assistant for farming advice, troubleshooting crop issues, or navigating government schemes. Available 24/7 in your local language.",
    link: "/chatbot",
  },
  {
    icon: <Sun className="w-8 h-8 text-green-700" />,
    title: "Weather",
    description: "Receive real-time weather forecasts tailored to your location including rainfall alerts, temperature shifts, and ideal sowing windows. Plan ahead to avoid losses.",
    link: "/weather",
  },
  {
    icon: <Wallet className="w-8 h-8 text-green-700" />,
    title: "Finance",
    description: "Access tools to track market prices, check eligibility for subsidies, and apply for low-interest crop loans. Stay financially informed throughout the season.",
    link: "/finance",
  },
  {
    icon: <Languages className="w-8 h-8 text-green-700" />,
    title: "Language Support",
    description: "Use the entire platform in your preferred Indian language. We support multilingual users to ensure no farmer is left behind due to language barriers.",
    link: "/language-support",
  },
];

const translations = {
  en: {
    welcome: 'for Agriculture, Made Simple',
    tagline: 'KrishiMitra empowers farmers with AI tools for smart planning, crop insights, and local language support. We simplify agriculture by helping you make better decisions from seed to harvest.',
    askQuestion: 'Ask a Question',
    GetStarted: 'Get started',
    weatherTitle: 'Weather Forecast',
    weatherDesc: 'Get real-time weather updates and forecasts for your region',
    cropTitle: 'Crop Information',
    cropDesc: 'Access detailed information about crops, seeds, and farming practices',
    financeTitle: 'Financial Assistance',
    financeDesc: 'Explore loans, subsidies, and government schemes for farmers',
    viewMore: 'View More',
    recentUpdates: 'Recent Updates',
    localizedAdvice: 'Localized Advice',
    basedOnLocation: 'Based on your location:',
    setLocation: 'Set Location',
  },
  hi: {
    welcome: 'कृषिमित्र में आपका स्वागत है',
    tagline: 'आपका AI-संचालित कृषि सलाहकार',
    askQuestion: 'प्रश्न पूछें',
    weatherTitle: 'मौसम का पूर्वानुमान',
    weatherDesc: 'अपने क्षेत्र के लिए वास्तविक समय के मौसम अपडेट और पूर्वानुमान प्राप्त करें',
    cropTitle: 'फसल जानकारी',
    cropDesc: 'फसलों, बीजों और खेती प्रथाओं के बारे में विस्तृत जानकारी प्राप्त करें',
    financeTitle: 'वित्तीय सहायता',
    financeDesc: 'किसानों के लिए ऋण, सब्सिडी और सरकारी योजनाओं का पता लगाएं',
    viewMore: 'और देखें',
    recentUpdates: 'हाल के अपडेट',
    localizedAdvice: 'स्थानीय सलाह',
    basedOnLocation: 'आपके स्थान के आधार पर:',
    setLocation: 'स्थान सेट करें',
  },
};

const HomePage = () => {
  const { language } = useLanguage();
  const { locationData } = useLocation();
  const t = translations[language] || translations.en;

  const weatherData = {
    temperature: '32°C',
    condition: 'Sunny',
    humidity: '65%',
    rainfall: '0mm',
  };

  return (
    <div   className=" -mt-16 mx-auto max-w-9xl bg-white space-y-0 text-gray-800">

      {/* Hero Section */}
      <div  style={{
    backgroundImage: `url(${HomepageImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    // maxWidth:'1280px'
  }} className="h-screen flex flex-row items-center justify-start">
      {/* <section className="bg-gradient-to-r from-green-600 via-green-800 to-black text-white rounded-2xl shadow-lg p-10"> */}
      <section className="text-green-500 rounded-2xl ml-20 p-10">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 max-w-xl">

            
            <h1 className="text-7xl text-[#0f5d23]  font-extralight leading-tight"><span className="text-7xl text-[#0f5d23] font-extrabold   leading-tight">AI</span> {t.welcome}</h1>
            <p className="text-xl mt-2 text-[#154123] opacity-90">{t.tagline}</p>
            <div className="flex flex-row items-center gap-3">

            <Link
              to="/chat"
              className="mt-4 inline-flex items-center gap-2 bg-green-700   hover:bg-green-800 text-zinc-100 font-semibold py-2 px-5 rounded-md transition duration-200"
              >
              {t.GetStarted}
              <ArrowRight size={20} />
            </Link>
             <Link
              to="/chat"
              className="mt-4 ml-2 inline-flex items-center gap-2 bg-white shadow-[0px_0px_1px_1px_green]  hover:bg-green-50 text-zinc-700 font-semibold py-2 px-5 rounded-md transition duration-200"
              >
              <Sprout size={20} />
              {t.askQuestion}
            </Link>
              </div>
          </div>
          {/* <div className="w-40 hidden md:block">
            <img src="/logo.svg" alt="KrishiMitra Logo" className="w-full drop-shadow-xl" />
          </div> */}
        </div>
      </section>
      {/* <section>
        <img className="h-[700px]" src={HomepageImage} alt="" />
      </section> */}
      </div>
      

      {/* Location Based Advice */}
      <section className="bg-white rounded-2xl  p-10 space-y-4  max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900">{t.localizedAdvice}</h2>
        <div className="text-gray-700 text-sm px-4 py-2 rounded-md bg-white/60 backdrop-blur-md shadow-sm border border-gray-200">
  {locationData.district && locationData.state ? (
    <p>
      {t.basedOnLocation}{' '}
      <strong className="text-gray-900">
        {locationData.district}, {locationData.state}
      </strong>
    </p>
  ) : locationData.coordinates ? (
    <p>
      {t.basedOnLocation}{' '}
      <strong className="text-gray-900">
        {locationData.coordinates.latitude.toFixed(2)},
        {locationData.coordinates.longitude.toFixed(2)}
      </strong>
    </p>
  ) : (
    <div className="flex items-center justify-between gap-4 ">
      <span className="text-gray-600">
        {locationData.isLoading ? 'Detecting location...' : 'Location not set'}
      </span>
      <Link
        to="/settings"
        className="border border-gray-300 text-gray-700 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-100 transition"
      >
        {t.setLocation}
      </Link>
    </div>
  )}
</div>


        {(locationData.district || locationData.coordinates) && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 text-center">
            <div className="bg-gray-50 p-4 rounded shadow-sm">
              <p className="text-xs text-gray-500">Temperature</p>
              <p className="text-lg font-semibold">{weatherData.temperature}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded shadow-sm">
              <p className="text-xs text-gray-500">Condition</p>
              <p className="text-lg font-semibold">{weatherData.condition}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded shadow-sm">
              <p className="text-xs text-gray-500">Humidity</p>
              <p className="text-lg font-semibold">{weatherData.humidity}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded shadow-sm">
              <p className="text-xs text-gray-500">Rainfall</p>
              <p className="text-lg font-semibold">{weatherData.rainfall}</p>
            </div>
          </div>
        )}
      </section>


   <section className="py-12 px-6 bg-white text-gray-800">
      <h2 className="text-3xl font-bold text-center mb-10">Our Features</h2>

      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-8">
        {features.map((feature, index) => (
          <Link
            to={feature.link}
            key={index}
            className="flex flex-col items-center text-center bg-gray-50 p-6 rounded-xl shadow hover:shadow-md hover:bg-green-50 transition"
          >
            <img
              src={feature.icon}
              alt={feature.title}
              className="w-20 h-20 object-contain mb-4"
            />
            <h3 className="text-lg font-semibold">{feature.title}</h3>
            <p className="text-sm text-gray-600">{feature.description}</p>
          </Link>
        ))}
      </div>
    </section>

      {/* Recent Updates */}
      <section className='max-w-6xl mx-auto'>
        <h2 className="text-3xl font-bold mb-6">{t.recentUpdates}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Weather Card */}
          <UpdateCard
            icon={<Cloud className="text-yellow-500" size={40} />}
            bg="bg-yellow-50"
            title={t.weatherTitle}
            desc={t.weatherDesc}
            link="/weather"
            label={t.viewMore}
          />

          {/* Crop Card */}
          <UpdateCard
            icon={<Sprout className="text-green-600" size={40} />}
            bg="bg-green-50"
            title={t.cropTitle}
            desc={t.cropDesc}
            link="/crops"
            label={t.viewMore}
          />

          {/* Finance Card */}
          <UpdateCard
            icon={<Banknote className="text-blue-600" size={40} />}
            bg="bg-blue-50"
            title={t.financeTitle}
            desc={t.financeDesc}
            link="/finance"
            label={t.viewMore}
          />
        </div>
      </section>


      <section className="mt-20">
        <div className="flex max-w-7xl mx-auto h-[70vh] bg-gradient-to-r from-green-100 via-green-200 to-green-300 rounded-2xl shadow-lg overflow-hidden">
  <div className="p-8 ml-8 flex flex-col justify-center w-1/2">
    <h2 className="text-6xl font-thin text-gray-800 mb-3">
      Empower Farming with <span className="text-green-700 font-bold">KrishiMitra</span>
    </h2>
    <p className="text-gray-700 text-md leading-relaxed">
      KrishiMitra is your smart farming partner — offering crop diagnosis, market prices, weather insights, and crop calendars in local languages. Make informed decisions from seed to harvest with AI-powered assistance built for farmers.
    </p>
  </div>
  <div className="w-1/2 p-14">
    <img
      src="https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGZhcm1pbmd8ZW58MHx8MHx8fDA%3D"
      alt="KrishiMitra Farming"
      className="object-cover h-full w-full rounded-xl"
    />
  </div>
</div>

      </section>


    </div>







  );
};

function UpdateCard({ icon, bg, title, desc, link, label }) {
  return (
   <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col overflow-hidden group border border-gray-100">
      
      {/* Icon Section */}
      <div className={`flex justify-center items-center h-40 ${bg} transition-all`}>
        <div className="text-5xl text-white">{icon}</div>
      </div>
      
      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-green-700 transition-colors">
            {title}
          </h3>
          <p className="mt-2 text-gray-600 text-sm leading-relaxed">
            {desc}
          </p>
        </div>
        
        {/* CTA Link */}
        <div className="mt-4">
          <Link
            to={link}
            className="text-green-700 hover:text-green-800 inline-flex items-center gap-1 text-sm font-medium"
          >
            {label} <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
