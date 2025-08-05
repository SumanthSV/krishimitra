import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Menu, User, LogIn, LogOut, UserPlus, Languages, MenuIcon,PersonStandingIcon,LogOutIcon,LogInIcon } from 'lucide-react';

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
          { text: t('nav.login'), icon: <LogInIcon />, path: '/login' },
          { text: t('nav.register'), icon: <LogInIcon />, path: '/register' },
        ];
  }, [t, isAuthenticated, handleLogout]); // Dependencies ensure the array is recreated when language or auth state changes



  return (
    <>
     <nav className="fixed top-0 left-0 w-full z-90  text-black shadow backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
        {/* Left: Sidebar Toggle + Logo */}
        <div className="flex items-center space-x-4">
          <button onClick={toggleSidebar} className="p-2 hover:bg-blue-500 rounded">
            <MenuIcon className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">KrishiMitra</h1>
        </div>

        {/* Right: Language Switch + Auth/Profile */}
        <div className="relative flex items-center space-x-2 sm:space-x-4">
          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLanguageMenuAnchor(!languageMenuAnchor)}
              className="p-2 hover:bg-blue-500 rounded"
            >
              <Languages className="w-5 h-5" />
            </button>
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
            <div className="flex items-center space-x-2">
              <Link
                to="/login"
                className="flex items-center px-3 py-1 rounded hover:bg-blue-500 text-sm"
              >
                <LogIn className="w-4 h-4 mr-1" />
                {t('nav.login')}
              </Link>
              <Link
                to="/register"
                className="flex items-center px-3 py-1 border border-white rounded hover:bg-white hover:text-blue-700 text-sm"
              >
                <UserPlus className="w-4 h-4 mr-1" />
                {t('nav.register')}
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