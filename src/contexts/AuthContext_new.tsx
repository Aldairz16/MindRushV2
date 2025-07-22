import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService, User } from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  isServerAvailable: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isServerAvailable, setIsServerAvailable] = useState(false);

  useEffect(() => {
    // Verificar si el servidor está disponible
    const checkServer = async () => {
      const available = await apiService.isServerAvailable();
      setIsServerAvailable(available);
      
      if (available) {
        // Verificar si hay un usuario logueado
        const savedUser = localStorage.getItem('mindrush_user');
        if (savedUser) {
          try {
            const userData = JSON.parse(savedUser);
            setUser(userData);
          } catch (error) {
            console.error('Error loading user from localStorage:', error);
            localStorage.removeItem('mindrush_user');
          }
        }
      } else {
        // Fallback a usuarios mock si el servidor no está disponible
        const savedUser = localStorage.getItem('mindrush_user');
        if (savedUser) {
          try {
            const userData = JSON.parse(savedUser);
            setUser(userData);
          } catch (error) {
            console.error('Error loading user from localStorage:', error);
            localStorage.removeItem('mindrush_user');
          }
        }
      }
      
      setLoading(false);
    };

    checkServer();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      if (isServerAvailable) {
        // Usar API real
        const authenticatedUser = await apiService.login(email, password);
        if (authenticatedUser) {
          setUser(authenticatedUser);
          localStorage.setItem('mindrush_user', JSON.stringify(authenticatedUser));
          setLoading(false);
          return true;
        }
      } else {
        // Fallback a autenticación mock
        const mockUsers: { [key: string]: User } = {
          'admin@mindrush.com': { 
            id: 3, 
            email: 'admin@mindrush.com', 
            password: 'password',
            name: 'María Rodriguez', 
            role: 'admin',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
            stats: {
              totalUsers: 1250,
              totalCourses: 45,
              activeStudents: 892,
              platformRating: 4.7
            }
          },
          'teacher@mindrush.com': { 
            id: 2, 
            email: 'teacher@mindrush.com', 
            password: 'password',
            name: 'Dr. Carlos Mendoza', 
            role: 'teacher',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
            stats: {
              coursesCreated: 3,
              totalStudents: 89,
              averageRating: 4.7,
              totalLessons: 32
            },
            courses: ["js-advanced-2024", "react-fundamentals-2024", "python-data-science-2024"]
          },
          'student@mindrush.com': { 
            id: 1, 
            email: 'student@mindrush.com', 
            password: 'password',
            name: 'Ana García', 
            role: 'student',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5c0?w=150',
            stats: {
              completedLevels: 2,
              currentLevel: 3,
              totalXP: 220,
              unlockedLevels: 4,
              coursesEnrolled: 3,
              averageScore: 85
            },
            enrolledCourses: ["js-advanced-2024", "react-fundamentals-2024", "python-data-science-2024"]
          }
        };

        const userData = mockUsers[email];
        if (userData && password === 'password') {
          setUser(userData);
          localStorage.setItem('mindrush_user', JSON.stringify(userData));
          setLoading(false);
          return true;
        }
      }
      
      setLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mindrush_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isServerAvailable }}>
      {children}
    </AuthContext.Provider>
  );
};
