import React, { useState } from 'react';
import { 
  Home, 
  LogOut,
  Zap,
  Star,
  X,
  BookOpen,
  Users,
  BarChart3,
  FileText,
  Settings,
  PlusCircle
} from 'lucide-react';
import { User } from '../services/api';

interface NavigationProps {
  user: User;
  onLogout: () => void;
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ user, onLogout, activeSection = 'dashboard', onSectionChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getMenuItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
    ];

    // Opciones específicas por rol
    if (user.role === 'student') {
      const studentItems = [
        { id: 'courses', label: 'Explorar Cursos', icon: BookOpen },
        { id: 'manage-courses', label: 'Gestionar Cursos', icon: Users },
        { id: 'progress', label: 'Mi Progreso', icon: BarChart3 },
      ];
      return [...baseItems, ...studentItems];
    }

    if (user.role === 'teacher') {
      const teacherItems = [
        { id: 'courses', label: 'Mis Cursos', icon: BookOpen },
        { id: 'create-course', label: 'Crear Curso', icon: PlusCircle },
        { id: 'students', label: 'Estudiantes', icon: Users },
        { id: 'analytics', label: 'Analíticas', icon: BarChart3 },
        { id: 'assignments', label: 'Tareas', icon: FileText },
      ];
      return [...baseItems, ...teacherItems];
    }

    if (user.role === 'admin') {
      const adminItems = [
        { id: 'users', label: 'Gestión Usuarios', icon: Users },
        { id: 'courses-admin', label: 'Gestión Cursos', icon: BookOpen },
        { id: 'analytics', label: 'Analíticas', icon: BarChart3 },
        { id: 'settings', label: 'Configuración', icon: Settings },
      ];
      return [...baseItems, ...adminItems];
    }

    return baseItems;
  };

  const getRoleColor = () => {
    const colors = {
      admin: 'from-red-500 to-red-600',
      teacher: 'from-blue-500 to-blue-600',
      student: 'from-green-500 to-green-600'
    };
    return colors[user.role];
  };

  const getRoleTitle = () => {
    const titles = {
      admin: 'El Arquitecto del Sistema',
      teacher: 'El Creador de Experiencias',
      student: 'El Explorador del Conocimiento'
    };
    return titles[user.role];
  };

  const handleSectionChange = (sectionId: string) => {
    if (onSectionChange) {
      onSectionChange(sectionId);
    }
  };

  return (
    <nav className={`${isMobileMenuOpen ? 'fixed inset-0 z-50' : 'relative'} lg:relative w-full lg:w-64 bg-white shadow-xl border-r border-gray-200 flex flex-col`}>
      {/* Mobile Menu Button */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-1.5 rounded-full">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h1 className="ml-2 text-lg font-bold text-gray-800">MindRush</h1>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 text-gray-600" />
          ) : (
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <div className="w-full h-0.5 bg-gray-600"></div>
              <div className="w-full h-0.5 bg-gray-600"></div>
              <div className="w-full h-0.5 bg-gray-600"></div>
            </div>
          )}
        </button>
      </div>

      {/* Header */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden lg:block'} p-4 lg:p-6 border-b border-gray-200`}>
        <div className="flex items-center mb-4">
          <div className="hidden lg:block bg-gradient-to-r from-yellow-400 to-orange-500 p-1.5 lg:p-2 rounded-full">
            <Zap className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
          </div>
          <h1 className="hidden lg:block ml-2 lg:ml-3 text-lg lg:text-xl font-bold text-gray-800">MindRush</h1>
        </div>
        
        {/* User Profile */}
        <div className={`bg-gradient-to-r ${getRoleColor()} p-3 lg:p-4 rounded-lg text-white`}>
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-xs lg:text-sm font-semibold">{user.name.charAt(0)}</span>
            </div>
            <div className="ml-2 lg:ml-3">
              <div className="font-semibold text-sm lg:text-base">{user.name}</div>
              <div className="text-xs opacity-90 hidden lg:block">{getRoleTitle()}</div>
            </div>
          </div>
          
          {/* Level and XP */}
          <div className="flex items-center justify-between text-xs">
            <span>Nivel {user.progress?.level || 1}</span>
            <div className="flex items-center">
              <Star className="w-3 h-3 mr-1" />
              <span>{user.progress?.xp || 0} XP</span>
            </div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2 mt-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${((user.progress?.xp || 0) % 1000) / 10}%` }}
            />
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden lg:block'} flex-1 py-4`}>
        {getMenuItems().map((item) => (
          <button
            key={item.id}
            onClick={() => {
              handleSectionChange(item.id);
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
              activeSection === item.id 
                ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span className="text-sm lg:text-base">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Logout */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden lg:block'} p-4 border-t border-gray-200`}>
        <button
          onClick={() => {
            onLogout();
            setIsMobileMenuOpen(false);
          }}
          className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span className="text-sm lg:text-base">Cerrar Sesión</span>
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </nav>
  );
};