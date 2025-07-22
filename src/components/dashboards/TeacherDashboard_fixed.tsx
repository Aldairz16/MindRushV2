import React, { useState, useEffect } from 'react';
import { BookOpen, Users, TrendingUp } from 'lucide-react';
import { apiService, Course, User } from '../../services/api';
import { demoCourses } from '../../data/demoCourses';

interface TeacherDashboardProps {
  user: User;
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ user, activeSection = 'dashboard' }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [serverStatus, setServerStatus] = useState<'online' | 'offline' | 'checking'>('checking');

  useEffect(() => {
    if (activeSection === 'dashboard') {
      loadDashboardData();
    }
  }, [activeSection]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setServerStatus('checking');
      
      // Load teacher's courses
      const allCourses = await apiService.getCourses();
      const teacherCourses = allCourses.filter(course => course.instructorId === user.id.toString());
      setCourses(teacherCourses);
      
      // Load all students
      const allUsers = await apiService.getUsers();
      const studentUsers = allUsers.filter(user => user.role === 'student');
      setStudents(studentUsers);
      
      setServerStatus('online');
      setError('');
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setServerStatus('offline');
      setError('No se pudieron cargar los datos. Mostrando datos de demostración.');
      
      // Use demo data as fallback
      console.log('Using demo courses as fallback for teacher');
      const teacherCourses = demoCourses.filter(course => course.instructorId === user.id.toString());
      setCourses(teacherCourses);
      
      // Mock student data
      const mockStudents: User[] = [
        {
          id: 1,
          email: 'student1@demo.com',
          password: '',
          role: 'student',
          name: 'Ana García',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5c0?w=150',
          stats: { completedLevels: 5, currentLevel: 6, totalXP: 450 }
        },
        {
          id: 2,
          email: 'student2@demo.com',
          password: '',
          role: 'student',
          name: 'Carlos Ruiz',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          stats: { completedLevels: 3, currentLevel: 4, totalXP: 280 }
        }
      ];
      setStudents(mockStudents);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard del Docente</h1>
        <p className="text-gray-600">Bienvenido/a, {user.name}</p>
        
        {/* Server Status */}
        <div className={`mt-4 p-3 rounded-lg ${serverStatus === 'online' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
          <div className="flex items-center gap-2">
            {serverStatus === 'online' ? '🟢' : '🟡'} 
            Estado: {serverStatus === 'online' ? 'Conectado' : 'Modo offline'}
          </div>
          {error && <p className="text-sm mt-1">{error}</p>}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <BookOpen className="w-8 h-8 text-blue-500 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Cursos</h3>
              <p className="text-2xl font-bold text-blue-600">{courses.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-green-500 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Estudiantes</h3>
              <p className="text-2xl font-bold text-green-600">{students.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-purple-500 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Rating Promedio</h3>
              <p className="text-2xl font-bold text-purple-600">4.7</p>
            </div>
          </div>
        </div>
      </div>

      {/* Course List */}
      <div className="bg-white rounded-lg shadow border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Mis Cursos</h2>
        </div>
        <div className="p-6">
          {courses.length > 0 ? (
            <div className="space-y-4">
              {courses.map((course) => (
                <div key={course.id} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900">{course.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{course.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-sm text-gray-500">
                      {course.studentsEnrolled} estudiantes inscritos
                    </span>
                    <span className="text-sm font-medium text-blue-600">
                      {course.difficulty}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No tienes cursos creados aún</p>
              <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                Crear tu primer curso
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
