import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { setAuthToken, clearAuthTokens, getAuthToken, isAuthenticated as checkIsAuthenticated } from '../utils/securityUtils.ts';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'farmer' | 'advisor' | 'vendor' | 'financier' | 'agri_expert' | 'government_officer' | 'admin';
  profile: {
    // Common fields
    preferredLanguage: string;
    avatar?: string;
    
    // Farmer-specific fields
    farmSize?: number;
    farmLocation?: {
      state: string;
      district: string;
      village?: string;
      coordinates?: {
        latitude: number;
        longitude: number;
      };
    };
    farmParcels?: number;
    farmingType?: 'crop' | 'livestock' | 'mixed' | 'other';
    hasIrrigation?: boolean;
    hasSmartphone?: boolean;
    crops?: string[];
    experience?: number;
    
    // Financier-specific fields
    organizationName?: string;
    operationAreas?: string[];
    loanTypes?: string[];
    
    // Vendor-specific fields
    businessName?: string;
    productTypes?: string[];
    operatingLocations?: string[];
  };
  isVerified: boolean;
  lastLogin?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: 'farmer' | 'advisor' | 'vendor' | 'financier' | 'agri_expert' | 'government_officer';
  profile?: {
    // Common fields
    preferredLanguage?: string;
    
    // Farmer-specific fields
    farmLocation?: {
      state?: string;
      district?: string;
      village?: string;
    };
    farmSize?: number;
    farmParcels?: number;
    farmingType?: 'crop' | 'livestock' | 'mixed' | 'other';
    hasIrrigation?: boolean;
    hasSmartphone?: boolean;
    
    // Financier-specific fields
    organizationName?: string;
    operationAreas?: string[];
    loanTypes?: string[];
    
    // Vendor-specific fields
    businessName?: string;
    productTypes?: string[];
    operatingLocations?: string[];
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check if user is already authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const isAuth = checkIsAuthenticated();
        setIsAuthenticated(isAuth);

        if (isAuth) {
          // Fetch user data
          const response = await fetch('/api/users/profile', {
            headers: {
              'Authorization': `Bearer ${getAuthToken()}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data.data);
          } else {
            // If we can't get user data, clear tokens
            clearAuthTokens();
            setIsAuthenticated(false);
            setUser(null);
          }
        }
      } catch (err) {
        console.error('Auth check error:', err);
        clearAuthTokens();
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Set auth token
      setAuthToken(data.data.token, 7 * 24 * 60 * 60); // 7 days in seconds

      // Set user data
      setUser(data.data.user);
      setIsAuthenticated(true);
      
      // Navigate to home page
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Set auth token
      setAuthToken(data.data.token, 7 * 24 * 60 * 60); // 7 days in seconds

      // Set user data
      setUser(data.data.user);
      setIsAuthenticated(true);
      
      // Navigate to home page
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Call logout API (optional, as JWT is stateless)
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      });

      // Clear tokens
      clearAuthTokens();
      
      // Update state
      setUser(null);
      setIsAuthenticated(false);
      
      // Navigate to home page
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
      // Still clear tokens and state on error
      clearAuthTokens();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        register,
        logout,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};