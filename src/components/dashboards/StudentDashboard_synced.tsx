import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Trophy, 
  Clock, 
  TrendingUp,
  Star,
  Calendar,
  Play,
  CheckCircle,
  Wifi,
  WifiOff,
  AlertCircle,
  Award,
  BarChart3,
  Target,
  Brain,
  Zap
} from 'lucide-react';
import { CourseExplorer } from '../student/CourseExplorer';
import { apiService, Course, User } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

interface StudentDashboardProps {
  user: User;
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, activeSection = 'dashboard', onSectionChange }) => {
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [serverStatus, setServerStatus] = useState<'online' | 'offline' | 'checking'>('checking');

  const { user: currentUser } = useAuth();

  useEffect(() => {
    if (activeSection === 'dashboard') {
      loadDashboardData();
    }
  }, [activeSection, user.id]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setServerStatus('checking');
      
      // Load all courses and user enrollments
      const courses = await apiService.getCourses();
      const userEnrollments = await apiService.getEnrollments();
      const userActivities = await apiService.getActivities();
      
      setAllCourses(courses);
      setEnrollments(userEnrollments);
      setActivities(userActivities);
      
      // Filter enrolled courses for this user
      const userEnrolledCourseIds = userEnrollments
        .filter(enrollment => enrollment.userId === user.id)
        .map(enrollment => enrollment.courseId);
      
      const enrolled = courses.filter(course => 
        userEnrolledCourseIds.includes(course.id)
      );
      setEnrolledCourses(enrolled);
      
      setServerStatus('online');
      setError('');
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setServerStatus('offline');
      setError('No se pudieron cargar los datos. Trabajando en modo offline.');
      
      // Load from localStorage as fallback
      const savedCourses = localStorage.getItem('courses');
      const savedEnrollments = localStorage.getItem('enrollments');
      if (savedCourses && savedEnrollments) {
        const courses = JSON.parse(savedCourses);
        const enrollments = JSON.parse(savedEnrollments);
        
        const userEnrolledCourseIds = enrollments
          .filter((enrollment: any) => enrollment.userId === user.id)
          .map((enrollment: any) => enrollment.courseId);
        
        const enrolled = courses.filter((course: Course) => 
          userEnrolledCourseIds.includes(course.id)
        );
        setEnrolledCourses(enrolled);
      }
    } finally {
      setLoading(false);
    }
  };

  // Render different sections based on activeSection
  if (activeSection === 'courses') {
    return <CourseExplorer />;
  }

  if (activeSection === 'progress') {
    return (
      <div className="p-6">
        <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl p-6 text-white mb-6">
          <h1 className="text-3xl font-bold mb-2">Mi Progreso</h1>
          <p className="text-green-100">Seguimiento detallado del progreso - Próximamente</p>
        </div>
      </div>
    );
  }

  if (activeSection === 'certificates') {
    return (
      <div className="p-6">
        <div className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl p-6 text-white mb-6">
          <h1 className="text-3xl font-bold mb-2">Mis Certificados</h1>
          <p className="text-yellow-100">Certificados obtenidos - Próximamente</p>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalEnrolledCourses = enrolledCourses.length;
  const completedCourses = enrolledCourses.filter(course => {
    const enrollment = enrollments.find(e => e.courseId === course.id && e.userId === user.id);
    return enrollment?.progress === 100;
  }).length;
  
  const totalActivities = activities.filter(activity => activity.userId === user.id).length;
  const averageScore = activities.length > 0 
    ? activities
        .filter(activity => activity.userId === user.id && activity.score !== undefined)
        .reduce((sum, activity) => sum + activity.score, 0) / 
      activities.filter(activity => activity.userId === user.id && activity.score !== undefined).length || 0
    : 0;

  const recentActivities = activities
    .filter(activity => activity.userId === user.id)
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .slice(0, 5);

  const stats = [
    { 
      label: 'Cursos Inscritos', 
      value: totalEnrolledCourses.toString(), 
      color: 'bg-blue-500',
      icon: BookOpen,
      change: '+2 este mes'
    },
    { 
      label: 'Cursos Completados', 
      value: completedCourses.toString(), 
      color: 'bg-green-500',
      icon: Trophy,
      change: `${completedCourses}/${totalEnrolledCourses} completados`
    },
    { 
      label: 'Actividades Realizadas', 
      value: totalActivities.toString(), 
      color: 'bg-purple-500',
      icon: Target,
      change: '+5 esta semana'
    },
    { 
      label: 'Puntuación Promedio', 
      value: averageScore > 0 ? averageScore.toFixed(1) : '0', 
      color: 'bg-yellow-500',
      icon: Star,
      change: 'Excelente rendimiento'
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
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">Mi Panel de Aprendizaje</h1>
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
            <span>{totalEnrolledCourses} Cursos</span>
          </div>
          <div className="flex items-center">
            <Trophy className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
            <span>{completedCourses} Completados</span>
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
            <span>{averageScore.toFixed(1)} Promedio</span>
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
          onClick={() => onSectionChange?.('courses')}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-xl text-white text-left hover:from-blue-600 hover:to-indigo-700 transition-all"
        >
          <BookOpen className="w-8 h-8 mb-3" />
          <h3 className="text-lg font-semibold mb-2">Explorar Cursos</h3>
          <p className="text-blue-100 text-sm">Descubre nuevos cursos y sigue aprendiendo</p>
        </button>

        <button
          onClick={() => onSectionChange?.('progress')}
          className="bg-gradient-to-r from-green-500 to-teal-600 p-6 rounded-xl text-white text-left hover:from-green-600 hover:to-teal-700 transition-all"
        >
          <BarChart3 className="w-8 h-8 mb-3" />
          <h3 className="text-lg font-semibold mb-2">Ver Progreso</h3>
          <p className="text-green-100 text-sm">Revisa tu avance en todos los cursos</p>
        </button>

        <button
          onClick={() => onSectionChange?.('certificates')}
          className="bg-gradient-to-r from-yellow-500 to-orange-600 p-6 rounded-xl text-white text-left hover:from-yellow-600 hover:to-orange-700 transition-all"
        >
          <Award className="w-8 h-8 mb-3" />
          <h3 className="text-lg font-semibold mb-2">Mis Certificados</h3>
          <p className="text-yellow-100 text-sm">Ve tus logros y certificados obtenidos</p>
        </button>
      </div>

      {/* My Courses & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Enrolled Courses */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-4 lg:p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg lg:text-xl font-semibold text-gray-900">Mis Cursos</h2>
              <button
                onClick={() => onSectionChange?.('courses')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
              >
                <BookOpen className="w-4 h-4" />
                Ver todos
              </button>
            </div>
          </div>
          
          <div className="p-4 lg:p-6">
            {enrolledCourses.length > 0 ? (
              <div className="space-y-4">
                {enrolledCourses.slice(0, 3).map(course => {
                  const enrollment = enrollments.find(e => e.courseId === course.id && e.userId === user.id);
                  const progress = enrollment?.progress || 0;
                  
                  return (
                    <div key={course.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{course.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          progress === 100 ? 'bg-green-100 text-green-800' : 
                          progress > 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {progress === 100 ? 'Completado' : progress > 0 ? 'En progreso' : 'No iniciado'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{course.duration}h</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4" />
                          <span>{course.rating.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Brain className="w-4 h-4" />
                          <span>{course.difficulty}</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">Progreso</span>
                          <span className="text-gray-900 font-medium">{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          ></div>
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
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                          <Play className="w-4 h-4" />
                          Continuar
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="mb-2">No estás inscrito en ningún curso</p>
                <button
                  onClick={() => onSectionChange?.('courses')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Explorar cursos disponibles →
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
            {recentActivities.length > 0 ? (
              <div className="space-y-4">
                {recentActivities.map((activity) => {
                  const course = allCourses.find(c => c.id === activity.courseId);
                  if (!course) return null;
                  
                  return (
                    <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.type === 'theory' ? 'bg-blue-100' : 'bg-purple-100'
                      }`}>
                        {activity.type === 'theory' ? (
                          <Brain className={`w-5 h-5 ${activity.type === 'theory' ? 'text-blue-600' : 'text-purple-600'}`} />
                        ) : (
                          <Zap className={`w-5 h-5 ${activity.type === 'theory' ? 'text-blue-600' : 'text-purple-600'}`} />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.type === 'theory' ? 'Completaste teoría' : 'Completaste trivia'} en {course.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {activity.score && `Puntuación: ${activity.score}% • `}
                          {new Date(activity.completedAt).toLocaleDateString('es-ES', {
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
                <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No hay actividad reciente</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Learning Progress Overview */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-4 lg:p-6 border-b">
          <h2 className="text-lg lg:text-xl font-semibold text-gray-900">Resumen de Aprendizaje</h2>
        </div>
        
        <div className="p-4 lg:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Cursos Activos</h3>
              <p className="text-2xl font-bold text-blue-600 mb-1">{totalEnrolledCourses}</p>
              <p className="text-sm text-gray-600">En tu biblioteca</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Logros</h3>
              <p className="text-2xl font-bold text-green-600 mb-1">{completedCourses}</p>
              <p className="text-sm text-gray-600">Cursos completados</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Actividades</h3>
              <p className="text-2xl font-bold text-purple-600 mb-1">{totalActivities}</p>
              <p className="text-sm text-gray-600">Completadas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
