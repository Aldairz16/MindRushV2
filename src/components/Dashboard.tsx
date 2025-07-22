import React from 'react';
import { StudentDashboard } from './dashboards/StudentDashboard';
import { TeacherDashboard } from './dashboards/TeacherDashboard';
import { AdminDashboard } from './dashboards/AdminDashboard';
import { User } from '../services/api';

interface DashboardProps {
  user: User;
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, activeSection = 'dashboard', onSectionChange }) => {
  // Renderizar dashboard según el rol del usuario
  if (user.role === 'teacher') {
    return (
      <div className="min-h-screen bg-gray-50">
        <TeacherDashboard user={user} activeSection={activeSection} />
      </div>
    );
  }

  if (user.role === 'admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminDashboard user={user} activeSection={activeSection} />
      </div>
    );
  }

  // Por defecto, dashboard de estudiante
  return (
    <div className="min-h-screen bg-gray-50">
      <StudentDashboard user={user} activeSection={activeSection} />
    </div>
  );
};