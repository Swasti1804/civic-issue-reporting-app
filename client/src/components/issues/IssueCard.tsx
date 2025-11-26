import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, MessageSquare, ThumbsUp, ThumbsDown, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Issue } from '../../types';
import { categoryInfo, statusInfo } from '../../data/mockData';
import { useAuthStore } from '../../store/authStore';
import { useIssueStore } from '../../store/issueStore';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';

interface IssueCardProps {
  issue: Issue;
  compact?: boolean;
}

const IssueCard: React.FC<IssueCardProps> = ({ issue, compact = false }) => {
  const { user, isAuthenticated } = useAuthStore();
  const { voteIssue } = useIssueStore();
  
  const handleVote = (voteType: 'upvote' | 'downvote') => {
    if (isAuthenticated && user) {
      voteIssue(issue.id, user.id, voteType);
    }
  };
  
  const statusData = statusInfo[issue.status];
  const categoryData = categoryInfo[issue.category];
  
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    hover: { 
      y: -5, 
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      transition: { duration: 0.2 }
    }
  };
  
  return (
    <motion.div 
      className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm"
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
    >
      {!compact && issue.images?.length > 0 && (
        <div className="h-40 overflow-hidden">
          <img 
            src={issue.images[0]} 
            alt={issue.title}
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusData.color} text-white`}>
              {statusData.name}
            </span>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${categoryData.color} text-white`}>
              {categoryData.name}
            </span>
          </div>
          
          <div className="flex items-center text-gray-500 text-xs">
            <Calendar size={14} className="mr-1" />
            {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
          </div>
        </div>
        
        <Link to={`/issues/${issue.id}`}>
          <h3 className="text-lg font-semibold mb-2 hover:text-primary-600 transition-colors line-clamp-1">
            {issue.title}
          </h3>
        </Link>
        
        {!compact && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {issue.description}
          </p>
        )}
        
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <MapPin size={16} className="mr-1 text-gray-400" />
          <span className="truncate">{issue.location.address}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="xs"
                className="text-gray-600 hover:text-primary-600"
                onClick={() => handleVote('upvote')}
                disabled={!isAuthenticated}
              >
                <ThumbsUp size={16} className="mr-1" />
                {issue.upvotes}
              </Button>
            </div>
            
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="xs"
                className="text-gray-600 hover:text-error-600"
                onClick={() => handleVote('downvote')}
                disabled={!isAuthenticated}
              >
                <ThumbsDown size={16} className="mr-1" />
                {issue.downvotes}
              </Button>
            </div>
            
            <div className="flex items-center">
              <Link to={`/issues/${issue.id}#comments`}>
                <Button 
                  variant="ghost" 
                  size="xs"
                  className="text-gray-600 hover:text-gray-900"
                >
                  <MessageSquare size={16} className="mr-1" />
                  {issue.comments?.length || 0}
                </Button>
              </Link>
            </div>
          </div>
          
          {!compact && (
            <Link to={`/issues/${issue.id}`}>
              <Button 
                variant="outline" 
                size="sm"
              >
                View Details
              </Button>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default IssueCard;