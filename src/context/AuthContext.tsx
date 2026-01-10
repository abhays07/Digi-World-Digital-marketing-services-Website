import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string, email: string) => void;
  logout: () => void;
  checkAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('token');
  });

  // Idle Timer
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const IDLE_TIMEOUT = 10 * 60 * 1000; // 10 minutes

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('adminEmail');
    setIsAuthenticated(false);
    
    // Clear any existing timer
    if (timerRef.current) {
        clearTimeout(timerRef.current);
    }

    toast.error('Session expired. Please login again.');
    navigate('/admin-portal-secure-access');
  };

  const login = (token: string, email: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('adminEmail', email);
    setIsAuthenticated(true);
    resetTimer();
  };

  const checkAuth = () => {
      const token = localStorage.getItem('token');
      const isAuth = !!token;
      setIsAuthenticated(isAuth);
      return isAuth;
  }

  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    // Only set timer if user is authenticated
    if (localStorage.getItem('token')) {
        timerRef.current = setTimeout(() => {
        logout();
        }, IDLE_TIMEOUT);
    }
  };

  useEffect(() => {
    // Listen for custom 401 event from httpClient
    const handleUnauthorized = () => {
       logout();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    
    // Setup idle timer listeners
    const events = ['mousemove', 'keydown', 'scroll', 'click'];
    
    const handleUserActivity = () => {
        resetTimer();
    };

    events.forEach(event => {
        window.addEventListener(event, handleUserActivity);
    });

    // Initialize timer
    resetTimer();

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
      events.forEach(event => {
          window.removeEventListener(event, handleUserActivity);
      });
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [navigate]); // navigate is stable

  // Also check validity when location changes (in case token was manually removed)
  useEffect(() => {
      checkAuth();
  }, [location]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
