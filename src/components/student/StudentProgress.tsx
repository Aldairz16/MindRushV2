import React from 'react';
import { 
  TrendingUp, 
  Award, 
  Target, 
  Calendar,
  BarChart3,
  Star,
  Clock,
  BookOpen
} from 'lucide-react';

export const StudentProgress: React.FC = () => {
  const progressData = {
    completedCourses: 8,
    activeCourses: 3,
    totalXP: 1250,
    currentLevel: 3,
    streak: 7,
    averageScore: 92,
    studyTime: 45, // horas
    achievements: 12
  };

  const recentActivity = [
    { 
      course: 'JavaScript Básico', 
      activity: 'Completó Módulo 3', 
      score: 95, 
      date: '2025-07-20',
      xp: 50
    },
    { 
      course: 'HTML/CSS Avanzado', 
      activity: 'Quiz Final', 
      score: 88, 
      date: '2025-07-19',
      xp: 75
    },
    { 
      course: 'React Fundamentals', 
      activity: 'Proyecto Práctico', 
      score: 100, 
      date: '2025-07-18',
      xp: 100
    }
  ];

  const weeklyProgress = [
    { day: 'Lun', xp: 120 },
    { day: 'Mar', xp: 80 },
    { day: 'Mié', xp: 150 },
    { day: 'Jue', xp: 90 },
    { day: 'Vie', xp: 200 },
    { day: 'Sáb', xp: 60 },
    { day: 'Dom', xp: 100 }
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl lg:text-3xl font-bold mb-2">Mi Progreso de Aprendizaje</h1>
        <p className="text-blue-100">Seguimiento detallado de tu evolución académica</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <BookOpen className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold text-gray-800">{progressData.completedCourses}</span>
          </div>
          <p className="text-sm text-gray-600">Cursos Completados</p>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-8 h-8 text-green-500" />
            <span className="text-2xl font-bold text-gray-800">{progressData.activeCourses}</span>
          </div>
          <p className="text-sm text-gray-600">Cursos Activos</p>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <Star className="w-8 h-8 text-yellow-500" />
            <span className="text-2xl font-bold text-gray-800">{progressData.totalXP}</span>
          </div>
          <p className="text-sm text-gray-600">XP Total</p>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <Award className="w-8 h-8 text-purple-500" />
            <span className="text-2xl font-bold text-gray-800">{progressData.achievements}</span>
          </div>
          <p className="text-sm text-gray-600">Logros</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Progreso Semanal */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
            XP Esta Semana
          </h3>
          <div className="space-y-3">
            {weeklyProgress.map((day, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 w-12">{day.day}</span>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(day.xp / 200) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-800 w-12 text-right">{day.xp}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actividad Reciente */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-green-500" />
            Actividad Reciente
          </h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">{activity.course}</p>
                  <p className="text-xs text-gray-600">{activity.activity}</p>
                  <div className="flex items-center mt-1 space-x-2">
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      {activity.score}%
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      +{activity.xp} XP
                    </span>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(activity.date).toLocaleDateString('es-ES', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Estadísticas Generales */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-purple-500" />
          Estadísticas Generales
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{progressData.averageScore}%</div>
            <div className="text-sm text-blue-700">Promedio General</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{progressData.streak}</div>
            <div className="text-sm text-green-700">Días Consecutivos</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{progressData.studyTime}h</div>
            <div className="text-sm text-purple-700">Tiempo Total</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">Nivel {progressData.currentLevel}</div>
            <div className="text-sm text-yellow-700">Nivel Actual</div>
          </div>
        </div>
      </div>
    </div>
  );
};
