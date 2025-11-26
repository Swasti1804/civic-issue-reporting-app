import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Landmark } from 'lucide-react';
import { motion } from 'framer-motion';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary-600 text-white p-2 rounded-md">
              <Landmark size={24} />
            </div>
            <span className="text-2xl font-bold text-primary-600">Hamara Shehar</span>
          </Link>
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Welcome to our civic engagement platform
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 max-w-sm">
            Report issues, track progress, and collaborate with your community to create a better urban environment.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Outlet />
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {location.pathname === '/login' ? (
              <>
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                  Sign up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                  Sign in
                </Link>
              </>
            )}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;