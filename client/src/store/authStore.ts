import { create } from 'zustand';
import { User } from '../types';
import { mockUsers } from '../data/mockData';
import { jwtDecode } from 'jwt-decode';

interface GoogleCredentialResponse {
  credential: string;
}

interface GoogleTokenPayload {
  email: string;
  name: string;
  picture?: string;
  email_verified?: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string, role: 'citizen' | 'ngo' | 'authority') => Promise<void>;
  googleSignUp: (credentialResponse: GoogleCredentialResponse) => Promise<void>;
  googleLogin: (credentialResponse: GoogleCredentialResponse) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user in mock data
      const user = mockUsers.find(u => u.email === email);
      
      // For demo, any password works with a valid email
      if (user) {
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        set({ error: 'Invalid email or password', isLoading: false });
      }
    } catch (error) {
      set({ error: 'Login failed. Please try again.', isLoading: false });
    }
  },
  
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
  
  register: async (name: string, email: string, password: string, role: 'citizen' | 'ngo' | 'authority') => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll pretend the registration was successful
      // In a real app, this would make an API call to register the user
      const newUser: User = {
        id: `mock-${Date.now()}`,
        name,
        email,
        role,
        createdAt: new Date()
      };
      
      set({ user: newUser, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ error: 'Registration failed. Please try again.', isLoading: false });
    }
  },

  googleSignUp: async (credentialResponse: GoogleCredentialResponse) => {
    set({ isLoading: true, error: null });
    try {
      // Decode JWT token from Google
      const decoded = jwtDecode<GoogleTokenPayload>(credentialResponse.credential);
      
      if (!decoded.email || !decoded.name) {
        set({ error: 'Invalid Google account data', isLoading: false });
        return;
      }

      // Check if user already exists
      const existingUser = mockUsers.find(u => u.email === decoded.email);
      if (existingUser) {
        set({ user: existingUser, isAuthenticated: true, isLoading: false });
        return;
      }

      // Create new user from Google data
      const newUser: User = {
        id: `google-${Date.now()}`,
        name: decoded.name,
        email: decoded.email,
        role: 'citizen', // Default role for new Google sign-ups
        avatar: decoded.picture,
        createdAt: new Date()
      };

      // Add to mock users list for persistence in this session
      mockUsers.push(newUser);

      set({ user: newUser, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ error: 'Google sign-up failed. Please try again.', isLoading: false });
    }
  },

  googleLogin: async (credentialResponse: GoogleCredentialResponse) => {
    set({ isLoading: true, error: null });
    try {
      // Decode JWT token from Google
      const decoded = jwtDecode<GoogleTokenPayload>(credentialResponse.credential);
      
      if (!decoded.email) {
        set({ error: 'Invalid Google account data', isLoading: false });
        return;
      }

      // Find user by email
      const user = mockUsers.find(u => u.email === decoded.email);
      if (user) {
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        set({ error: 'No account found with this Google email. Please sign up first.', isLoading: false });
      }
    } catch (error) {
      set({ error: 'Google login failed. Please try again.', isLoading: false });
    }
  },
}));