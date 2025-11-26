import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useIssueStore } from '../store/issueStore';
import { useAuthStore } from '../store/authStore';
import { 
  BarChart3, 
  MapPin, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Layers,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  PieChart,
  Users
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { categoryInfo, statusInfo } from '../data/mockData';
import { motion } from 'framer-motion';
import CategoryStats from '../components/issues/CategoryStats';
import StatusStats from '../components/issues/StatusStats';
import IssueCard from '../components/issues/IssueCard';

const DashboardPage: React.FC = () => {
  const { issues, fetchIssues } = useIssueStore();
  const { user } = useAuthStore();
  
  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);
  
  // Compute dashboard statistics
  const totalIssues = issues.length;
  const resolvedIssues = issues.filter(issue => issue.status === 'resolved' || issue.status === 'closed').length;
  const inProgressIssues = issues.filter(issue => issue.status === 'in_progress' || issue.status === 'verified').length;
  const pendingIssues = issues.filter(issue => issue.status === 'reported').length;
  const topIssues = [...issues]
    .sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes))
    .slice(0, 3);
  const recentIssues = [...issues]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);
  
  // Get upvote/downvote counts for last 3 issues reported by current user
  const userIssues = user
    ? issues.filter(issue => issue.reporterId === user.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3)
    : [];
  
  // For NGOs and Authorities, we can show a different set of metrics
  const isAuthorityOrNGO = user?.role === 'authority' || user?.role === 'ngo';
  
  return (
    <div className="py-8">
      <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-gray-600">
              {isAuthorityOrNGO
                ? 'Manage and track civic issues in your jurisdiction.'
                : 'Track your reported issues and view community statistics.'}
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
        
        {/* Quick Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div 
            className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-primary-100 p-3 rounded-full">
                <Layers size={24} className="text-primary-600" />
              </div>
              <span className="text-xs font-medium text-gray-500 px-2 py-1 bg-gray-100 rounded-full">
                Total
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{totalIssues}</h3>
            <p className="text-gray-600">Total Issues</p>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-success-100 p-3 rounded-full">
                <CheckCircle size={24} className="text-success-500" />
              </div>
              <span className="text-xs font-medium text-success-600 px-2 py-1 bg-success-50 rounded-full">
                {Math.round((resolvedIssues / totalIssues) * 100) || 0}%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{resolvedIssues}</h3>
            <p className="text-gray-600">Resolved Issues</p>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-warning-100 p-3 rounded-full">
                <Clock size={24} className="text-warning-500" />
              </div>
              <span className="text-xs font-medium text-warning-600 px-2 py-1 bg-warning-50 rounded-full">
                {Math.round((inProgressIssues / totalIssues) * 100) || 0}%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{inProgressIssues}</h3>
            <p className="text-gray-600">In Progress</p>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-error-100 p-3 rounded-full">
                <AlertTriangle size={24} className="text-error-500" />
              </div>
              <span className="text-xs font-medium text-error-600 px-2 py-1 bg-error-50 rounded-full">
                {Math.round((pendingIssues / totalIssues) * 100) || 0}%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{pendingIssues}</h3>
            <p className="text-gray-600">Pending Issues</p>
          </motion.div>
        </div>
        
        {/* Charts and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <CategoryStats />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <StatusStats />
          </motion.div>
        </div>
        
        {/* Recent and Top Issues */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Recent Issues</h2>
              <Link to="/issues" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
                View All <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentIssues.length > 0 ? (
                recentIssues.map((issue) => (
                  <motion.div 
                    key={issue.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <IssueCard issue={issue} compact />
                  </motion.div>
                ))
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                  <AlertTriangle size={24} className="mx-auto mb-3 text-gray-400" />
                  <p className="text-gray-600">No issues have been reported yet.</p>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Top Voted Issues</h2>
              <Link to="/issues" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
                View All <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
            
            <div className="space-y-4">
              {topIssues.length > 0 ? (
                topIssues.map((issue) => (
                  <motion.div 
                    key={issue.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <IssueCard issue={issue} compact />
                  </motion.div>
                ))
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                  <AlertTriangle size={24} className="mx-auto mb-3 text-gray-400" />
                  <p className="text-gray-600">No issues have been reported yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* User-specific section */}
        {user?.role === 'citizen' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Your Reported Issues</h2>
              {userIssues.length > 0 && (
                <Link to="/issues" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
                  View All <ArrowRight size={16} className="ml-1" />
                </Link>
              )}
            </div>
            
            {userIssues.length > 0 ? (
              <div className="space-y-4">
                {userIssues.map((issue) => (
                  <motion.div 
                    key={issue.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <Link to={`/issues/${issue.id}`} className="text-lg font-medium hover:text-primary-600">
                          {issue.title}
                        </Link>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusInfo[issue.status].color} text-white`}>
                          {statusInfo[issue.status].name}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <MapPin size={14} className="mr-1" />
                        <span className="truncate">{issue.location.address}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center text-gray-600">
                            <ArrowUp size={16} className="mr-1 text-success-500" />
                            <span>{issue.upvotes}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <ArrowDown size={16} className="mr-1 text-error-500" />
                            <span>{issue.downvotes}</span>
                          </div>
                        </div>
                        
                        <Link to={`/issues/${issue.id}`}>
                          <Button 
                            variant="outline" 
                            size="xs"
                          >
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin size={24} className="text-primary-600" />
                </div>
                <h3 className="text-lg font-medium mb-2">No Issues Reported Yet</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  You haven't reported any issues yet. Help improve your community by reporting issues in your area.
                </p>
                <Link to="/report">
                  <Button variant="default">
                    Report an Issue
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
        
        {/* Authority or NGO specific section */}
        {isAuthorityOrNGO && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Community Engagement</h3>
                <Users size={20} className="text-gray-500" />
              </div>
              
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Citizen Participation</span>
                    <span className="text-sm font-medium">85%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div className="bg-primary-500 h-full rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Issue Resolution Rate</span>
                    <span className="text-sm font-medium">67%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div className="bg-success-500 h-full rounded-full" style={{ width: '67%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Response Time</span>
                    <span className="text-sm font-medium">73%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div className="bg-accent-500 h-full rounded-full" style={{ width: '73%' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="text-xl font-bold text-primary-600">142</div>
                    <div className="text-xs text-gray-500">Active Users</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-accent-500">896</div>
                    <div className="text-xs text-gray-500">Comments</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-success-500">24</div>
                    <div className="text-xs text-gray-500">Volunteers</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Issues Requiring Attention</h3>
                <AlertTriangle size={20} className="text-warning-500" />
              </div>
              
              <div className="space-y-4">
                {pendingIssues > 0 ? (
                  issues
                    .filter(issue => issue.status === 'reported')
                    .slice(0, 3)
                    .map(issue => (
                      <div key={issue.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center">
                          <div className={`w-2 h-full rounded-full ${categoryInfo[issue.category].color} mr-3`}></div>
                          <div>
                            <Link to={`/issues/${issue.id}`} className="font-medium hover:text-primary-600">
                              {issue.title}
                            </Link>
                            <div className="text-xs text-gray-500 flex items-center">
                              <MapPin size={12} className="mr-1" />
                              {issue.location.address}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="text-xs font-medium mr-3 whitespace-nowrap">
                            {issue.upvotes} upvotes
                          </span>
                          <Link to={`/issues/${issue.id}`}>
                            <Button variant="outline" size="xs">
                              Review
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle size={32} className="mx-auto mb-3 text-success-500" />
                    <p className="text-gray-600">No pending issues require attention!</p>
                  </div>
                )}
              </div>
              
              {pendingIssues > 3 && (
                <div className="mt-4 text-center">
                  <Link to="/issues" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    View all {pendingIssues} pending issues
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Call to Action */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg p-8 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Together, We Can Make a Difference</h2>
            <p className="mb-6 text-primary-100">
              Your participation is making our community better and more responsive. Keep reporting issues and engaging with local authorities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/report">
                <Button 
                  variant="accent" 
                  size="lg"
                >
                  Report an Issue
                </Button>
              </Link>
              <Link to="/issues">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-primary-400 text-white hover:bg-primary-700"
                >
                  Browse Issues
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;