import { create } from 'zustand';
import { Issue, IssueCategory, IssueStatus, GeoLocation, IssueComment, IssueUpdate, Assignment, ChatMessage, Worker } from '../types';
import { enrichedMockIssues, mockComments, mockUpdates } from '../data/mockData';
import { generateAIAnalysis } from '../utils/aiAnalysis';

interface IssueState {
  issues: Issue[];
  filteredIssues: Issue[];
  selectedIssue: Issue | null;
  isLoading: boolean;
  error: string | null;
  userLocation: GeoLocation | null;
  filters: {
    category: IssueCategory | null;
    status: IssueStatus | null;
    search: string;
    sortBy: 'newest' | 'oldest' | 'mostVoted' | 'leastVoted';
    radius: number; // in kilometers
    nearMe: boolean;
  };
  
  fetchIssues: () => Promise<void>;
  getIssue: (id: string) => Promise<void>;
  createIssue: (issue: Omit<Issue, 'id' | 'createdAt' | 'updatedAt' | 'upvotes' | 'downvotes' | 'comments' | 'updates'>) => Promise<string>;
  updateIssueStatus: (id: string, status: IssueStatus, updateText: string, userId: string) => Promise<void>;
  addComment: (issueId: string, text: string, userId: string) => Promise<void>;
  voteIssue: (issueId: string, userId: string, voteType: 'upvote' | 'downvote') => Promise<void>;
  setFilters: (filters: Partial<IssueState['filters']>) => void;
  clearFilters: () => void;
  setUserLocation: (location: GeoLocation) => void;
  
  // New methods for assignment and chat
  assignWorker: (issueId: string, workerId: string, assignedBy: string, deadline: Date, notes: string) => Promise<void>;
  requestMoreInfo: (issueId: string, text: string, senderId: string) => Promise<void>;
  addChatMessage: (issueId: string, text: string, senderId: string, isGroupMessage?: boolean) => Promise<void>;
  shareToGroup: (issueId: string, groupName: string, memberCount: number, sharedBy: string) => Promise<void>;
  getAvailableWorkers: (department: string) => Worker[];
}

// Helper function to calculate distance between two points using Haversine formula
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const useIssueStore = create<IssueState>((set, get) => ({
  issues: enrichedMockIssues,
  filteredIssues: enrichedMockIssues,
  selectedIssue: null,
  isLoading: false,
  error: null,
  userLocation: null,
  filters: {
    category: null,
    status: null,
    search: '',
    sortBy: 'newest',
    radius: 5, // Default 5km radius
    nearMe: false,
  },
  
  fetchIssues: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Apply filters and sorting
      const applyFilters = () => {
        const { category, status, search, sortBy, radius, nearMe } = get().filters;
        const userLocation = get().userLocation;
        let filtered = [...get().issues];
        
        if (category) {
          filtered = filtered.filter(issue => issue.category === category);
        }
        
        if (status) {
          filtered = filtered.filter(issue => issue.status === status);
        }
        
        if (search) {
          const searchLower = search.toLowerCase();
          filtered = filtered.filter(
            issue => issue.title.toLowerCase().includes(searchLower) || 
                    issue.description.toLowerCase().includes(searchLower) ||
                    issue.location.address?.toLowerCase().includes(searchLower)
          );
        }
        
        // Filter by location if nearMe is true and userLocation exists
        if (nearMe && userLocation) {
          filtered = filtered.filter(issue => {
            const distance = calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              issue.location.latitude,
              issue.location.longitude
            );
            return distance <= radius;
          });
        }
        
        // Apply sorting
        switch (sortBy) {
          case 'newest':
            filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
            break;
          case 'oldest':
            filtered.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
            break;
          case 'mostVoted':
            filtered.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
            break;
          case 'leastVoted':
            filtered.sort((a, b) => (a.upvotes - a.downvotes) - (b.upvotes - b.downvotes));
            break;
        }
        
        return filtered;
      };
      
      set({ filteredIssues: applyFilters(), isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch issues', isLoading: false });
    }
  },
  
  getIssue: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const issue = get().issues.find(i => i.id === id) || null;
      
      set({ selectedIssue: issue, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch issue details', isLoading: false });
    }
  },
  
  createIssue: async (issue) => {
    set({ isLoading: true, error: null });
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const issueId = `issue-${Date.now()}`;
      
      // Generate AI Analysis
      const aiAnalysis = generateAIAnalysis(
        issueId,
        issue.title,
        issue.description,
        issue.category,
        issue.images.length
      );
      
      const newIssue: Issue = {
        ...issue,
        id: issueId,
        status: 'reported',
        upvotes: 0,
        downvotes: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        comments: [],
        updates: [],
        aiAnalysis: aiAnalysis,
        assignedDepartment: aiAnalysis.assignedDepartment
      };
      
      set(state => ({ 
        issues: [newIssue, ...state.issues],
        isLoading: false
      }));
      
      // Refresh filtered issues
      get().fetchIssues();
      
      return newIssue.id;
    } catch (error) {
      set({ error: 'Failed to create issue', isLoading: false });
      return '';
    }
  },
  
  updateIssueStatus: async (id: string, status: IssueStatus, updateText: string, userId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newUpdate: IssueUpdate = {
        id: `update-${Date.now()}`,
        issueId: id,
        userId,
        text: updateText,
        newStatus: status,
        createdAt: new Date()
      };
      
      set(state => {
        const updatedIssues = state.issues.map(issue => {
          if (issue.id === id) {
            return {
              ...issue,
              status,
              updatedAt: new Date(),
              updates: [...(issue.updates || []), newUpdate]
            };
          }
          return issue;
        });
        
        const updatedSelectedIssue = state.selectedIssue?.id === id
          ? {
              ...state.selectedIssue,
              status,
              updatedAt: new Date(),
              updates: [...(state.selectedIssue.updates || []), newUpdate]
            }
          : state.selectedIssue;
        
        return {
          issues: updatedIssues,
          selectedIssue: updatedSelectedIssue,
          isLoading: false
        };
      });
      
      // Refresh filtered issues
      get().fetchIssues();
    } catch (error) {
      set({ error: 'Failed to update issue status', isLoading: false });
    }
  },
  
  addComment: async (issueId: string, text: string, userId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newComment: IssueComment = {
        id: `comment-${Date.now()}`,
        issueId,
        userId,
        text,
        createdAt: new Date()
      };
      
      set(state => {
        const updatedIssues = state.issues.map(issue => {
          if (issue.id === issueId) {
            return {
              ...issue,
              comments: [...(issue.comments || []), newComment]
            };
          }
          return issue;
        });
        
        const updatedSelectedIssue = state.selectedIssue?.id === issueId
          ? {
              ...state.selectedIssue,
              comments: [...(state.selectedIssue.comments || []), newComment]
            }
          : state.selectedIssue;
        
        return {
          issues: updatedIssues,
          selectedIssue: updatedSelectedIssue,
          isLoading: false
        };
      });
    } catch (error) {
      set({ error: 'Failed to add comment', isLoading: false });
    }
  },
  
  voteIssue: async (issueId: string, userId: string, voteType: 'upvote' | 'downvote') => {
    set({ isLoading: true, error: null });
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      set(state => {
        const updatedIssues = state.issues.map(issue => {
          if (issue.id === issueId) {
            return {
              ...issue,
              upvotes: voteType === 'upvote' ? issue.upvotes + 1 : issue.upvotes,
              downvotes: voteType === 'downvote' ? issue.downvotes + 1 : issue.downvotes
            };
          }
          return issue;
        });
        
        const updatedSelectedIssue = state.selectedIssue?.id === issueId
          ? {
              ...state.selectedIssue,
              upvotes: voteType === 'upvote' ? state.selectedIssue.upvotes + 1 : state.selectedIssue.upvotes,
              downvotes: voteType === 'downvote' ? state.selectedIssue.downvotes + 1 : state.selectedIssue.downvotes
            }
          : state.selectedIssue;
        
        return {
          issues: updatedIssues,
          selectedIssue: updatedSelectedIssue,
          isLoading: false
        };
      });
      
      // Refresh filtered issues
      get().fetchIssues();
    } catch (error) {
      set({ error: 'Failed to vote on issue', isLoading: false });
    }
  },
  
  setFilters: (filters) => {
    set(state => ({
      filters: {
        ...state.filters,
        ...filters
      }
    }));
    
    get().fetchIssues();
  },
  
  clearFilters: () => {
    set({
      filters: {
        category: null,
        status: null,
        search: '',
        sortBy: 'newest',
        radius: 5,
        nearMe: false
      }
    });
    
    get().fetchIssues();
  },
  
  setUserLocation: (location: GeoLocation) => {
    set({ userLocation: location });
    get().fetchIssues();
  },

  // New implementation methods
  getAvailableWorkers: (department: string) => {
    // Mock workers - in production, this would be fetched from API
    const mockWorkers: Worker[] = [
      {
        id: 'worker-1',
        name: 'राज शर्मा',
        phone: '+91-9876543210',
        email: 'raj.sharma@dept.com',
        department: department,
        experience: '5 years',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=raj',
        vehicle: 'Truck - MH01AB1234'
      },
      {
        id: 'worker-2',
        name: 'अमित कुमार',
        phone: '+91-9123456789',
        email: 'amit.kumar@dept.com',
        department: department,
        experience: '3 years',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amit',
        vehicle: 'Van - MH01CD5678'
      },
      {
        id: 'worker-3',
        name: 'विक्रम पटेल',
        phone: '+91-8765432109',
        email: 'vikram.patel@dept.com',
        department: department,
        experience: '7 years',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vikram',
        vehicle: 'Truck - MH01EF9012'
      },
      {
        id: 'worker-4',
        name: 'प्रिया शर्मा',
        phone: '+91-8234567890',
        email: 'priya.sharma@dept.com',
        department: department,
        experience: '4 years',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya',
        vehicle: 'Van - MH01GH3456'
      },
      {
        id: 'worker-5',
        name: 'संजय वर्मा',
        phone: '+91-7654321098',
        email: 'sanjay.verma@dept.com',
        department: department,
        experience: '6 years',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sanjay',
        vehicle: 'Truck - MH01IJ7890'
      }
    ];
    return mockWorkers;
  },

  assignWorker: async (issueId: string, workerId: string, assignedBy: string, deadline: Date, notes: string) => {
    set({ isLoading: true, error: null });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const worker = get().getAvailableWorkers('').find(w => w.id === workerId);
      
      const newAssignment: Assignment = {
        id: `assign-${Date.now()}`,
        issueId,
        workerId,
        worker,
        assignedBy,
        assignedAt: new Date(),
        deadline,
        status: 'assigned',
        notes
      };
      
      set(state => {
        const updatedIssues = state.issues.map(issue => {
          if (issue.id === issueId) {
            return {
              ...issue,
              assignments: [...(issue.assignments || []), newAssignment],
              status: 'in_progress' as IssueStatus,
              updatedAt: new Date()
            };
          }
          return issue;
        });
        
        const updatedSelectedIssue = state.selectedIssue?.id === issueId
          ? {
              ...state.selectedIssue,
              assignments: [...(state.selectedIssue.assignments || []), newAssignment],
              status: 'in_progress' as IssueStatus,
              updatedAt: new Date()
            }
          : state.selectedIssue;
        
        return {
          issues: updatedIssues,
          selectedIssue: updatedSelectedIssue,
          isLoading: false
        };
      });
    } catch (error) {
      set({ error: 'Failed to assign worker', isLoading: false });
    }
  },

  requestMoreInfo: async (issueId: string, text: string, senderId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const chatMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        issueId,
        senderId,
        text,
        createdAt: new Date(),
        isGroupMessage: false
      };
      
      set(state => {
        const updatedIssues = state.issues.map(issue => {
          if (issue.id === issueId) {
            return {
              ...issue,
              chatMessages: [...(issue.chatMessages || []), chatMessage]
            };
          }
          return issue;
        });
        
        const updatedSelectedIssue = state.selectedIssue?.id === issueId
          ? {
              ...state.selectedIssue,
              chatMessages: [...(state.selectedIssue.chatMessages || []), chatMessage]
            }
          : state.selectedIssue;
        
        return {
          issues: updatedIssues,
          selectedIssue: updatedSelectedIssue,
          isLoading: false
        };
      });
    } catch (error) {
      set({ error: 'Failed to send message', isLoading: false });
    }
  },

  addChatMessage: async (issueId: string, text: string, senderId: string, isGroupMessage = false) => {
    set({ isLoading: true, error: null });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const chatMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        issueId,
        senderId,
        text,
        createdAt: new Date(),
        isGroupMessage
      };
      
      set(state => {
        const updatedIssues = state.issues.map(issue => {
          if (issue.id === issueId) {
            return {
              ...issue,
              chatMessages: [...(issue.chatMessages || []), chatMessage]
            };
          }
          return issue;
        });
        
        const updatedSelectedIssue = state.selectedIssue?.id === issueId
          ? {
              ...state.selectedIssue,
              chatMessages: [...(state.selectedIssue.chatMessages || []), chatMessage]
            }
          : state.selectedIssue;
        
        return {
          issues: updatedIssues,
          selectedIssue: updatedSelectedIssue,
          isLoading: false
        };
      });
    } catch (error) {
      set({ error: 'Failed to add chat message', isLoading: false });
    }
  },

  shareToGroup: async (issueId: string, groupName: string, memberCount: number, sharedBy: string) => {
    set({ isLoading: true, error: null });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const groupShare = {
        id: `share-${Date.now()}`,
        issueId,
        groupName,
        sharedAt: new Date(),
        sharedBy,
        memberCount
      };
      
      set(state => {
        const updatedIssues = state.issues.map(issue => {
          if (issue.id === issueId) {
            return {
              ...issue,
              groupShares: [...(issue.groupShares || []), groupShare]
            };
          }
          return issue;
        });
        
        const updatedSelectedIssue = state.selectedIssue?.id === issueId
          ? {
              ...state.selectedIssue,
              groupShares: [...(state.selectedIssue.groupShares || []), groupShare]
            }
          : state.selectedIssue;
        
        return {
          issues: updatedIssues,
          selectedIssue: updatedSelectedIssue,
          isLoading: false
        };
      });
    } catch (error) {
      set({ error: 'Failed to share to group', isLoading: false });
    }
  }
}));