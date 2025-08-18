import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Leaf,
  MessageCircle,
  CloudSun,
  Banknote,
  Menu,
  X,
} from "lucide-react";

interface HeaderProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, toggleSidebar }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Home", icon: <Leaf className="w-4 h-4 mr-1" /> },
    {
      to: "/chat",
      label: "Chat bot",
      icon: <MessageCircle className="w-4 h-4 mr-1" />,
    },
    {
      to: "/govt-schemes",
      label: "Schemes",
      icon: <CloudSun className="w-4 h-4 mr-1" />,
    },
    {
      to: "/bank-policies",
      label: "Bank Policies",
      icon: <Banknote className="w-4 h-4 mr-1" />,
    },
    {
      to: "/crops",
      label: "Crop market Price",
      icon: <Banknote className="w-4 h-4 mr-1" />,
    },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 text-black bg-white/30 backdrop-blur-lg shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="hover:cursor-pointer">
          <h1 className="text-lg font-semibold">KrishiMitra</h1>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-3">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="flex items-center px-3 py-1.5 hover:underline text-zinc-800 rounded hover:bg-green-100 text-sm font-medium"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 rounded hover:bg-green-100"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md shadow-lg">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center px-3 py-2 rounded text-green-800 hover:bg-green-100 text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
