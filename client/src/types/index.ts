export type UserRole = 'citizen' | 'ngo' | 'authority';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  createdAt: Date;
}

export type IssueCategory = 
  | 'roads' 
  | 'water' 
  | 'electricity' 
  | 'garbage' 
  | 'sewage' 
  | 'pollution' 
  | 'safety' 
  | 'traffic' 
  | 'other';

export type IssueStatus = 
  | 'reported' 
  | 'verified' 
  | 'in_progress' 
  | 'resolved' 
  | 'closed' 
  | 'reopened';

export interface GeoLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface IssueVote {
  id: string;
  issueId: string;
  userId: string;
  type: 'upvote' | 'downvote';
  createdAt: Date;
}

export interface IssueComment {
  id: string;
  issueId: string;
  userId: string;
  text: string;
  createdAt: Date;
  user?: User;
}

export interface IssueUpdate {
  id: string;
  issueId: string;
  userId: string;
  text: string;
  newStatus?: IssueStatus;
  createdAt: Date;
  user?: User;
}

export interface AIAnalysis {
  id: string;
  issueId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number; // 0-100
  detectedIssues: string[];
  recommendations: string[];
  assignedDepartment: string;
  estimatedResolutionDays: number;
  riskFactors: string[];
  analyzedAt: Date;
}

export interface Worker {
  id: string;
  name: string;
  phone: string;
  email: string;
  department: string;
  avatar?: string;
  experience: string;
  vehicle?: string;
}

export interface Assignment {
  id: string;
  issueId: string;
  workerId: string;
  worker?: Worker;
  assignedBy: string;
  assignedAt: Date;
  deadline: Date;
  status: 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  notes: string;
}

export interface ChatMessage {
  id: string;
  issueId: string;
  senderId: string;
  sender?: User;
  text: string;
  createdAt: Date;
  isGroupMessage?: boolean;
}

export interface GroupShare {
  id: string;
  issueId: string;
  groupName: string;
  sharedAt: Date;
  sharedBy: string;
  memberCount: number;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  status: IssueStatus;
  location: GeoLocation;
  images: string[];
  reporterId: string;
  reporter?: User;
  isAnonymous: boolean;
  upvotes: number;
  downvotes: number;
  createdAt: Date;
  updatedAt: Date;
  comments?: IssueComment[];
  updates?: IssueUpdate[];
  aiAnalysis?: AIAnalysis;
  assignedDepartment?: string;
  assignments?: Assignment[];
  chatMessages?: ChatMessage[];
  groupShares?: GroupShare[];
}

export interface DashboardStats {
  totalIssues: number;
  resolvedIssues: number;
  pendingIssues: number;
  issuesByCategory: Record<IssueCategory, number>;
  issuesByStatus: Record<IssueStatus, number>;
  recentIssues: Issue[];
  topVotedIssues: Issue[];
}