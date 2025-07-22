import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Award, 
  Target, 
  Calendar,
  BarChart3,
  Star,
  Clock,
  BookOpen,
  Zap,
  Trophy,
  Flame,
  CheckCircle,
  Activity,
  User,
  Globe
} from 'lucide-react';
import { apiService, User as UserType, Course, Activity as ActivityType } from '../../services/api';

interface StudentProgressProps {
  user: UserType;
}

interface ProgressData {
  completedCourses: number;
  activeCourses: number;
  totalXP: number;
  currentLevel: number;
  streak: number;
  averageScore: number;
  studyTime: number;
  achievements: number;
  certificatesEarned: number;
}

interface RecentActivityData {
  id: string;
  course: string;
  activity: string;
  score: number;
  date: string;
  xp: number;
  type: string;
  moduleId?: string;
}

interface WeeklyProgressData {
  day: string;
  xp: number;
  activities: number;
}

export const StudentProgress: React.FC<StudentProgressProps> = ({ user }) => {
  const [progressData, setProgressData] = useState<ProgressData>({
    completedCourses: 0,
    activeCourses: 0,
    totalXP: 0,
    currentLevel: 0,
    streak: 0,
    averageScore: 0,
    studyTime: 0,
    achievements: 0,
    certificatesEarned: 0
  });
  
  const [recentActivity, setRecentActivity] = useState<RecentActivityData[]>([]);
  const [weeklyProgress, setWeeklyProgress] = useState<WeeklyProgressData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);

  useEffect(() => {
    loadProgressData();
  }, [user.id]);

  const loadProgressData = async () => {
    try {
      setLoading(true);
      setError('');

      // Load user's activities
      const activities = await apiService.getActivities();
      const userActivities = activities.filter(activity => activity.userId.toString() === user.id.toString());

      // Load all courses to get course names
      const allCourses = await apiService.getCourses();
      const coursesMap = new Map(allCourses.map(course => [course.id, course]));

      // Load enrolled courses
      const enrolled = allCourses.filter(course => 
        user.enrolledCourses?.includes(course.id)
      );
      setEnrolledCourses(enrolled);

      // Calculate progress data from user stats and activities
      const calculatedProgress: ProgressData = {
        completedCourses: user.stats?.coursesCompleted || user.completedCourses?.length || 0,
        activeCourses: user.stats?.coursesEnrolled || user.enrolledCourses?.length || 0,
        totalXP: user.stats?.totalXP || 0,
        currentLevel: user.stats?.currentLevel || 1,
        streak: user.stats?.studyStreak || 0,
        averageScore: user.stats?.averageScore || 0,
        studyTime: user.stats?.totalStudyHours || 0,
        achievements: calculateAchievements(user.stats),
        certificatesEarned: user.stats?.certificatesEarned || 0
      };
      setProgressData(calculatedProgress);

      // Process recent activities
      const processedActivities = userActivities
        .sort((a, b) => new Date(b.completedAt || b.timestamp).getTime() - new Date(a.completedAt || a.timestamp).getTime())
        .slice(0, 10)
        .map(activity => {
          const course = coursesMap.get(activity.courseId);
          return {
            id: activity.id,
            course: course?.title || activity.courseId,
            activity: getActivityDescription(activity),
            score: activity.score || 0,
            date: formatDate(activity.completedAt || activity.timestamp),
            xp: calculateXPFromActivity(activity),
            type: activity.type,
            moduleId: activity.data?.moduleId
          };
        });
      setRecentActivity(processedActivities);

      // Calculate weekly progress
      const weeklyData = calculateWeeklyProgress(userActivities);
      setWeeklyProgress(weeklyData);

    } catch (err) {
      console.error('Error loading progress data:', err);
      setError('No se pudieron cargar los datos de progreso');
      
      // Use fallback data from user stats
      setProgressData({
        completedCourses: user.stats?.coursesCompleted || 0,
        activeCourses: user.stats?.coursesEnrolled || 0,
        totalXP: user.stats?.totalXP || 0,
        currentLevel: user.stats?.currentLevel || 1,
        streak: user.stats?.studyStreak || 0,
        averageScore: user.stats?.averageScore || 0,
        studyTime: user.stats?.totalStudyHours || 0,
        achievements: calculateAchievements(user.stats),
        certificatesEarned: user.stats?.certificatesEarned || 0
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateAchievements = (stats: any): number => {
    if (!stats) return 0;
    let achievements = 0;
    
    // Achievement for completing courses
    if (stats.coursesCompleted >= 1) achievements++;
    if (stats.coursesCompleted >= 5) achievements++;
    if (stats.coursesCompleted >= 10) achievements++;
    
    // Achievement for XP
    if (stats.totalXP >= 500) achievements++;
    if (stats.totalXP >= 1000) achievements++;
    if (stats.totalXP >= 2000) achievements++;
    
    // Achievement for streak
    if (stats.studyStreak >= 7) achievements++;
    if (stats.studyStreak >= 30) achievements++;
    
    // Achievement for average score
    if (stats.averageScore >= 90) achievements++;
    
    return achievements;
  };

  const getActivityDescription = (activity: any): string => {
    switch (activity.type) {
      case 'trivia':
        return `Quiz completado`;
      case 'progress':
        return `Módulo completado`;
      case 'lesson':
        return `Lección completada`;
      case 'project':
        return `Proyecto enviado`;
      default:
        return `Actividad completada`;
    }
  };

  const calculateXPFromActivity = (activity: any): number => {
    const baseXP = {
      'trivia': 50,
      'progress': 25,
      'lesson': 30,
      'project': 100
    };
    
    const base = baseXP[activity.type as keyof typeof baseXP] || 25;
    const scoreMultiplier = (activity.score || 0) / 100;
    return Math.round(base * (0.5 + scoreMultiplier * 0.5));
  };

  const calculateWeeklyProgress = (activities: any[]): WeeklyProgressData[] => {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const weekData = days.map(day => ({ day, xp: 0, activities: 0 }));
    
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    
    activities.forEach(activity => {
      const activityDate = new Date(activity.completedAt || activity.timestamp);
      const daysDiff = Math.floor((activityDate.getTime() - startOfWeek.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff >= 0 && daysDiff < 7) {
        weekData[daysDiff].xp += calculateXPFromActivity(activity);
        weekData[daysDiff].activities += 1;
      }
    });
    
    return weekData;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Ayer';
    if (diffDays === 0) return 'Hoy';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return date.toLocaleDateString('es-ES');
  };

  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeColor = (score: number): string => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 80) return 'bg-blue-100 text-blue-800';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Cargando tu progreso...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mi Progreso</h1>
              <p className="text-gray-600 mt-1">Seguimiento de tu aprendizaje, {user.name}</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center px-3 py-2 bg-blue-100 text-blue-800 rounded-full text-sm">
                <Zap className="w-4 h-4 mr-2" />
                Nivel {progressData.currentLevel}
              </div>
            </div>
          </div>
          
          {error && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total XP */}
          <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-200">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-500 bg-opacity-10 rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">XP Total</h3>
                  <p className="text-3xl font-bold text-blue-600">{progressData.totalXP.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Completed Courses */}
          <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-200">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-500 bg-opacity-10 rounded-xl flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Cursos Completados</h3>
                  <p className="text-3xl font-bold text-green-600">{progressData.completedCourses}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Study Streak */}
          <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-200">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-orange-500 bg-opacity-10 rounded-xl flex items-center justify-center">
                    <Flame className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Racha de Estudio</h3>
                  <p className="text-3xl font-bold text-orange-600">{progressData.streak} días</p>
                </div>
              </div>
            </div>
          </div>

          {/* Average Score */}
          <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-200">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-500 bg-opacity-10 rounded-xl flex items-center justify-center">
                    <Star className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Promedio</h3>
                  <p className="text-3xl font-bold text-purple-600">{progressData.averageScore}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Cursos Activos</p>
                <p className="text-xl font-bold text-gray-900">{progressData.activeCourses}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Horas de Estudio</p>
                <p className="text-xl font-bold text-gray-900">{progressData.studyTime}h</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center">
              <Award className="w-8 h-8 text-yellow-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Logros</p>
                <p className="text-xl font-bold text-gray-900">{progressData.achievements}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Certificados</p>
                <p className="text-xl font-bold text-gray-900">{progressData.certificatesEarned}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white shadow-lg rounded-xl border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Actividad Reciente
              </h2>
            </div>
            <div className="p-6">
              {recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{activity.course}</h4>
                          <p className="text-gray-600 text-sm">{activity.activity}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span>{activity.date}</span>
                            <span className="flex items-center">
                              <Zap className="w-3 h-3 mr-1" />
                              +{activity.xp} XP
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreBadgeColor(activity.score)}`}>
                            {activity.score}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Sin actividad reciente</h3>
                  <p className="text-gray-500">Comienza un curso para ver tu actividad aquí</p>
                </div>
              )}
            </div>
          </div>

          {/* Weekly Progress Chart */}
          <div className="bg-white shadow-lg rounded-xl border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Progreso Semanal
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {weeklyProgress.map((day, index) => {
                  const maxXP = Math.max(...weeklyProgress.map(d => d.xp), 1);
                  const percentage = (day.xp / maxXP) * 100;
                  
                  return (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="w-8 text-sm font-medium text-gray-600">{day.day}</div>
                      <div className="flex-1">
                        <div className="bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-sm font-medium text-gray-900 w-16 text-right">
                        {day.xp} XP
                      </div>
                      <div className="text-xs text-gray-500 w-12 text-right">
                        {day.activities} act.
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Resumen de la Semana</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-600">XP Total:</span>
                    <span className="font-semibold ml-2">{weeklyProgress.reduce((sum, day) => sum + day.xp, 0)}</span>
                  </div>
                  <div>
                    <span className="text-blue-600">Actividades:</span>
                    <span className="font-semibold ml-2">{weeklyProgress.reduce((sum, day) => sum + day.activities, 0)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Progress Section */}
        <div className="mt-8">
          <div className="bg-white shadow-lg rounded-xl border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Progreso en Cursos
              </h2>
            </div>
            <div className="p-6">
              {enrolledCourses.length > 0 ? (
                <div className="space-y-6">
                  {enrolledCourses.map((course) => {
                    const courseProgress = user.progress?.[course.id];
                    const progress = courseProgress?.progress || 0;
                    
                    return (
                      <div key={course.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">{course.title}</h4>
                            <p className="text-gray-600 text-sm">{course.description}</p>
                          </div>
                          <span className="text-2xl font-bold text-blue-600">{progress}%</span>
                        </div>
                        
                        <div className="mb-3">
                          <div className="bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Módulos:</span>
                            <span className="font-semibold ml-2">
                              {courseProgress?.completedModules?.length || 0}/{course.modules?.length || 0}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">XP Ganado:</span>
                            <span className="font-semibold ml-2">{courseProgress?.xp || 0}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Tiempo:</span>
                            <span className="font-semibold ml-2">{courseProgress?.timeSpent || 0}h</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Última actividad:</span>
                            <span className="font-semibold ml-2">
                              {courseProgress?.lastActivity ? formatDate(courseProgress.lastActivity) : 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No estás inscrito en ningún curso</h3>
                  <p className="text-gray-500">Explora nuestro catálogo y comienza tu aprendizaje</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
