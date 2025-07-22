import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Trophy, 
  Star, 
  Play,
  Users,
  Clock,
  Zap,
  Award,
  Wifi,
  WifiOff,
  AlertCircle,
  TrendingUp,
  Target
} from 'lucide-react';
import { CourseExplorer } from '../student/CourseExplorer';
import { StudentProgress } from '../student/StudentProgress';
import { apiService, Course, User } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

interface StudentDashboardProps {
  user: User;
  activeSection?: string;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, activeSection = 'dashboard' }) => {
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [serverStatus, setServerStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const { updateUserProgress } = useAuth();

  useEffect(() => {
    loadDashboardData();
  }, [user.id]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setServerStatus('checking');
      
      // Load all courses
      const courses = await apiService.getCourses();
      setAllCourses(courses);
      
      // Filter enrolled courses
      const enrolled = courses.filter(course => 
        user.enrolledCourses?.includes(course.id) || 
        course.status === 'published' // Show all published courses for demo
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
      if (savedCourses) {
        const courses = JSON.parse(savedCourses);
        setAllCourses(courses);
        setEnrolledCourses(courses.filter((course: Course) => course.status === 'published'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollCourse = async (courseId: string) => {
    try {
      if (serverStatus === 'online') {
        await apiService.enrollUser(user.id, courseId);
        
        // Update user's enrolled courses locally
        const updatedUser = {
          ...user,
          enrolledCourses: [...(user.enrolledCourses || []), courseId]
        };
        updateUserProgress(updatedUser);
        
        // Refresh enrolled courses
        const course = allCourses.find(c => c.id === courseId);
        if (course) {
          setEnrolledCourses(prev => [...prev, course]);
        }
      } else {
        // Local enrollment fallback
        const updatedUser = {
          ...user,
          enrolledCourses: [...(user.enrolledCourses || []), courseId]
        };
        updateUserProgress(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        const course = allCourses.find(c => c.id === courseId);
        if (course) {
          setEnrolledCourses(prev => [...prev, course]);
        }
      }
    } catch (err) {
      console.error('Error enrolling in course:', err);
      setError('Error al inscribirse al curso');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Render different sections based on activeSection
  if (activeSection === 'courses') {
    return <CourseExplorer onEnroll={handleEnrollCourse} />;
  }

  if (activeSection === 'progress') {
    return <StudentProgress enrolledCourses={enrolledCourses} />;
  }

  // Calculate stats from user data
  const completedModules = user.progress?.completedModules?.length || 0;
  const totalXP = user.progress?.xp || 0;
  const currentLevel = Math.floor(totalXP / 100) + 1;
  const streakDays = user.stats?.streakDays || 0;

  const progressStats = [
    { label: 'Módulos Completados', value: completedModules.toString(), color: 'bg-green-500', icon: BookOpen },
    { label: 'Cursos Inscritos', value: enrolledCourses.length.toString(), color: 'bg-blue-500', icon: Users },
    { label: 'XP Total', value: totalXP.toString(), color: 'bg-purple-500', icon: Star },
    { label: 'Racha Actual', value: `${streakDays} días`, color: 'bg-yellow-500', icon: Trophy },
  ];

  const getDifficultyColor = (difficulty: string) => {
    const colors: { [key: string]: string } = {
      'Principiante': 'bg-green-100 text-green-800',
      'Intermedio': 'bg-yellow-100 text-yellow-800',
      'Avanzado': 'bg-red-100 text-red-800'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

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
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 lg:p-6 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">Panel de Estudiante</h1>
            <p className="text-green-100 text-sm lg:text-base">¡Bienvenido, {user.name}! Continúa tu aprendizaje</p>
          </div>
          
          {/* Server Status Indicator */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-600">
            {serverStatus === 'online' && (
              <>
                <Wifi className="w-4 h-4 text-green-200" />
                <span className="text-sm text-green-100">Sincronizado</span>
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
                <div className="w-4 h-4 border-2 border-green-200 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-green-100">Conectando...</span>
              </>
            )}
          </div>
        </div>
        
        <div className="mt-4 flex items-center space-x-4 lg:space-x-6">
          <div className="flex items-center">
            <Zap className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
            <span className="text-sm lg:text-base">Nivel {currentLevel}</span>
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
            <span className="text-sm lg:text-base">{totalXP} XP</span>
          </div>
          <div className="flex items-center">
            <Trophy className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
            <span className="text-sm lg:text-base">{user.stats?.achievements || 0} Logros</span>
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
        {progressStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-2">
                <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-gray-500" />
                <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
              </div>
              <div className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-xs lg:text-sm text-gray-600">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Recent Courses */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-4 lg:p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg lg:text-xl font-semibold text-gray-900">Mis Cursos</h2>
            <span className="text-sm text-gray-500">{enrolledCourses.length} cursos</span>
          </div>
        </div>
        
        <div className="p-4 lg:p-6">
          {enrolledCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {enrolledCourses.slice(0, 4).map(course => (
                <div key={course.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">{course.title}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{course.description}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{course.instructor}</span>
                        <span>•</span>
                        <span>{course.duration}h</span>
                        <span>•</span>
                        <span className={`px-2 py-1 rounded-full ${getDifficultyColor(course.difficulty)}`}>
                          {course.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Progreso</span>
                      <span className="font-medium">{Math.floor(Math.random() * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${Math.floor(Math.random() * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        <span>{course.rating.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{course.studentsEnrolled}</span>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                      <Play className="w-4 h-4" />
                      Continuar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes cursos inscritos</h3>
              <p className="text-gray-600 mb-4">Explora nuestro catálogo y comienza tu aprendizaje</p>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                Explorar Cursos
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-xl text-white">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-6 h-6" />
            <h3 className="text-lg font-semibold">Objetivo Diario</h3>
          </div>
          <p className="text-blue-100 mb-4">Completa al menos 1 módulo hoy</p>
          <div className="flex items-center justify-between">
            <span className="text-sm">Progreso: {completedModules > 0 ? '✅' : '⏳'}</span>
            <button className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50">
              {completedModules > 0 ? 'Completado' : 'Comenzar'}
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-teal-600 p-6 rounded-xl text-white">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6" />
            <h3 className="text-lg font-semibold">Racha de Estudio</h3>
          </div>
          <p className="text-green-100 mb-4">¡Mantén tu racha activa!</p>
          <div className="flex items-center justify-between">
            <span className="text-sm">{streakDays} días consecutivos</span>
            <div className="flex items-center gap-1">
              {[...Array(Math.min(streakDays, 5))].map((_, i) => (
                <div key={i} className="w-2 h-2 bg-yellow-300 rounded-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
