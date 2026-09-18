import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-[#070709]/90 backdrop-blur-lg border-b border-navy-600/50 shadow-sm shadow-accent/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="font-heading font-extrabold text-2xl tracking-tighter text-white drop-shadow-md">
              M3 <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-gold">Algox</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/#bots" className="text-gray-300 hover:text-accent transition-colors duration-300 font-medium tracking-wide text-sm">M3 Algo Bot</Link>
            <a href="https://wa.me/917721832978?text=Hi%2C%20I%20need%20support%20for%20M3%20Algox%20bot." target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-green-400 transition-colors duration-300 flex items-center gap-1.5 font-medium tracking-wide text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Support
            </a>
          </nav>

          {/* Right Section */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Enquiry / Chatbot */}
            {user && (
              <Link to="/chatbot" className="text-gray-300 hover:text-accent transition-colors flex items-center gap-2 font-medium text-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Chat with us
              </Link>
            )}

            {/* User Account */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-r from-accent to-accent-dark text-navy-900 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#070709] focus:ring-accent shadow-glow-gold transition-all"
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-navy-800 rounded-lg shadow-xl py-1 border border-navy-600/50 z-50 backdrop-blur-md">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-navy-700 hover:text-accent transition-colors"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-navy-700 hover:text-accent transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/auth" className="text-gray-300 hover:text-accent font-medium text-sm transition-colors duration-200 uppercase tracking-wider">
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-400 hover:text-white focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#111827] border-b border-[#1a2234]">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/#bots" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-[#1a2234]" onClick={() => setIsMobileMenuOpen(false)}>M3 Algo Bot</Link>
            <a href="https://wa.me/917721832978?text=Hi%2C%20I%20need%20support%20for%20M3%20Algox%20bot." target="_blank" rel="noopener noreferrer" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-green-400 hover:bg-[#1a2234]" onClick={() => setIsMobileMenuOpen(false)}>💬 WhatsApp Support</a>
            
            <div className="mt-4 pt-4 border-t border-[#1a2234]">
              {user ? (
                <>
                  <Link to="/chatbot" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-[#1a2234]" onClick={() => setIsMobileMenuOpen(false)}>💬 Chat with us</Link>
                  <Link to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-[#1a2234]" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
                  <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-[#1a2234]">Logout</button>
                </>
              ) : (
                <Link to="/auth" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-[#1a2234]" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
