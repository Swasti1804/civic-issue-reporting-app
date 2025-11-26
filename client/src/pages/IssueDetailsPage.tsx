import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  MapPin, 
  Calendar, 
  FileText, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  User,
  ArrowLeft,
  Send,
  Check,
  AlertTriangle,
  RefreshCw,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useIssueStore } from '../store/issueStore';
import { useAuthStore } from '../store/authStore';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { categoryInfo, statusInfo } from '../data/mockData';
import { IssueComment, IssueStatus, IssueUpdate } from '../types';

const IssueDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getIssue, selectedIssue, isLoading, addComment, voteIssue, updateIssueStatus } = useIssueStore();
  const { user, isAuthenticated } = useAuthStore();
  
  const [comment, setComment] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [updateText, setUpdateText] = useState('');
  const [newStatus, setNewStatus] = useState<IssueStatus | null>(null);
  
  useEffect(() => {
    if (id) {
      getIssue(id);
    }
  }, [id, getIssue]);
  
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 size={40} className="animate-spin text-primary-500" />
      </div>
    );
  }
  
  if (!selectedIssue) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <AlertTriangle size={40} className="text-error-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Issue Not Found</h2>
        <p className="text-gray-600 mb-6 text-center max-w-md">
          The issue you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/issues">
          <Button variant="default" leftIcon={<ArrowLeft size={16} />}>
            Back to Issues
          </Button>
        </Link>
      </div>
    );
  }
  
  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? selectedIssue.images.length - 1 : prevIndex - 1
    );
  };
  
  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === selectedIssue.images.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const handleSubmitComment = async () => {
    if (!isAuthenticated || !user || !comment.trim()) return;
    
    setIsSubmittingComment(true);
    
    try {
      await addComment(selectedIssue.id, comment, user.id);
      setComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };
  
  const handleVote = (voteType: 'upvote' | 'downvote') => {
    if (isAuthenticated && user) {
      voteIssue(selectedIssue.id, user.id, voteType);
    }
  };
  
  const handleStatusUpdate = async () => {
    if (!isAuthenticated || !user || !newStatus || !updateText.trim()) return;
    
    setIsUpdatingStatus(true);
    
    try {
      await updateIssueStatus(selectedIssue.id, newStatus, updateText, user.id);
      setNewStatus(null);
      setUpdateText('');
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };
  
  const canUpdateStatus = isAuthenticated && 
    (user?.role === 'authority' || user?.role === 'ngo');
  
  const statusData = statusInfo[selectedIssue.status];
  const categoryData = categoryInfo[selectedIssue.category];
  
  // Group updates and comments together chronologically
  const combinedUpdatesAndComments = [
    ...(selectedIssue.updates || []).map(update => ({
      ...update,
      type: 'update' as const
    })),
    ...(selectedIssue.comments || []).map(comment => ({
      ...comment,
      type: 'comment' as const
    }))
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  return (
    <div className="py-8">
      <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link to="/issues">
            <Button 
              variant="ghost" 
              size="sm"
              leftIcon={<ArrowLeft size={16} />}
            >
              Back to Issues
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusData.color} text-white`}>
                    {statusData.name}
                  </span>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${categoryData.color} text-white`}>
                    {categoryData.name}
                  </span>
                </div>
                
                <h1 className="text-2xl md:text-3xl font-bold mb-4">{selectedIssue.title}</h1>
                
                <div className="flex flex-wrap gap-4 mb-6 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Calendar size={16} className="mr-1.5" />
                    <span>Reported {format(new Date(selectedIssue.createdAt), 'MMM d, yyyy')}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <MapPin size={16} className="mr-1.5" />
                    <span>{selectedIssue.location.address}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <User size={16} className="mr-1.5" />
                    <span>
                      {selectedIssue.isAnonymous 
                        ? 'Anonymous User' 
                        : selectedIssue.reporter?.name || 'Unknown User'}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-6 whitespace-pre-line">{selectedIssue.description}</p>
                
                <div className="flex items-center space-x-4 mb-6">
                  <Button 
                    variant="outline" 
                    size="sm"
                    leftIcon={<ThumbsUp size={16} />}
                    onClick={() => handleVote('upvote')}
                    disabled={!isAuthenticated}
                    className="text-gray-700"
                  >
                    Upvote ({selectedIssue.upvotes})
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    leftIcon={<ThumbsDown size={16} />}
                    onClick={() => handleVote('downvote')}
                    disabled={!isAuthenticated}
                    className="text-gray-700"
                  >
                    Downvote ({selectedIssue.downvotes})
                  </Button>
                </div>
              </div>
              
              {selectedIssue.images && selectedIssue.images.length > 0 && (
                <div className="border-t border-gray-200 p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center">
                    <FileText size={18} className="mr-2 text-gray-500" />
                    Evidence Photos
                  </h2>
                  
                  <div className="relative">
                    <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                      <img 
                        src={selectedIssue.images[currentImageIndex]} 
                        alt={`Issue evidence ${currentImageIndex + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    
                    {selectedIssue.images.length > 1 && (
                      <>
                        <button 
                          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
                          onClick={handlePrevImage}
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <button 
                          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
                          onClick={handleNextImage}
                        >
                          <ChevronRight size={20} />
                        </button>
                      </>
                    )}
                  </div>
                  
                  {selectedIssue.images.length > 1 && (
                    <div className="flex justify-center mt-3">
                      {selectedIssue.images.map((_, index) => (
                        <button
                          key={index}
                          className={`w-2 h-2 rounded-full mx-1 ${
                            index === currentImageIndex ? 'bg-primary-500' : 'bg-gray-300'
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Status Update Section for Authorities and NGOs */}
            {canUpdateStatus && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6 p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <RefreshCw size={18} className="mr-2 text-gray-500" />
                  Update Status
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      New Status
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(statusInfo).map(([key, status]) => (
                        <button
                          key={key}
                          type="button"
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                            newStatus === key
                              ? `${status.color} text-white`
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                          onClick={() => setNewStatus(key as IssueStatus)}
                        >
                          {status.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-3">
                    <Input
                      placeholder="Add a status update note..."
                      value={updateText}
                      onChange={(e) => setUpdateText(e.target.value)}
                      fullWidth
                    />
                    
                    <Button
                      onClick={handleStatusUpdate}
                      isLoading={isUpdatingStatus}
                      disabled={!newStatus || !updateText.trim()}
                      leftIcon={<Check size={16} />}
                      className="md:w-auto"
                    >
                      Update Status
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Timeline & Discussion Section */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold flex items-center">
                  <MessageSquare size={18} className="mr-2 text-gray-500" />
                  Timeline & Discussion
                </h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {combinedUpdatesAndComments.length > 0 ? (
                  combinedUpdatesAndComments.map((item) => (
                    <div key={item.id} className="p-5">
                      {item.type === 'update' ? (
                        <StatusUpdateItem update={item as IssueUpdate} />
                      ) : (
                        <CommentItem comment={item as IssueComment} />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-10 text-center">
                    <div className="text-gray-400 flex justify-center mb-3">
                      <MessageSquare size={32} />
                    </div>
                    <p className="text-gray-600">
                      No comments or updates yet. Be the first to comment!
                    </p>
                  </div>
                )}
              </div>
              
              {isAuthenticated ? (
                <div className="p-5 border-t border-gray-200">
                  <div className="flex gap-3">
                    <img 
                      src={user?.avatar || 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150'} 
                      alt={user?.name || 'User'} 
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <Input
                        placeholder="Add a comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rightIcon={
                          <Button
                            variant="ghost"
                            size="xs"
                            onClick={handleSubmitComment}
                            disabled={!comment.trim() || isSubmittingComment}
                            className="text-primary-600 hover:text-primary-700"
                          >
                            {isSubmittingComment ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Send size={16} />
                            )}
                          </Button>
                        }
                        fullWidth
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-5 border-t border-gray-200 bg-gray-50 text-center">
                  <p className="text-gray-600 mb-3">
                    You need to be logged in to comment.
                  </p>
                  <Link to="/login">
                    <Button variant="outline" size="sm">
                      Sign In to Comment
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Status and Timeline Card */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Status Timeline</h2>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${statusData.color}`}></div>
                  <div className="ml-3">
                    <div className="text-sm font-medium">Current Status</div>
                    <div className={`font-semibold text-sm ${statusData.color.replace('bg-', 'text-')}`}>
                      {statusData.name}
                    </div>
                  </div>
                </div>
                
                <div className="border-l-2 border-gray-200 pl-4 ml-1 space-y-4">
                  {selectedIssue.updates && selectedIssue.updates.length > 0 ? (
                    selectedIssue.updates
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .map((update, index) => {
                        const updateStatusInfo = update.newStatus ? statusInfo[update.newStatus] : null;
                        
                        return (
                          <div key={update.id} className="relative">
                            <div className="absolute -left-[22px] mt-1 w-3 h-3 rounded-full bg-gray-300 border-2 border-white"></div>
                            <div className="text-xs text-gray-500">
                              {format(new Date(update.createdAt), 'MMM d, yyyy • h:mm a')}
                            </div>
                            {updateStatusInfo && (
                              <div className="text-sm font-medium">
                                Status changed to <span className={updateStatusInfo.color.replace('bg-', 'text-')}>{updateStatusInfo.name}</span>
                              </div>
                            )}
                            <div className="text-sm text-gray-600 mt-1">
                              {update.text}
                            </div>
                          </div>
                        );
                      })
                  ) : (
                    <div className="py-2 text-sm text-gray-500">
                      No status updates yet.
                    </div>
                  )}
                  
                  <div className="relative">
                    <div className="absolute -left-[22px] mt-1 w-3 h-3 rounded-full bg-primary-500 border-2 border-white"></div>
                    <div className="text-xs text-gray-500">
                      {format(new Date(selectedIssue.createdAt), 'MMM d, yyyy • h:mm a')}
                    </div>
                    <div className="text-sm font-medium">
                      Issue Reported
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Issue was reported by {selectedIssue.isAnonymous ? 'an anonymous user' : selectedIssue.reporter?.name || 'a user'}.
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Location Map */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold flex items-center">
                  <MapPin size={18} className="mr-2 text-gray-500" />
                  Issue Location
                </h2>
              </div>
              
              <div className="h-64">
                <MapContainer 
                  center={[selectedIssue.location.latitude, selectedIssue.location.longitude]} 
                  zoom={15} 
                  style={{ height: '100%', width: '100%' }}
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[selectedIssue.location.latitude, selectedIssue.location.longitude]} />
                </MapContainer>
              </div>
              
              <div className="p-4 bg-gray-50">
                <div className="text-sm text-gray-600 flex items-start">
                  <MapPin size={16} className="mr-2 flex-shrink-0 mt-0.5 text-gray-500" />
                  <span>{selectedIssue.location.address}</span>
                </div>
              </div>
            </div>
            
            {/* Similar Issues Card - This would be a real feature in a production app */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Similar Issues</h2>
              <p className="text-gray-600 text-sm">
                This feature would show similar issues based on location and category.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Status update item component
const StatusUpdateItem: React.FC<{ update: IssueUpdate }> = ({ update }) => {
  const statusData = update.newStatus ? statusInfo[update.newStatus] : null;
  
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0">
        {update.user?.avatar ? (
          <img 
            src={update.user.avatar} 
            alt={update.user?.name || 'User'} 
            className="w-10 h-10 rounded-full"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
            <Clock size={20} className="text-primary-600" />
          </div>
        )}
      </div>
      <div>
        <div className="flex items-center mb-1">
          <span className="font-medium mr-2">
            {update.user?.name || 'System'}
          </span>
          <span className="text-xs text-gray-500">
            {format(new Date(update.createdAt), 'MMM d, yyyy • h:mm a')}
          </span>
        </div>
        
        {statusData && (
          <div className="mb-2 flex items-center">
            <span className="text-sm mr-2">Status updated to</span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusData.color} text-white`}>
              {statusData.name}
            </span>
          </div>
        )}
        
        <p className="text-gray-700 whitespace-pre-line">{update.text}</p>
      </div>
    </div>
  );
};

// Comment item component
const CommentItem: React.FC<{ comment: IssueComment }> = ({ comment }) => {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0">
        {comment.user?.avatar ? (
          <img 
            src={comment.user.avatar} 
            alt={comment.user?.name || 'User'} 
            className="w-10 h-10 rounded-full"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <User size={20} className="text-gray-600" />
          </div>
        )}
      </div>
      <div>
        <div className="flex items-center mb-1">
          <span className="font-medium mr-2">
            {comment.user?.name || 'Anonymous User'}
          </span>
          <span className="text-xs text-gray-500">
            {format(new Date(comment.createdAt), 'MMM d, yyyy • h:mm a')}
          </span>
        </div>
        <p className="text-gray-700 whitespace-pre-line">{comment.text}</p>
      </div>
    </div>
  );
};

export default IssueDetailsPage;