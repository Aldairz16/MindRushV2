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

  const { user: currentUser } = useAuth();

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
    return <CourseManager />;
  }

  if (activeSection === 'create-course') {
    return <CourseCreator onSave={() => {}} onCancel={() => onSectionChange?.('courses')} />;
  }

  if (activeSection === 'students') {
    return <StudentManager />;
  }

  if (activeSection === 'analytics') {
    return (
      <div className="p-6">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white mb-6">
          <h1 className="text-3xl font-bold mb-2">Analíticas</h1>
          <p className="text-blue-100">Dashboard de analíticas avanzadas - Próximamente</p>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalStudents = enrollments.filter(enrollment => 
    courses.some(course => course.id === enrollment.courseId)
  ).length;

  const totalEnrollments = enrollments.filter(enrollment => 
    courses.some(course => course.id === enrollment.courseId)
  ).length;

  const averageRating = courses.length > 0 
    ? courses.reduce((sum, course) => sum + course.rating, 0) / courses.length 
    : 0;

  const recentEnrollments = enrollments
    .filter(enrollment => courses.some(course => course.id === enrollment.courseId))
    .sort((a, b) => new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime())
    .slice(0, 5);

  const stats = [
    { 
      label: 'Cursos Creados', 
      value: courses.length.toString(), 
      color: 'bg-blue-500',
      icon: BookOpen,
      change: '+2 este mes'
    },
    { 
      label: 'Estudiantes Activos', 
      value: totalStudents.toString(), 
      color: 'bg-green-500',
      icon: Users,
      change: '+12 este mes'
    },
    { 
      label: 'Inscripciones Totales', 
      value: totalEnrollments.toString(), 
      color: 'bg-purple-500',
      icon: TrendingUp,
      change: '+8 esta semana'
    },
    { 
      label: 'Calificación Promedio', 
      value: averageRating.toFixed(1), 
      color: 'bg-yellow-500',
      icon: Star,
      change: 'Excelente'
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6 p-4 lg:p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 lg:p-6 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">Panel del Profesor</h1>
            <p className="text-blue-100 text-sm lg:text-base">Bienvenido, {user.name}</p>
          </div>
          
          {/* Server Status */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600">
            {serverStatus === 'online' && (
              <>
                <Wifi className="w-4 h-4 text-blue-200" />
                <span className="text-sm text-blue-100">Sincronizado</span>
              </>
            )}
            {serverStatus === 'offline' && (
              <>
                <WifiOff className="w-4 h-4 text-red-200" />
                <span className="text-sm text-red-100">Offline</span>
              </>
            )}
            {serverStatus === 'checking' && (
              <>
                <div className="w-4 h-4 border-2 border-blue-200 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-blue-100">Conectando...</span>
              </>
            )}
          </div>
        </div>
        
        <div className="mt-4 flex items-center space-x-4 lg:space-x-6 text-sm lg:text-base">
          <div className="flex items-center">
            <BookOpen className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
            <span>{courses.length} Cursos</span>
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
            <span>{totalStudents} Estudiantes</span>
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
            <span>{averageRating.toFixed(1)} Rating</span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-3">
                <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-gray-500" />
                <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
              </div>
              <div className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-xs lg:text-sm text-gray-600 mb-1">{stat.label}</div>
              <div className="text-xs text-green-600">{stat.change}</div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => onSectionChange?.('create-course')}
          className="bg-gradient-to-r from-green-500 to-teal-600 p-6 rounded-xl text-white text-left hover:from-green-600 hover:to-teal-700 transition-all"
        >
          <Plus className="w-8 h-8 mb-3" />
          <h3 className="text-lg font-semibold mb-2">Crear Nuevo Curso</h3>
          <p className="text-green-100 text-sm">Diseña contenido educativo innovador</p>
        </button>

        <button
          onClick={() => onSectionChange?.('courses')}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-xl text-white text-left hover:from-blue-600 hover:to-indigo-700 transition-all"
        >
          <Edit className="w-8 h-8 mb-3" />
          <h3 className="text-lg font-semibold mb-2">Gestionar Cursos</h3>
          <p className="text-blue-100 text-sm">Edita y administra tus cursos existentes</p>
        </button>

        <button
          onClick={() => onSectionChange?.('students')}
          className="bg-gradient-to-r from-purple-500 to-pink-600 p-6 rounded-xl text-white text-left hover:from-purple-600 hover:to-pink-700 transition-all"
        >
          <Users className="w-8 h-8 mb-3" />
          <h3 className="text-lg font-semibold mb-2">Ver Estudiantes</h3>
          <p className="text-purple-100 text-sm">Monitorea el progreso de tus estudiantes</p>
        </button>
      </div>

      {/* Recent Activity & My Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Courses */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-4 lg:p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg lg:text-xl font-semibold text-gray-900">Mis Cursos</h2>
              <button
                onClick={() => onSectionChange?.('courses')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
              >
                <Eye className="w-4 h-4" />
                Ver todos
              </button>
            </div>
          </div>
          
          <div className="p-4 lg:p-6">
            {courses.length > 0 ? (
              <div className="space-y-4">
                {courses.slice(0, 3).map(course => (
                  <div key={course.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{course.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        course.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {course.status === 'published' ? 'Publicado' : 'Borrador'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{course.studentsEnrolled} estudiantes</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        <span>{course.rating.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration}h</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        course.difficulty === 'Principiante' ? 'bg-green-100 text-green-800' :
                        course.difficulty === 'Intermedio' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {course.difficulty}
                      </span>
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        Gestionar →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="mb-2">No tienes cursos creados</p>
                <button
                  onClick={() => onSectionChange?.('create-course')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Crear tu primer curso →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-4 lg:p-6 border-b">
            <h2 className="text-lg lg:text-xl font-semibold text-gray-900">Actividad Reciente</h2>
          </div>
          
          <div className="p-4 lg:p-6">
            {recentEnrollments.length > 0 ? (
              <div className="space-y-4">
                {recentEnrollments.map((enrollment, index) => {
                  const course = courses.find(c => c.id === enrollment.courseId);
                  const student = students.find(s => s.id === enrollment.userId);
                  
                  if (!course || !student) return null;
                  
                  return (
                    <div key={enrollment.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {student.name} se inscribió en {course.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(enrollment.enrolledAt).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No hay actividad reciente</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-4 lg:p-6 border-b">
          <h2 className="text-lg lg:text-xl font-semibold text-gray-900">Resumen de Rendimiento</h2>
        </div>
        
        <div className="p-4 lg:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Crecimiento</h3>
              <p className="text-2xl font-bold text-blue-600 mb-1">+{totalEnrollments}</p>
              <p className="text-sm text-gray-600">Nuevas inscripciones</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Calidad</h3>
              <p className="text-2xl font-bold text-green-600 mb-1">{averageRating.toFixed(1)}/5</p>
              <p className="text-sm text-gray-600">Calificación promedio</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Alcance</h3>
              <p className="text-2xl font-bold text-purple-600 mb-1">{totalStudents}</p>
              <p className="text-sm text-gray-600">Estudiantes activos</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
