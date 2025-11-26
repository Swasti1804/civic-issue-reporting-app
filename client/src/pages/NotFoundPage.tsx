import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Home, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-md w-full space-y-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <div className="mx-auto h-24 w-24 relative">
            <motion.div 
              className="absolute inset-0 bg-primary-100 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            ></motion.div>
            <motion.div 
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Search className="h-12 w-12 text-primary-600" />
            </motion.div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Page Not Found
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button
              variant="default"
              leftIcon={<Home size={16} />}
              fullWidth
            >
              Back to Home
            </Button>
          </Link>
          <Link to="/issues">
            <Button
              variant="outline"
              fullWidth
            >
              Browse Issues
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;