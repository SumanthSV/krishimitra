import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Menu, User, LogIn, LogOut, UserPlus, Languages, MenuIcon,PersonStandingIcon,LogOutIcon,LogInIcon ,  Leaf,
  MessageCircle,
  CloudSun,
  Banknote,
 } from 'lucide-react';

import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext.tsx';
import { useAuth } from '../contexts/AuthContext.tsx';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी' },
  { code: 'bn', name: 'বাংলা' },
  { code: 'te', name: 'తెలుగు' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'mr', name: 'मराठी' },
  { code: 'gu', name: 'ગુજરાતી' },
  { code: 'kn', name: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'മലയാളം' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ' },
];

interface HeaderProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, toggleSidebar }) => {

  const [languageMenuAnchor, setLanguageMenuAnchor] = useState<null | HTMLElement>(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const { language, setLanguage } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useTranslation();
  // const theme = useTheme();



  const handleLanguageMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setLanguageMenuAnchor(event.currentTarget);
  };

  const handleLanguageMenuClose = () => {
    setLanguageMenuAnchor(null);
  };

  const handleLanguageChange = (languageCode: string) => {
    setLanguage(languageCode);
    handleLanguageMenuClose();
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = async () => {
    await logout();
    handleUserMenuClose();
  };

  const startVoiceRecognition = () => {
    // Voice recognition functionality will be implemented here
    console.log('Starting voice recognition');
  };


  
  // Use useMemo to recreate the authItems array when the language changes (when t changes)
  const authItems = React.useMemo(() => {
    return isAuthenticated
      ? [
          { text: t('nav.profile'), icon: <PersonStandingIcon />, path: '/profile' },
          { text: t('nav.logout'), icon: <LogOutIcon />, onClick: handleLogout },
        ]
      : [
          { text: t('nav.Home'), icon: <LogInIcon />, path: '/login' },
          { text: t('nav.Chat'), icon: <LogInIcon />, path: '/register' },
          { text: t('nav.CropInfo'), icon: <LogInIcon />, path: '/register' },
          { text: t('nav.Diagnosis'), icon: <LogInIcon />, path: '/register' },
          { text: t('nav.register'), icon: <LogInIcon />, path: '/register' },
          { text: t('nav.login'), icon: <LogInIcon />, path: '/register' },
        ];
  }, [t, isAuthenticated, handleLogout]); // Dependencies ensure the array is recreated when language or auth state changes



  return (
    <>
     <nav className="fixed top-0 left-0 w-full z-90  text-black bg-white/30  backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
        {/* Left: Sidebar Toggle + Logo */}
        <div className="flex items-center space-x-4">
          {/* <button onClick={toggleSidebar} className="p-2 hover:bg-blue-500 rounded">
            <MenuIcon className="w-5 h-5" />
          </button> */}
            <Link
            className="hover:cursor:pointer"
                    to="/">
          <h1 className="text-lg font-semibold ">KrishiMitra</h1>
          </Link>
        </div>

        {/* Right: Language Switch + Auth/Profile */}
        <div className="relative flex items-center space-x-2 sm:space-x-4">
          {/* Language Switcher */}
          <div className="relative">
           
            {languageMenuAnchor && (
              <div className="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded shadow">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      handleLanguageChange(lang.code);
                      setLanguageMenuAnchor(false);
                    }}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-100 ${
                      language === lang.code ? 'font-bold' : ''
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Auth/Profile Section */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-8 h-8 bg-blue-800 text-white rounded-full flex items-center justify-center"
              >
                {user?.name?.charAt(0) || 'U'}
              </button>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded shadow">
                  <Link
                    to="/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center px-4 py-2 hover:bg-gray-100"
                  >
                    <User className="w-4 h-4 mr-2" />
                    {t('nav.profile')}
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={() => {
                      handleLogout();
                      setShowUserMenu(false);
                    }}
                    className="flex items-center w-full px-4 py-2 hover:bg-gray-100"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {t('nav.logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
           <div className="flex items-center space-x-3">
  <Link
    to="/crops"
    className="flex items-center px-3 py-1.5 hover:underline text-green-800 rounded hover:bg-green-100 text-sm font-medium"
  >
    <Leaf className="w-4 h-4 mr-1" />
    {t("CropInfo")}
  </Link>
  <Link
    to="/chat"
    className="flex items-center px-3 py-1.5 hover:underline  text-green-800 rounded hover:bg-green-100 text-sm font-medium"
  >
    <MessageCircle className="w-4 h-4 mr-1" />
    {t("ChatBot")}
  </Link>
  <Link
    to="/weather"
    className="flex items-center px-3 py-1.5 hover:underline  text-green-800 rounded hover:bg-green-100 text-sm font-medium"
  >
    <CloudSun className="w-4 h-4 mr-1" />
    {t("Weather")}
  </Link>
  <Link
    to="/finance"
    className="flex items-center px-3 py-1.5 hover:underline  text-green-800 rounded hover:bg-green-100 text-sm font-medium"
  >
    <Banknote className="w-4 h-4 mr-1" />
    {t("Finance")}
  </Link>
   <button
              onClick={() => setLanguageMenuAnchor(!languageMenuAnchor)}
              className="p-2  rounded"
            >
              <Languages className="w-5 h-5" />
            </button>
  <Link
    to="/login"
    className="flex items-center px-4 py-1.5 bg-green-700 text-white rounded hover:bg-green-800 text-sm font-semibold shadow"
  >
    <LogIn className="w-4 h-4 mr-1" />
    {t("nav.login")}
  </Link>
</div>
          )}
        </div>
      </div>
    </nav>
    </>
  );
};

export default Header;