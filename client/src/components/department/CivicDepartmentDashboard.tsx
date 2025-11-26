import React, { useState } from 'react';
import { useIssueStore } from '../../store/issueStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Zap,
  TrendingUp,
  Filter,
  Eye,
  MapPin,
  Image as ImageIcon,
  Lightbulb
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Issue } from '../../types';
import AssignmentModal from './AssignmentModal';

const CivicDepartmentDashboard: React.FC = () => {
  const { issues } = useIssueStore();
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null);
  const [expandedIssueId, setExpandedIssueId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIssueForModal, setSelectedIssueForModal] = useState<Issue | null>(null);
  const [modalType, setModalType] = useState<'assign' | 'request-info' | null>(null);

  // Get unique departments
  const departments = Array.from(
    new Set(
      issues
        .filter((issue: Issue) => issue.aiAnalysis)
        .map((issue: Issue) => issue.assignedDepartment)
    )
  ).sort() as string[];

  // Filter issues
  const filteredIssues = issues.filter((issue: Issue) => {
    if (!issue.aiAnalysis) return false;
    if (selectedDepartment && issue.assignedDepartment !== selectedDepartment) return false;
    if (selectedSeverity && issue.aiAnalysis.severity !== selectedSeverity) return false;
    return true;
  });

  // Group by severity
  const issuesBySeverity = {
    critical: filteredIssues.filter((i: Issue) => i.aiAnalysis?.severity === 'critical'),
    high: filteredIssues.filter((i: Issue) => i.aiAnalysis?.severity === 'high'),
    medium: filteredIssues.filter((i: Issue) => i.aiAnalysis?.severity === 'medium'),
    low: filteredIssues.filter((i: Issue) => i.aiAnalysis?.severity === 'low'),
  };

  const severityColors = {
    critical: 'from-red-600 to-red-700',
    high: 'from-orange-600 to-orange-700',
    medium: 'from-yellow-600 to-yellow-700',
    low: 'from-green-600 to-green-700',
  };

  const severityIcons = {
    critical: <AlertTriangle size={20} className="text-white" />,
    high: <AlertCircle size={20} className="text-white" />,
    medium: <Clock size={20} className="text-white" />,
    low: <CheckCircle2 size={20} className="text-white" />,
  };

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-8">
        <div className="container-custom mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <Zap size={32} className="text-yellow-400" />
              <h1 className="text-3xl font-bold">Civic Department Analysis Hub</h1>
            </div>
            <p className="text-slate-300">
              AI-powered issue analysis and departmental routing system
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container-custom mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {[
            {
              label: 'Critical Issues',
              value: issuesBySeverity.critical.length,
              color: 'from-red-500 to-red-600',
              icon: <AlertTriangle size={24} />
            },
            {
              label: 'High Priority',
              value: issuesBySeverity.high.length,
              color: 'from-orange-500 to-orange-600',
              icon: <AlertCircle size={24} />
            },
            {
              label: 'Medium Priority',
              value: issuesBySeverity.medium.length,
              color: 'from-yellow-500 to-yellow-600',
              icon: <Clock size={24} />
            },
            {
              label: 'Low Priority',
              value: issuesBySeverity.low.length,
              color: 'from-green-500 to-green-600',
              icon: <CheckCircle2 size={24} />
            }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              className={`bg-gradient-to-br ${stat.color} rounded-lg p-6 text-white shadow-lg`}
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-90">{stat.label}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className="opacity-20">{stat.icon}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Filters */}
        <motion.div
          className="bg-white rounded-lg shadow-sm p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Filter size={20} className="text-slate-600" />
            <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Department Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Filter by Department
              </label>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedDepartment(null)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    selectedDepartment === null
                      ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  All Departments
                </button>
                {departments.map((dept: string) => (
                  <button
                    key={dept}
                    onClick={() => setSelectedDepartment(dept)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors truncate ${
                      selectedDepartment === dept
                        ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            </div>

            {/* Severity Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Filter by Severity
              </label>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedSeverity(null)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    selectedSeverity === null
                      ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  All Severity Levels
                </button>
                {['critical', 'high', 'medium', 'low'].map(severity => (
                  <button
                    key={severity}
                    onClick={() => setSelectedSeverity(severity)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors capitalize ${
                      selectedSeverity === severity
                        ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {severity}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Issues List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Analyzed Issues ({filteredIssues.length})
          </h2>

          {filteredIssues.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <Eye size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-600 text-lg">No issues match your filters</p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {filteredIssues.map((issue: Issue, idx: number) => {
                  const analysis = issue.aiAnalysis;
                  if (!analysis) return null;

                  return (
                    <motion.div
                      key={issue.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                    >
                      {/* Issue Card Header */}
                      <button
                        onClick={() =>
                          setExpandedIssueId(
                            expandedIssueId === issue.id ? null : issue.id
                          )
                        }
                        className="w-full text-left p-6 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div
                                className={`bg-gradient-to-br ${severityColors[analysis.severity as keyof typeof severityColors]} p-2 rounded-lg`}
                              >
                                {severityIcons[analysis.severity as keyof typeof severityIcons]}
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-slate-900">
                                  {issue.title}
                                </h3>
                                <p className="text-sm text-slate-600 mt-1">
                                  {issue.description.substring(0, 100)}...
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-3">
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-medium border ${getSeverityBadgeColor(
                                  analysis.severity
                                )}`}
                              >
                                {analysis.severity.toUpperCase()}
                              </span>
                              <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-300">
                                {analysis.confidence}% Confidence
                              </span>
                              <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 border border-purple-300">
                                {analysis.estimatedResolutionDays} days
                              </span>
                            </div>
                          </div>

                          <div className="ml-4">
                            <div
                              className={`transform transition-transform ${
                                expandedIssueId === issue.id ? 'rotate-180' : ''
                              }`}
                            >
                              <TrendingUp size={24} className="text-slate-400" />
                            </div>
                          </div>
                        </div>
                      </button>

                      {/* Expanded Details */}
                      <AnimatePresence>
                        {expandedIssueId === issue.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="border-t border-slate-200 bg-slate-50"
                          >
                            <div className="p-6 space-y-6">
                              {/* Department Assignment */}
                              <div>
                                <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                                  <Zap size={18} className="text-yellow-600" />
                                  Assigned Department
                                </h4>
                                <p className="text-slate-700 bg-white px-4 py-2 rounded-lg border border-slate-200">
                                  {analysis.assignedDepartment}
                                </p>
                              </div>

                              {/* Location */}
                              <div>
                                <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                                  <MapPin size={18} className="text-red-600" />
                                  Location
                                </h4>
                                <p className="text-slate-700 bg-white px-4 py-2 rounded-lg border border-slate-200">
                                  {issue.location.address || 'Lat: ' + issue.location.latitude + ', Lon: ' + issue.location.longitude}
                                </p>
                              </div>

                              {/* Images */}
                              {issue.images.length > 0 && (
                                <div>
                                  <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                                    <ImageIcon size={18} className="text-blue-600" />
                                    Evidence ({issue.images.length} {issue.images.length === 1 ? 'photo' : 'photos'})
                                  </h4>
                                  <div className="grid grid-cols-3 gap-3">
                                    {issue.images.map((img: string, imgIdx: number) => (
                                      <div
                                        key={imgIdx}
                                        className="aspect-square rounded-lg overflow-hidden border border-slate-300"
                                      >
                                        <img
                                          src={img}
                                          alt={`Evidence ${imgIdx + 1}`}
                                          className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* AI Detected Issues */}
                              <div>
                                <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                                  <Eye size={18} className="text-green-600" />
                                  AI Detected Issues
                                </h4>
                                <div className="space-y-2">
                                  {analysis.detectedIssues.map((issue: string, idx: number) => (
                                    <div
                                      key={idx}
                                      className="bg-white px-4 py-2 rounded-lg border border-slate-200 text-slate-700"
                                    >
                                      • {issue}
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Risk Factors */}
                              {analysis.riskFactors.length > 0 && (
                                <div>
                                  <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                                    <AlertTriangle size={18} className="text-orange-600" />
                                    Risk Factors
                                  </h4>
                                  <div className="space-y-2">
                                    {analysis.riskFactors.map((risk: string, idx: number) => (
                                      <div
                                        key={idx}
                                        className="bg-orange-50 px-4 py-2 rounded-lg border border-orange-200 text-orange-800"
                                      >
                                        • {risk}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Recommendations */}
                              <div>
                                <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                                  <Lightbulb size={18} className="text-yellow-600" />
                                  AI Recommendations
                                </h4>
                                <div className="space-y-2">
                                  {analysis.recommendations.map((rec: string, idx: number) => (
                                    <div
                                      key={idx}
                                      className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200 text-blue-900"
                                    >
                                      • {rec}
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex gap-3 pt-4 border-t border-slate-200">
                                <Button
                                  variant="default"
                                  size="sm"
                                  className="flex-1"
                                  onClick={() => {
                                    setSelectedIssueForModal(issue);
                                    setModalType('assign');
                                    setModalOpen(true);
                                  }}
                                >
                                  Accept & Assign
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1"
                                  onClick={() => {
                                    setSelectedIssueForModal(issue);
                                    setModalType('request-info');
                                    setModalOpen(true);
                                  }}
                                >
                                  Request More Info
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>

      {/* Assignment Modal */}
      <AssignmentModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedIssueForModal(null);
          setModalType(null);
        }}
        issue={selectedIssueForModal}
        modalType={modalType}
      />
    </div>
  );
};

export default CivicDepartmentDashboard;
