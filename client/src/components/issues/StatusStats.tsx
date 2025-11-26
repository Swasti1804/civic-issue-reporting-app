import React from 'react';
import { IssueStatus } from '../../types';
import { statusInfo } from '../../data/mockData';
import { useIssueStore } from '../../store/issueStore';
import { motion } from 'framer-motion';
import { PieChart, AlertTriangle } from 'lucide-react';

const StatusStats: React.FC = () => {
  const { issues } = useIssueStore();
  
  // Count issues by status
  const statusCounts: Record<IssueStatus, number> = {
    reported: 0,
    verified: 0,
    in_progress: 0,
    resolved: 0,
    closed: 0,
    reopened: 0,
  };
  
  issues.forEach(issue => {
    statusCounts[issue.status]++;
  });
  
  // Sort statuses by count (descending)
  const sortedStatuses = Object.entries(statusCounts)
    .sort(([, countA], [, countB]) => countB - countA);
  
  // Find the total for percentage calculation
  const total = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);
  
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
        <p className="text-gray-500">Start reporting issues to see status statistics.</p>
      </div>
    );
  }
  
  const resolvedOrClosed = statusCounts.resolved + statusCounts.closed;
  const inProgress = statusCounts.verified + statusCounts.in_progress + statusCounts.reopened;
  const pending = statusCounts.reported;
  
  const resolvedPercentage = Math.round((resolvedOrClosed / total) * 100);
  const inProgressPercentage = Math.round((inProgress / total) * 100);
  const pendingPercentage = Math.round((pending / total) * 100);
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-800">Resolution Status</h3>
        <PieChart size={20} className="text-gray-500" />
      </div>
      
      <div className="flex justify-center mb-6">
        <div className="relative w-40 h-40">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Pending slice */}
            <motion.circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#6B7280"
              strokeWidth="20"
              strokeDasharray={`${pendingPercentage} ${100 - pendingPercentage}`}
              strokeDashoffset="25"
              initial={{ strokeDashoffset: 100 }}
              animate={{ strokeDashoffset: 25 }}
              transition={{ duration: 1 }}
            />
            
            {/* In Progress slice */}
            <motion.circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#EAB308"
              strokeWidth="20"
              strokeDasharray={`${inProgressPercentage} ${100 - inProgressPercentage}`}
              strokeDashoffset={25 - pendingPercentage}
              initial={{ strokeDashoffset: 100 }}
              animate={{ strokeDashoffset: 25 - pendingPercentage }}
              transition={{ duration: 1, delay: 0.3 }}
            />
            
            {/* Resolved slice */}
            <motion.circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#22C55E"
              strokeWidth="20"
              strokeDasharray={`${resolvedPercentage} ${100 - resolvedPercentage}`}
              strokeDashoffset={25 - pendingPercentage - inProgressPercentage}
              initial={{ strokeDashoffset: 100 }}
              animate={{ strokeDashoffset: 25 - pendingPercentage - inProgressPercentage }}
              transition={{ duration: 1, delay: 0.6 }}
            />
            
            <circle cx="50" cy="50" r="30" fill="white" />
            <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" className="text-lg font-bold fill-gray-800">
              {total}
            </text>
            <text x="50" y="62" textAnchor="middle" dominantBaseline="middle" className="text-xs fill-gray-500">
              Issues
            </text>
          </svg>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mb-6">
        <div className="text-center">
          <div className="text-xl font-bold text-gray-500">{pending}</div>
          <div className="text-xs text-gray-500">Pending</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-yellow-500">{inProgress}</div>
          <div className="text-xs text-gray-500">In Progress</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-green-500">{resolvedOrClosed}</div>
          <div className="text-xs text-gray-500">Resolved</div>
        </div>
      </div>
      
      <div className="space-y-2">
        {sortedStatuses.map(([statusKey, count], index) => {
          if (count === 0) return null;
          
          const status = statusKey as IssueStatus;
          const percentage = Math.round((count / total) * 100);
          const statusData = statusInfo[status];
          
          return (
            <motion.div 
              key={status}
              custom={index}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="flex items-center justify-between"
            >
              <div className="flex items-center">
                <span className={`w-3 h-3 rounded-full ${statusData.color} mr-2`}></span>
                <span className="text-sm text-gray-700">{statusData.name}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <span className="mr-2">{count}</span>
                <span>({percentage}%)</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default StatusStats;