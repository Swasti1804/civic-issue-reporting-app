import { User, Issue, IssueCategory, IssueStatus, IssueComment, IssueUpdate, AIAnalysis, Worker, Assignment, ChatMessage } from '../types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    role: 'citizen',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
    createdAt: new Date('2023-01-15')
  },
  {
    id: '2',
    name: 'Raj Kumar',
    email: 'raj@example.com',
    role: 'citizen',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
    createdAt: new Date('2023-02-20')
  },
  {
    id: '3',
    name: 'Green Earth NGO',
    email: 'contact@greenearth.org',
    role: 'ngo',
    avatar: 'https://images.pexels.com/photos/3184423/pexels-photo-3184423.jpeg?auto=compress&cs=tinysrgb&w=150',
    createdAt: new Date('2022-11-05')
  },
  {
    id: '4',
    name: 'Municipal Commissioner',
    email: 'commissioner@city.gov',
    role: 'authority',
    avatar: 'https://images.pexels.com/photos/5668768/pexels-photo-5668768.jpeg?auto=compress&cs=tinysrgb&w=150',
    createdAt: new Date('2022-10-01')
  }
];

// Mock Issues
export const mockIssues: Issue[] = [
  {
    id: '1',
    title: 'Pothole on Main Street',
    description: 'Large pothole near the intersection of Main St. and 5th Avenue causing traffic issues and potential vehicle damage.',
    category: 'roads',
    status: 'verified',
    location: {
      latitude: 19.0760,
      longitude: 72.8777,
      address: 'Main St & 5th Avenue, Mumbai'
    },
    images: [
      'https://images.pexels.com/photos/5379219/pexels-photo-5379219.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    reporterId: '1',
    isAnonymous: false,
    upvotes: 24,
    downvotes: 2,
    createdAt: new Date('2023-06-15'),
    updatedAt: new Date('2023-06-17')
  },
  {
    id: '2',
    title: 'Garbage not collected in Sector 7',
    description: 'Garbage has not been collected in Sector 7 for the past week, causing sanitation issues.',
    category: 'garbage',
    status: 'in_progress',
    location: {
      latitude: 28.7041,
      longitude: 77.1025,
      address: 'Sector 7, Delhi'
    },
    images: [
      'https://images.pexels.com/photos/2768961/pexels-photo-2768961.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    reporterId: '2',
    isAnonymous: false,
    upvotes: 32,
    downvotes: 0,
    createdAt: new Date('2023-07-02'),
    updatedAt: new Date('2023-07-05')
  },
  {
    id: '3',
    title: 'Street light not working',
    description: 'Street light at the corner of Park Road has been out for two weeks, creating a safety hazard at night.',
    category: 'electricity',
    status: 'resolved',
    location: {
      latitude: 12.9716,
      longitude: 77.5946,
      address: 'Park Road, Bangalore'
    },
    images: [
      'https://images.pexels.com/photos/248159/pexels-photo-248159.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    reporterId: '1',
    isAnonymous: false,
    upvotes: 15,
    downvotes: 1,
    createdAt: new Date('2023-05-20'),
    updatedAt: new Date('2023-06-01')
  },
  {
    id: '4',
    title: 'Water logging after rain',
    description: 'Severe water logging in the residential area after rainfall. The drainage system needs immediate attention.',
    category: 'water',
    status: 'reported',
    location: {
      latitude: 22.5726,
      longitude: 88.3639,
      address: 'Lake Gardens, Kolkata'
    },
    images: [
      'https://images.pexels.com/photos/753869/pexels-photo-753869.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    reporterId: '2',
    isAnonymous: true,
    upvotes: 45,
    downvotes: 3,
    createdAt: new Date('2023-07-25'),
    updatedAt: new Date('2023-07-25')
  },
  {
    id: '5',
    title: 'Public park maintenance needed',
    description: 'The public park in Green Valley needs maintenance. Overgrown grass, broken benches, and playground equipment needs repair.',
    category: 'other',
    status: 'verified',
    location: {
      latitude: 17.3850,
      longitude: 78.4867,
      address: 'Green Valley Park, Hyderabad'
    },
    images: [
      'https://images.pexels.com/photos/763426/pexels-photo-763426.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    reporterId: '3',
    isAnonymous: false,
    upvotes: 18,
    downvotes: 2,
    createdAt: new Date('2023-06-30'),
    updatedAt: new Date('2023-07-02')
  },
  {
    id: '6',
    title: 'Stray dog issue',
    description: 'Increasing number of stray dogs in the neighborhood causing safety concerns for children and elderly.',
    category: 'safety',
    status: 'in_progress',
    location: {
      latitude: 26.9124,
      longitude: 75.7873,
      address: 'Shyam Nagar, Jaipur'
    },
    images: [
      'https://images.pexels.com/photos/1741205/pexels-photo-1741205.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    reporterId: '1',
    isAnonymous: false,
    upvotes: 37,
    downvotes: 5,
    createdAt: new Date('2023-07-10'),
    updatedAt: new Date('2023-07-15')
  }
];

// Mock Comments
export const mockComments: IssueComment[] = [
  {
    id: '1',
    issueId: '1',
    userId: '2',
    text: 'I noticed this pothole too. It\'s becoming dangerous!',
    createdAt: new Date('2023-06-16'),
    user: mockUsers.find(u => u.id === '2')
  },
  {
    id: '2',
    issueId: '1',
    userId: '3',
    text: 'We\'ve reported this to the authorities as well.',
    createdAt: new Date('2023-06-16'),
    user: mockUsers.find(u => u.id === '3')
  },
  {
    id: '3',
    issueId: '2',
    userId: '1',
    text: 'Same issue in my sector as well. Hope it gets fixed soon.',
    createdAt: new Date('2023-07-03'),
    user: mockUsers.find(u => u.id === '1')
  },
  {
    id: '4',
    issueId: '3',
    userId: '4',
    text: 'We\'ve scheduled a repair team to fix this issue.',
    createdAt: new Date('2023-05-25'),
    user: mockUsers.find(u => u.id === '4')
  }
];

// Mock Updates
export const mockUpdates: IssueUpdate[] = [
  {
    id: '1',
    issueId: '1',
    userId: '4',
    text: 'Issue has been verified and assigned to the roads department.',
    newStatus: 'verified',
    createdAt: new Date('2023-06-17'),
    user: mockUsers.find(u => u.id === '4')
  },
  {
    id: '2',
    issueId: '2',
    userId: '4',
    text: 'Waste management team has been dispatched to address the issue.',
    newStatus: 'in_progress',
    createdAt: new Date('2023-07-05'),
    user: mockUsers.find(u => u.id === '4')
  },
  {
    id: '3',
    issueId: '3',
    userId: '4',
    text: 'The street light has been repaired and is now functioning.',
    newStatus: 'resolved',
    createdAt: new Date('2023-06-01'),
    user: mockUsers.find(u => u.id === '4')
  }
];

// Mock AI Analyses
export const mockAIAnalyses: AIAnalysis[] = [
  {
    id: 'analysis-1',
    issueId: '1',
    severity: 'high',
    confidence: 92,
    detectedIssues: ['Road deterioration', 'Pothole damage'],
    recommendations: [
      'Schedule urgent inspection within 24 hours',
      'Install temporary warning signs if needed',
      'Conduct structural assessment before repair work'
    ],
    assignedDepartment: 'Public Works Department',
    estimatedResolutionDays: 5,
    riskFactors: ['Traffic congestion', 'Vehicle damage risk'],
    analyzedAt: new Date('2023-06-15')
  },
  {
    id: 'analysis-2',
    issueId: '2',
    severity: 'high',
    confidence: 88,
    detectedIssues: ['Waste accumulation', 'Sanitation issue'],
    recommendations: [
      'Schedule urgent inspection within 24 hours',
      'Schedule immediate waste collection',
      'Identify root cause of delay'
    ],
    assignedDepartment: 'Waste Management Department',
    estimatedResolutionDays: 4,
    riskFactors: ['Disease spread', 'Pest infestation'],
    analyzedAt: new Date('2023-07-02')
  },
  {
    id: 'analysis-3',
    issueId: '3',
    severity: 'high',
    confidence: 95,
    detectedIssues: ['Power outage', 'Safety hazard'],
    recommendations: [
      'Engage qualified electrician for inspection',
      'Safety protocol: Restrict public access to area',
      'Sufficient visual evidence for assessment'
    ],
    assignedDepartment: 'Electricity Department',
    estimatedResolutionDays: 1,
    riskFactors: ['Safety risk', 'Fire hazard'],
    analyzedAt: new Date('2023-05-20')
  },
  {
    id: 'analysis-4',
    issueId: '4',
    severity: 'critical',
    confidence: 90,
    detectedIssues: ['Water logging', 'Drainage blockage'],
    recommendations: [
      'URGENT: Dispatch team immediately for on-site assessment',
      'Alert relevant authority for emergency action',
      'Test water quality if applicable'
    ],
    assignedDepartment: 'Water Supply Department',
    estimatedResolutionDays: 3,
    riskFactors: ['Health hazard', 'Property damage'],
    analyzedAt: new Date('2023-07-25')
  },
  {
    id: 'analysis-5',
    issueId: '5',
    severity: 'medium',
    confidence: 85,
    detectedIssues: ['Infrastructure maintenance needed', 'Public safety concern'],
    recommendations: [
      'Schedule inspection within 3-5 business days',
      'Request additional photos from reporter for better analysis',
      'Assess area accessibility and safety measures'
    ],
    assignedDepartment: 'Municipal Administration',
    estimatedResolutionDays: 10,
    riskFactors: ['Community concern'],
    analyzedAt: new Date('2023-06-30')
  },
  {
    id: 'analysis-6',
    issueId: '6',
    severity: 'high',
    confidence: 88,
    detectedIssues: ['Security concern', 'Public safety issue'],
    recommendations: [
      'Schedule urgent inspection within 24 hours',
      'Increase police patrolling in the area',
      'Coordinate with local safety officials'
    ],
    assignedDepartment: 'Police & Safety Department',
    estimatedResolutionDays: 2,
    riskFactors: ['Public harm risk', 'Criminal activity'],
    analyzedAt: new Date('2023-07-10')
  }
];

// Add comments, updates, and AI analysis to issues
export const enrichedMockIssues = mockIssues.map(issue => ({
  ...issue,
  comments: mockComments.filter(comment => comment.issueId === issue.id),
  updates: mockUpdates.filter(update => update.issueId === issue.id),
  reporter: issue.isAnonymous ? undefined : mockUsers.find(user => user.id === issue.reporterId),
  aiAnalysis: mockAIAnalyses.find(analysis => analysis.issueId === issue.id),
  assignedDepartment: mockAIAnalyses.find(analysis => analysis.issueId === issue.id)?.assignedDepartment
}));

// Category information
export const categoryInfo: Record<IssueCategory, { name: string; icon: string; color: string }> = {
  roads: { 
    name: 'Road Issues', 
    icon: 'road', 
    color: 'bg-amber-500' 
  },
  water: { 
    name: 'Water Supply', 
    icon: 'droplets', 
    color: 'bg-blue-500' 
  },
  electricity: { 
    name: 'Electricity', 
    icon: 'zap', 
    color: 'bg-yellow-500' 
  },
  garbage: { 
    name: 'Waste Management', 
    icon: 'trash-2', 
    color: 'bg-green-500' 
  },
  sewage: { 
    name: 'Sewage', 
    icon: 'pipe', 
    color: 'bg-brown-500' 
  },
  pollution: { 
    name: 'Pollution', 
    icon: 'factory', 
    color: 'bg-slate-500' 
  },
  safety: { 
    name: 'Safety & Security', 
    icon: 'shield', 
    color: 'bg-red-500' 
  },
  traffic: { 
    name: 'Traffic', 
    icon: 'car', 
    color: 'bg-orange-500' 
  },
  other: { 
    name: 'Other Issues', 
    icon: 'more-horizontal', 
    color: 'bg-gray-500' 
  }
};

// Status information
export const statusInfo: Record<IssueStatus, { name: string; icon: string; color: string }> = {
  reported: { 
    name: 'Reported', 
    icon: 'flag', 
    color: 'bg-gray-500' 
  },
  verified: { 
    name: 'Verified', 
    icon: 'check-circle', 
    color: 'bg-blue-500' 
  },
  in_progress: { 
    name: 'In Progress', 
    icon: 'clock', 
    color: 'bg-yellow-500' 
  },
  resolved: { 
    name: 'Resolved', 
    icon: 'check', 
    color: 'bg-green-500' 
  },
  closed: { 
    name: 'Closed', 
    icon: 'x-circle', 
    color: 'bg-red-500' 
  },
  reopened: { 
    name: 'Reopened', 
    icon: 'refresh-cw', 
    color: 'bg-purple-500' 
  }
};

// Mock Workers
export const mockWorkers: Worker[] = [
  {
    id: 'worker-1',
    name: 'राज शर्मा',
    phone: '+91-9876543210',
    email: 'raj.sharma@dept.com',
    department: 'Public Works Department',
    experience: '5 years',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=raj',
    vehicle: 'Truck - MH01AB1234'
  },
  {
    id: 'worker-2',
    name: 'अमित कुमार',
    phone: '+91-9123456789',
    email: 'amit.kumar@dept.com',
    department: 'Public Works Department',
    experience: '3 years',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amit',
    vehicle: 'Van - MH01CD5678'
  },
  {
    id: 'worker-3',
    name: 'विक्रम पटेल',
    phone: '+91-8765432109',
    email: 'vikram.patel@dept.com',
    department: 'Water Supply Department',
    experience: '7 years',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vikram',
    vehicle: 'Truck - MH01EF9012'
  }
];

// Mock Assignments
export const mockAssignments: Assignment[] = [
  {
    id: 'assign-1',
    issueId: '1',
    workerId: 'worker-1',
    worker: mockWorkers[0],
    assignedBy: 'dept-admin',
    assignedAt: new Date('2024-11-20'),
    deadline: new Date('2024-11-23'),
    status: 'in_progress',
    notes: 'Urgent repair needed. Heavy traffic during peak hours. Deploy early morning crew.'
  }
];

// Mock Chat Messages
export const mockChatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    issueId: '1',
    senderId: 'dept-admin',
    text: 'राज को इस काम के लिए assign किया गया है। कृपया 23 नवंबर तक पूरा करें।',
    createdAt: new Date('2024-11-20T10:30:00'),
    isGroupMessage: true
  },
  {
    id: 'msg-2',
    issueId: '1',
    senderId: 'worker-1',
    text: 'सर, मैं कल सुबह 8 बजे site पर पहुंच जाऊंगा। क्या कोई special equipment चाहिए?',
    createdAt: new Date('2024-11-20T11:15:00'),
    isGroupMessage: true
  },
  {
    id: 'msg-3',
    issueId: '1',
    senderId: '1',
    text: 'धन्यवाद। यह बहुत जल्दी ठीक हो गया!',
    createdAt: new Date('2024-11-22T14:45:00'),
    isGroupMessage: false
  }
];