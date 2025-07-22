import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  Award,
  Play,
  Edit,
  BarChart3,
  Clock,
  Wifi,
  WifiOff,
  AlertCircle,
  CheckCircle,
  Star,
  Calendar,
  Plus,
  Eye
} from 'lucide-react';
import { CourseManager } from '../teacher/CourseManager';
import { CourseCreator } from '../teacher/CourseCreator';
import { StudentManager } from '../teacher/StudentManager';
import { apiService, Course, User } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { demoCourses } from '../../data/demoCourses';

interface TeacherDashboardProps {
  user: User;
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ user, activeSection = 'dashboard', onSectionChange }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
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
      
      // Load all students and enrollments for analytics
      const allUsers = await apiService.getUsers();
      const studentUsers = allUsers.filter(user => user.role === 'student');
      setStudents(studentUsers);
      
      // Load enrollments
      const enrollmentData = await apiService.getEnrollments();
      setEnrollments(enrollmentData);
      
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
      setEnrollments([]);
    } finally {
      setLoading(false);
    }
  };

  // Render different sections based on activeSection
  if (activeSection === 'courses') {
    return <CourseManager user={user} />;
  }

  if (activeSection === 'create-course') {
    return <CourseCreator user={user} />;
  }

  if (activeSection === 'students') {
    return <StudentManager user={user} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Cargando dashboard del docente...</p>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalStudents = students.length;
  const totalCourses = courses.length;
  const avgRating = courses.length > 0 ? (courses.reduce((sum, course) => sum + course.rating, 0) / courses.length).toFixed(1) : '0.0';
  const totalEnrollments = enrollments.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header with Server Status */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard del Docente</h1>
              <p className="text-gray-600 mt-1">Bienvenido/a, {user.name}</p>
            </div>
            
            {/* Server Status Indicator */}
            <div className={`flex items-center px-3 py-2 rounded-full ${
              serverStatus === 'online' ? 'bg-green-100 text-green-800' : 
              serverStatus === 'offline' ? 'bg-yellow-100 text-yellow-800' : 
              'bg-blue-100 text-blue-800'
            }`}>
              {serverStatus === 'online' ? (
                <><Wifi className="w-4 h-4 mr-2" /> Conectado</>
              ) : serverStatus === 'offline' ? (
                <><WifiOff className="w-4 h-4 mr-2" /> Modo offline</>
              ) : (
                <><div className="w-4 h-4 mr-2 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /> Verificando...</>
              )}
            </div>
          </div>
          
          {error && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                <p className="text-yellow-800 text-sm">{error}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Courses */}
          <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-200">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-500 bg-opacity-10 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Cursos Creados</h3>
                  <p className="text-3xl font-bold text-blue-600">{totalCourses}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Total Students */}
          <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-200">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-500 bg-opacity-10 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Estudiantes</h3>
                  <p className="text-3xl font-bold text-green-600">{totalStudents}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Average Rating */}
          <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-200">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-yellow-500 bg-opacity-10 rounded-xl flex items-center justify-center">
                    <Star className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Rating Promedio</h3>
                  <p className="text-3xl font-bold text-yellow-600">{avgRating}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Total Enrollments */}
          <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-200">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-500 bg-opacity-10 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Inscripciones</h3>
                  <p className="text-3xl font-bold text-purple-600">{totalEnrollments}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Courses */}
          <div className="bg-white shadow-lg rounded-xl border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Mis Cursos</h2>
                <button 
                  onClick={() => onSectionChange?.('create-course')}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Curso
                </button>
              </div>
            </div>
            <div className="p-6">
              {courses.length > 0 ? (
                <div className="space-y-4">
                  {courses.slice(0, 3).map((course) => (
                    <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{course.title}</h3>
                          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{course.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {course.studentsEnrolled} estudiantes
                            </span>
                            <span className="flex items-center">
                              <Star className="w-4 h-4 mr-1 text-yellow-500" />
                              {course.rating}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {course.duration}h
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button 
                            onClick={() => onSectionChange?.('courses')}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Ver detalles"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                            title="Editar curso"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {courses.length > 3 && (
                    <button 
                      onClick={() => onSectionChange?.('courses')}
                      className="w-full text-center py-3 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      Ver todos los cursos ({courses.length})
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes cursos aún</h3>
                  <p className="text-gray-500 mb-4">Crea tu primer curso para comenzar a enseñar</p>
                  <button 
                    onClick={() => onSectionChange?.('create-course')}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Crear mi primer curso
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Recent Student Activity */}
          <div className="bg-white shadow-lg rounded-xl border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Actividad Reciente</h2>
            </div>
            <div className="p-6">
              {students.length > 0 ? (
                <div className="space-y-4">
                  {students.slice(0, 5).map((student) => (
                    <div key={student.id} className="flex items-center space-x-3">
                      <img 
                        src={student.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=3B82F6&color=fff`}
                        alt={student.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{student.name}</h4>
                        <p className="text-sm text-gray-500">
                          {student.stats?.completedLevels || 0} niveles completados
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-600">
                          +{student.stats?.totalXP || 0} XP
                        </p>
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={() => onSectionChange?.('students')}
                    className="w-full text-center py-3 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    Ver todos los estudiantes
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Sin actividad reciente</h3>
                  <p className="text-gray-500">La actividad de los estudiantes aparecerá aquí</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <div className="bg-white shadow-lg rounded-xl border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Acciones Rápidas</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={() => onSectionChange?.('create-course')}
                  className="flex items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors group"
                >
                  <Plus className="w-6 h-6 text-blue-600 mr-3 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-blue-900">Crear Nuevo Curso</span>
                </button>
                
                <button 
                  onClick={() => onSectionChange?.('courses')}
                  className="flex items-center justify-center p-4 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors group"
                >
                  <BookOpen className="w-6 h-6 text-green-600 mr-3 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-green-900">Gestionar Cursos</span>
                </button>
                
                <button 
                  onClick={() => onSectionChange?.('students')}
                  className="flex items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors group"
                >
                  <Users className="w-6 h-6 text-purple-600 mr-3 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-purple-900">Ver Estudiantes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
