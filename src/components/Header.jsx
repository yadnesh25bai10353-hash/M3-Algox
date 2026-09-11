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
    <header className="sticky top-0 z-50 bg-[#0a0e1a]/95 backdrop-blur-md border-b border-[#1a2234]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="font-heading font-bold text-2xl tracking-tight text-white">
              M3 <span className="text-[#3b82f6]">Algox</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/#bots" className="text-gray-300 hover:text-white transition-colors duration-200">M3 Algo Bot</Link>
            <a href="https://wa.me/917721832978?text=Hi%2C%20I%20need%20support%20for%20M3%20Algox%20bot." target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-green-400 transition-colors duration-200 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Support
            </a>
          </nav>

          {/* Right Section */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Search */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                className="bg-[#1a2234] text-white text-sm rounded-full pl-10 pr-4 py-2 w-32 focus:w-64 transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
                placeholder="Search bots..."
              />
            </div>

            {/* Cart */}
            <Link to="/cart" className="relative text-gray-300 hover:text-white transition-colors">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#3b82f6] text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Account */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center justify-center h-8 w-8 rounded-full bg-[#3b82f6] text-white text-sm font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a0e1a] focus:ring-[#3b82f6]"
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#111827] rounded-md shadow-lg py-1 border border-[#1a2234] z-50">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#1a2234] hover:text-white"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#1a2234] hover:text-white"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/auth" className="text-gray-300 hover:text-white font-medium text-sm transition-colors duration-200">
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
             <Link to="/cart" className="relative text-gray-300 hover:text-white">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#3b82f6] text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
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
