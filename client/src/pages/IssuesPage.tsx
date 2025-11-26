import React, { useEffect } from 'react';
import { useIssueStore } from '../store/issueStore';
import IssueCard from '../components/issues/IssueCard';
import IssueFilter from '../components/issues/IssueFilter';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { BarChart3, MapPin, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const IssuesPage: React.FC = () => {
  const { filteredIssues, fetchIssues, isLoading } = useIssueStore();
  
  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <div className="py-8">
      <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Community Issues</h1>
            <p className="text-gray-600">
              Browse, filter, and upvote reported issues in your community.
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Link to="/report">
              <Button 
                variant="default"
                leftIcon={<MapPin size={18} />}
              >
                Report New Issue
              </Button>
            </Link>
          </div>
        </div>
        
        <IssueFilter />
        
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 size={40} className="animate-spin text-primary-500" />
          </div>
        ) : filteredIssues.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredIssues.map((issue) => (
              <motion.div key={issue.id} variants={itemVariants}>
                <IssueCard issue={issue} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-10 text-center">
            <div className="inline-flex items-center justify-center p-4 bg-gray-100 rounded-full mb-4">
              <BarChart3 size={32} className="text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Issues Found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              There are no issues matching your current filters. Try adjusting your search criteria or be the first to report an issue.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline"
                onClick={() => fetchIssues()}
              >
                Reset Filters
              </Button>
              <Link to="/report">
                <Button variant="default">
                  Report New Issue
                </Button>
              </Link>
            </div>
          </div>
        )}
        
        {filteredIssues.length > 0 && (
          <div className="mt-10 flex justify-center">
            <Button 
              variant="outline"
              size="lg"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Back to Top
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default IssuesPage;