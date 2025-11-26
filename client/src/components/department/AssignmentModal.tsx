import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Users, Calendar, MessageSquare, Share2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { useIssueStore } from '../../store/issueStore';
import { Issue, Worker } from '../../types';

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  issue: Issue | null;
  modalType: 'assign' | 'request-info' | null;
}

const AssignmentModal: React.FC<AssignmentModalProps> = ({
  isOpen,
  onClose,
  issue,
  modalType
}) => {
  const { assignWorker, requestMoreInfo, addChatMessage, shareToGroup, getAvailableWorkers } = useIssueStore();
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [deadline, setDeadline] = useState<string>(
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');
  const [groupName, setGroupName] = useState('Public Works Team');
  const [loading, setLoading] = useState(false);

  if (!issue || !issue.aiAnalysis) return null;

  const workers = getAvailableWorkers(issue.assignedDepartment || '');

  const handleAssign = async () => {
    if (!selectedWorker) return;
    
    setLoading(true);
    try {
      await assignWorker(
        issue.id,
        selectedWorker.id,
        'dept-admin', // In real app, this would be current user
        new Date(deadline),
        notes
      );

      // Auto-share to group
      await shareToGroup(
        issue.id,
        groupName,
        5, // Mock member count
        'dept-admin'
      );

      // Send notification message
      await addChatMessage(
        issue.id,
        `Worker ${selectedWorker.name} assigned to this issue. Details: ${notes}`,
        'system',
        true
      );

      setLoading(false);
      onClose();
    } catch (error) {
      console.error('Assignment failed:', error);
      setLoading(false);
    }
  };

  const handleRequestInfo = async () => {
    if (!message.trim()) return;
    
    setLoading(true);
    try {
      await requestMoreInfo(issue.id, message, 'dept-admin');
      setMessage('');
      setLoading(false);
      
      // Show confirmation
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Request failed:', error);
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="text-2xl font-bold">
                  {modalType === 'assign' ? '👷 Assign Worker' : '💬 Request More Information'}
                </h2>
                <p className="text-blue-100 text-sm mt-1">{issue.title}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-blue-500 rounded-lg transition"
                title="Close modal"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {modalType === 'assign' ? (
                // Assign Worker Section
                <div className="space-y-6">
                  {/* Worker Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      <Users size={16} className="inline mr-2" />
                      Select Worker
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {workers.map((worker) => (
                        <motion.div
                          key={worker.id}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => setSelectedWorker(worker)}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                            selectedWorker?.id === worker.id
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={worker.avatar}
                              alt={worker.name}
                              className="w-10 h-10 rounded-full"
                            />
                            <div className="flex-1">
                              <p className="font-semibold text-gray-800">{worker.name}</p>
                              <p className="text-xs text-gray-500">{worker.experience}</p>
                              <p className="text-xs text-gray-600">{worker.phone}</p>
                            </div>
                            {worker.vehicle && (
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                {worker.vehicle}
                              </span>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Deadline */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Calendar size={16} className="inline mr-2" />
                      Deadline
                    </label>
                    <input
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      placeholder="Select deadline"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      aria-label="Select deadline date"
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <MessageSquare size={16} className="inline mr-2" />
                      Special Instructions/Notes
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add any special instructions for the worker..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
                      rows={4}
                    />
                  </div>

                  {/* Group Share */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Share2 size={16} className="inline mr-2" />
                      Share to Group
                    </label>
                    <select
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      aria-label="Select group to share with"
                      title="Select group to share with"
                    >
                      <option value="Public Works Team">Public Works Team</option>
                      <option value="Municipal Workers">Municipal Workers</option>
                      <option value="Emergency Response">Emergency Response</option>
                      <option value="Maintenance Crew">Maintenance Crew</option>
                      <option value="All Departments">All Departments</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-2">
                      Issue details will be automatically shared with group members
                    </p>
                  </div>

                  {/* Issue Details Summary */}
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-gray-800 mb-3">Issue Summary</h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Severity:</span>{' '}
                        <span className={`inline-block px-2 py-1 rounded ${
                          issue.aiAnalysis.severity === 'critical' ? 'bg-red-100 text-red-800' :
                          issue.aiAnalysis.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                          issue.aiAnalysis.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {issue.aiAnalysis.severity.toUpperCase()}
                        </span>
                      </p>
                      <p>
                        <span className="font-medium">Confidence:</span>{' '}
                        {issue.aiAnalysis.confidence}%
                      </p>
                      <p>
                        <span className="font-medium">Est. Resolution:</span>{' '}
                        {issue.aiAnalysis.estimatedResolutionDays} days
                      </p>
                      <p className="text-gray-700 mt-2">
                        <strong>Issues Detected:</strong>
                      </p>
                      <ul className="list-disc list-inside">
                        {issue.aiAnalysis.detectedIssues.map((issue, idx) => (
                          <li key={idx} className="text-gray-600">
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={onClose}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      disabled={!selectedWorker || loading}
                      onClick={handleAssign}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700"
                    >
                      {loading ? '⏳ Assigning...' : '✓ Assign & Share'}
                    </Button>
                  </div>
                </div>
              ) : (
                // Request More Info Section
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-gray-700">
                      Send a direct message to the reporter requesting additional information or clarification.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <MessageSquare size={16} className="inline mr-2" />
                      Message
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message to the reporter..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
                      rows={6}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Direct chat will be initiated with the issue reporter
                    </p>
                  </div>

                  {/* Recent Context */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3">Issue Context</h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Description:</span> {issue.description}
                      </p>
                      <p>
                        <span className="font-medium">Location:</span> {issue.location.address}
                      </p>
                      <p>
                        <span className="font-medium">Reported:</span>{' '}
                        {new Date(issue.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={onClose}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      disabled={!message.trim() || loading}
                      onClick={handleRequestInfo}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700"
                      leftIcon={<Send size={16} />}
                    >
                      {loading ? '⏳ Sending...' : 'Send Message'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AssignmentModal;
