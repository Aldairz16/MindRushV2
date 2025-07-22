import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical,
  Mail,
  Award,
  TrendingUp,
  Clock,
  BookOpen,
  Star
} from 'lucide-react';

export const StudentManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const students = [
    {
      id: 1,
      name: 'Ana García',
      email: 'ana.garcia@email.com',
      avatar: 'AG',
      coursesEnrolled: 5,
      coursesCompleted: 3,
      totalXP: 1250,
      level: 3,
      lastActivity: '2025-07-20',
      averageScore: 92,
      status: 'active'
    },
    {
      id: 2,
      name: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@email.com',
      avatar: 'CR',
      coursesEnrolled: 3,
      coursesCompleted: 2,
      totalXP: 850,
      level: 2,
      lastActivity: '2025-07-19',
      averageScore: 88,
      status: 'active'
    },
    {
      id: 3,
      name: 'María López',
      email: 'maria.lopez@email.com',
      avatar: 'ML',
      coursesEnrolled: 4,
      coursesCompleted: 4,
      totalXP: 1800,
      level: 4,
      lastActivity: '2025-07-18',
      averageScore: 95,
      status: 'active'
    },
    {
      id: 4,
      name: 'Pedro Martínez',
      email: 'pedro.martinez@email.com',
      avatar: 'PM',
      coursesEnrolled: 2,
      coursesCompleted: 0,
      totalXP: 120,
      level: 1,
      lastActivity: '2025-07-15',
      averageScore: 75,
      status: 'inactive'
    }
  ];

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'active') return matchesSearch && student.status === 'active';
    if (selectedFilter === 'inactive') return matchesSearch && student.status === 'inactive';
    if (selectedFilter === 'high-performers') return matchesSearch && student.averageScore >= 90;
    
    return matchesSearch;
  });

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl lg:text-3xl font-bold mb-2">Gestión de Estudiantes</h1>
        <p className="text-green-100">Supervisa el progreso y rendimiento de tus estudiantes</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-green-500" />
            <span className="text-2xl font-bold text-gray-800">{students.length}</span>
          </div>
          <p className="text-sm text-gray-600">Total Estudiantes</p>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold text-gray-800">
              {students.filter(s => s.status === 'active').length}
            </span>
          </div>
          <p className="text-sm text-gray-600">Estudiantes Activos</p>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <Star className="w-8 h-8 text-yellow-500" />
            <span className="text-2xl font-bold text-gray-800">
              {Math.round(students.reduce((sum, s) => sum + s.averageScore, 0) / students.length)}%
            </span>
          </div>
          <p className="text-sm text-gray-600">Promedio General</p>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <Award className="w-8 h-8 text-purple-500" />
            <span className="text-2xl font-bold text-gray-800">
              {students.filter(s => s.averageScore >= 90).length}
            </span>
          </div>
          <p className="text-sm text-gray-600">Alto Rendimiento</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1 lg:mr-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar estudiantes por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos los estudiantes</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
                <option value="high-performers">Alto rendimiento</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Students List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Lista de Estudiantes ({filteredStudents.length})
          </h3>
          
          <div className="space-y-4">
            {filteredStudents.map((student) => (
              <div key={student.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {student.avatar}
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-gray-800">{student.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                          {student.status === 'active' ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        {student.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    {/* Stats */}
                    <div className="hidden lg:grid lg:grid-cols-4 gap-6 text-center">
                      <div>
                        <div className="text-sm font-semibold text-gray-800">{student.coursesCompleted}/{student.coursesEnrolled}</div>
                        <div className="text-xs text-gray-600">Cursos</div>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-800">Nivel {student.level}</div>
                        <div className="text-xs text-gray-600">{student.totalXP} XP</div>
                      </div>
                      <div>
                        <div className={`text-sm font-semibold ${getPerformanceColor(student.averageScore)}`}>
                          {student.averageScore}%
                        </div>
                        <div className="text-xs text-gray-600">Promedio</div>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-800">
                          {new Date(student.lastActivity).toLocaleDateString('es-ES', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </div>
                        <div className="text-xs text-gray-600">Última actividad</div>
                      </div>
                    </div>

                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Mobile Stats */}
                <div className="lg:hidden mt-4 grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-600">
                      {student.coursesCompleted}/{student.coursesEnrolled} cursos
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4 text-purple-500" />
                    <span className="text-sm text-gray-600">
                      Nivel {student.level} ({student.totalXP} XP)
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className={`text-sm font-medium ${getPerformanceColor(student.averageScore)}`}>
                      {student.averageScore}% promedio
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {new Date(student.lastActivity).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
