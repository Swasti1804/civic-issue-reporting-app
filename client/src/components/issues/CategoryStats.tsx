import React from 'react';
import { IssueCategory } from '../../types';
import { categoryInfo } from '../../data/mockData';
import { useIssueStore } from '../../store/issueStore';
import { motion } from 'framer-motion';
import { AlertTriangle, BarChart4 } from 'lucide-react';

const CategoryStats: React.FC = () => {
  const { issues } = useIssueStore();
  
  // Count issues by category
  const categoryCounts: Record<IssueCategory, number> = {
    roads: 0,
    water: 0,
    electricity: 0,
    garbage: 0,
    sewage: 0,
    pollution: 0,
    safety: 0,
    traffic: 0,
    other: 0,
  };
  
  issues.forEach(issue => {
    categoryCounts[issue.category]++;
  });
  
  // Sort categories by count (descending)
  const sortedCategories = Object.entries(categoryCounts)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 6); // Take top 6 categories
  
  // Find the total for percentage calculation
  const total = Object.values(categoryCounts).reduce((sum, count) => sum + count, 0);
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };
  
  if (total === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 h-full flex flex-col justify-center items-center text-center">
        <AlertTriangle size={48} className="text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-700 mb-2">No Issues Yet</h3>
        <p className="text-gray-500">Start reporting issues to see category statistics.</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-800">Issues by Category</h3>
        <BarChart4 size={20} className="text-gray-500" />
      </div>
      
      <div className="space-y-4">
        {sortedCategories.map(([categoryKey, count], index) => {
          const category = categoryKey as IssueCategory;
          const percentage = Math.round((count / total) * 100);
          const categoryData = categoryInfo[category];
          
          return (
            <motion.div 
              key={category}
              custom={index}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="space-y-1"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className={`w-3 h-3 rounded-full ${categoryData.color} mr-2`}></span>
                  <span className="text-sm font-medium text-gray-700">{categoryData.name}</span>
                </div>
                <span className="text-sm text-gray-500">{count} issues</span>
              </div>
              
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  className={`h-full ${categoryData.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                ></motion.div>
              </div>
              
              <div className="text-xs text-right text-gray-500">
                {percentage}%
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {total > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-500 flex justify-between items-center">
            <span>Total Issues:</span>
            <span className="font-medium text-gray-700">{total}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryStats;