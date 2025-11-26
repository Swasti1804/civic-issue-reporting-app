import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MapPin, BarChart4, LogOut, LogIn, UserPlus, Home, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../store/authStore';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const location = useLocation();
  
  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };
  
  const navigation = [
    { name: 'Home', path: '/', icon: <Home size={18} /> },
    { name: 'Report Issue', path: '/report', icon: <MapPin size={18} /> },
    { name: 'Issues', path: '/issues', icon: <BarChart4 size={18} /> },
  ];

  const departmentNav = [
    { name: 'Department Dashboard', path: '/department-dashboard', icon: <BarChart4 size={18} /> },
  ];
  
  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0" aria-label="Hamara Shehar">
              <div className="flex items-center gap-2">
                <div className="bg-primary-600 text-white p-1.5 rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-landmark">
                    <line x1="3" x2="21" y1="22" y2="22"></line>
                    <line x1="6" x2="6" y1="18" y2="11"></line>
                    <line x1="10" x2="10" y1="18" y2="11"></line>
                    <line x1="14" x2="14" y1="18" y2="11"></line>
                    <line x1="18" x2="18" y1="18" y2="11"></line>
                    <polygon points="12 2 20 7 4 7"></polygon>
                  </svg>
                </div>
                <span className="text-xl font-semibold text-primary-600">Hamara Shehar</span>
              </div>
            </Link>
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1.5 transition-colors ${
                  isActiveRoute(item.path)
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
            {isAuthenticated && (
              <>
                {departmentNav.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1.5 transition-colors ${
                      isActiveRoute(item.path)
                        ? 'bg-accent-50 text-accent-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                ))}
              </>
            )}
          </nav>
          
          <div className="hidden md:flex items-center space-x-2">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="relative"
                >
                  <Bell size={18} />
                  <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    3
                  </span>
                </Button>
                
                <div className="flex items-center">
                  <img
                    src={user?.avatar || 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150'}
                    alt={user?.name || 'User'}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <div className="text-sm">
                    <p className="font-medium text-gray-800">{user?.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                  </div>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleLogout}
                  leftIcon={<LogOut size={16} />}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button 
                    variant="outline" 
                    size="sm"
                    leftIcon={<LogIn size={16} />}
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button 
                    variant="default" 
                    size="sm"
                    leftIcon={<UserPlus size={16} />}
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium flex items-center space-x-3 ${
                    isActiveRoute(item.path)
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
              {isAuthenticated && (
                <>
                  {departmentNav.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`block px-3 py-2 rounded-md text-base font-medium flex items-center space-x-3 ${
                        isActiveRoute(item.path)
                          ? 'bg-accent-50 text-accent-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span>{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </>
              )}
            </div>
            
            <div className="pt-4 pb-3 border-t border-gray-200">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="flex items-center px-4">
                    <div className="flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={user?.avatar || 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150'}
                        alt={user?.name || "User"}
                      />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">{user?.name}</div>
                      <div className="text-sm font-medium text-gray-500 capitalize">{user?.role}</div>
                    </div>
                    <div className="ml-auto">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="relative"
                      >
                        <Bell size={20} />
                        <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                          3
                        </span>
                      </Button>
                    </div>
                  </div>
                  <div className="px-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center px-4 py-2 text-base font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                    >
                      <LogOut className="mr-2 h-5 w-5" />
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="px-4 space-y-2">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="w-full flex items-center justify-center px-4 py-2 text-base font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md">
                      <LogIn className="mr-2 h-5 w-5" />
                      Login
                    </button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="w-full flex items-center justify-center px-4 py-2 text-base font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md">
                      <UserPlus className="mr-2 h-5 w-5" />
                      Sign Up
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;