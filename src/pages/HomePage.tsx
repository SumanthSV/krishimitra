import React, {useEffect} from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import HomepageImage from '../assests/Forest-2.png';
import {
  Sprout,
  Banknote,
  ArrowRight,
  Cloud,
  Leaf, 
  Bot, 
  Sun, 
  Wallet, 
  Languages,
  FileText,
  MessageCircle
} from 'lucide-react';
import Footer from '../components/Footer.tsx';

const HomePage = () => {

  useEffect(() => {

    const fetchData = async () => {
      try{
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}`);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const features = [
    {
      icon: <Leaf className="w-8 h-8 text-green-700" />,
      title: 'Crop Information',
      description: 'Detailed crop guides, planting tips, and best practices for major crops.',
      link: "/crops",
    },
    {
      icon: <Bot className="w-8 h-8 text-green-700" />,
      title: 'AI Chatbot',
      description: 'Ask farming questions and get instant, practical advice.',
      link: "/chat",
    },
    // {
    //   icon: <Sun className="w-8 h-8 text-green-700" />,
    //   title: 'Weather',
    //   description: 'Local weather forecasts and alerts to plan field activities.',
    //   link: "/weather",
    // },
    {
      icon: <Wallet className="w-8 h-8 text-green-700" />,
      title: 'Finance & Subsidies',
      description: 'Information on loans, subsidies and financial support for farmers.',
      link: "/bank-policies",
    },
    {
      icon: <FileText className="w-8 h-8 text-green-700" />,
      title: 'Government Schemes',
      description: 'Search and explore relevant agriculture and welfare schemes.',
      link: "/govt-schemes",
    },
    // {
    //   icon: <Languages className="w-8 h-8 text-green-700" />,
    //   title: 'Profile & Language',
    //   description: 'Manage your profile, location and preferred language.',
    //   link: "/profile",
    // },
  ];


  return (
    <div className="mx-auto max-w-9xl bg-white space-y-0 text-gray-800">
      {/* Hero Section */}
      <div 
        style={{
          backgroundImage: `url(${HomepageImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }} 
        className="h-screen -mt-14 flex flex-col lg:flex-row items-center justify-center md:justify-start px-4 sm:px-6 lg:px-20"
      >
        <section className="flex text-green-500 rounded-2xl p-6 lg:p-10 max-w-2xl">
          <div className="flex flex-col items-start">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl text-[#0f5d23] font-extralight leading-tight mb-4">
              <span className="text-4xl sm:text-5xl lg:text-7xl text-[#0f5d23] font-extrabold leading-tight">AI:</span> Welcome to KrishiMitra
            </h1>
            <p className="text-lg sm:text-xl text-[#154123] opacity-90 mb-6">Practical farming advice, weather, subsidies and localized recommendations to help you grow better.</p>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
              <Link
                to="/chat"
                className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-zinc-100 font-semibold py-3 px-6 rounded-lg transition duration-200 w-full sm:w-auto justify-center"
              >
                <MessageCircle size={20} />
                Start Chat
                <ArrowRight size={20} />
              </Link>
              
              <Link
                to="/crops"
                className="inline-flex items-center gap-2 bg-white shadow-[0px_0px_1px_1px_green] hover:bg-green-50 text-zinc-700 font-semibold py-3 px-6 rounded-lg transition duration-200 w-full sm:w-auto justify-center"
              >
                <Sprout size={20} />
                Explore Crops
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Location Based Advice */}
      

      {/* Features Section */}
      <section className="py-12 px-6 bg-white text-gray-800">
        <h2 className="text-3xl font-bold text-center mb-10">Features</h2>

        <div className="mx-auto max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <Link
              to={feature.link}
              key={index}
              className="flex flex-col items-center text-center max-w-md bg-gray-100 p-6 rounded-xl shadow hover:shadow-md hover:bg-green-50 transition-all duration-200 group"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-green-700 transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <div className='mb-24'>

      <section className="mt-20 px-6 mb-10">
        <div className="flex flex-col lg:flex-row max-w-7xl mx-auto bg-gradient-to-r from-green-100 via-green-200 to-green-300 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-8 lg:p-12 flex flex-col justify-center lg:w-1/2">
            <h2 className="text-4xl lg:text-6xl font-thin text-gray-800 mb-3">
              Ready to grow smarter with <span className="text-green-700 font-bold">KrishiMitra</span>?
            </h2>
            <p className="text-gray-700 text-base lg:text-lg leading-relaxed">
              Access localized guidance, weather forecasts, and scheme information tailored for your farm.
            </p>
          </div>
          <div className="lg:w-1/2 p-8 lg:p-14">
            <img
              src="https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGZhcm1pbmd8ZW58MHx8MHx8fDA%3D"
              alt="KrishiMitra Farming"
              className="object-cover h-full w-full rounded-xl"
            />
          </div>
        </div>
      </section>
      </div>
      {/* Footer Section */}
      <Footer/>
    </div>
  );
};

export default HomePage;