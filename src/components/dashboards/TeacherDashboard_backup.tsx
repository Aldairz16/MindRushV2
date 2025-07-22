import React from 'react';
import { demoCourses, getCoursesByInstructor } from '../../data/demoCourses';
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  Award,
  Play,
  Edit,
  BarChart3,
  Clock
} from 'lucide-react';
import { CourseManager } from '../teacher/CourseManager';
import { CourseCreator } from '../teacher/CourseCreator';
import { StudentManager } from '../teacher/StudentManager';

interface TeacherDashboardProps {
  user: any;
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ user, activeSection = 'dashboard', onSectionChange }) => {

  // Render different sections based on activeSection
  if (activeSection === 'courses') {
    return <CourseManager />;
  }

  if (activeSection === 'create-course') {
    return <CourseCreator />;
  }

  if (activeSection === 'students') {
    return <StudentManager />;
  }

  if (activeSection === 'analytics') {
    return (
      <div className="p-6">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white mb-6">
          <h1 className="text-3xl font-bold mb-2">Analíticas</h1>
          <p className="text-blue-100">Próximamente - Dashboard de analíticas avanzadas</p>
        </div>
      </div>
    );
  }

  if (activeSection === 'assignments') {
    return (
      <div className="p-6">
        <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl p-6 text-white mb-6">
          <h1 className="text-3xl font-bold mb-2">Gestión de Tareas</h1>
          <p className="text-green-100">Próximamente - Sistema de tareas y evaluaciones</p>
        </div>
      </div>
    );
  }

  if (activeSection === 'creator') {
    return (
      <div className="p-6">
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 text-white mb-6">
          <h1 className="text-3xl font-bold mb-2">Creador de Rutas de Aprendizaje</h1>
          <p className="text-purple-100">Próximamente - Herramienta avanzada de creación</p>
        </div>
      </div>
    );
  }

  if (activeSection === 'analytics') {
    return (
      <div className="p-6">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white mb-6">
          <h1 className="text-3xl font-bold mb-2">Analíticas Avanzadas</h1>
          <p className="text-blue-100">Próximamente - Dashboard de analíticas detalladas</p>
        </div>
      </div>
    );
  }

  if (activeSection === 'resources') {
    return (
      <div className="p-6">
        <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl p-6 text-white mb-6">
          <h1 className="text-3xl font-bold mb-2">Biblioteca de Recursos</h1>
          <p className="text-green-100">Próximamente - Gestión centralizada de recursos</p>
        </div>
      </div>
    );
  }

  // Default dashboard view
  const courseStats = [
    { label: 'Cursos Activos', value: getCoursesByInstructor(user.id).length.toString(), color: 'bg-blue-500' },
    { label: 'Estudiantes', value: getCoursesByInstructor(user.id).reduce((total, course) => total + course.studentsEnrolled, 0).toString(), color: 'bg-green-500' },
    { label: 'Engagement', value: '92%', color: 'bg-purple-500' },
    { label: 'Certificaciones', value: '45', color: 'bg-yellow-500' },
  ];

  const myCourses = getCoursesByInstructor(user.id);

  const recentActivity = [
    { message: 'Ana García completó el módulo de Derivadas', time: '15 min ago' },
    { message: 'Nuevo comentario en el foro de Física Cuántica', time: '1 hour ago' },
    { message: 'Carlos Mendoza obtuvo certificación en Algoritmos', time: '2 hours ago' },
    { message: 'Recordatorio: Clase en vivo mañana a las 10:00 AM', time: '3 hours ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl">
        <h1 className="text-3xl font-bold mb-2">Estudio de Creación</h1>
        <p className="text-blue-100">Bienvenido, {user.name} - Crea experiencias de aprendizaje memorables</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {courseStats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-full`}>
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Courses */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Mis Cursos</h2>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
              <Play className="w-4 h-4 mr-2" />
              Crear Curso
            </button>
          </div>
          
          <div className="space-y-4">
            {myCourses.map((course) => (
              <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800">{course.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    course.status === 'published' ? 'bg-green-100 text-green-800' :
                    course.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {course.status === 'published' ? 'Publicado' : 
                     course.status === 'draft' ? 'Borrador' : 'Archivado'}
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {course.studentsEnrolled} estudiantes
                  </div>
                  <div className="flex items-center">
                    <BarChart3 className="w-4 h-4 mr-1" />
                    {course.completionRate}% completado
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {course.updatedAt}
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${course.completionRate}%` }}
                  />
                </div>
                
                <div className="flex space-x-2">
                  <button className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg flex items-center justify-center">
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </button>
                  <button className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 px-3 py-2 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Ver Analytics
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Actividad Reciente</h2>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                <div className="bg-blue-100 p-2 rounded-full">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tools and Features */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Herramientas de Creación</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={() => onSectionChange && onSectionChange('creator')}
            className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <BookOpen className="w-8 h-8 text-blue-600 mb-2" />
            <div className="font-semibold text-blue-800">Constructor de Rutas</div>
          </button>
          <button 
            onClick={() => onSectionChange && onSectionChange('courses')}
            className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
          >
            <Award className="w-8 h-8 text-green-600 mb-2" />
            <div className="font-semibold text-green-800">Gestionar Cursos</div>
          </button>
          <button 
            onClick={() => onSectionChange && onSectionChange('analytics')}
            className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
          >
            <BarChart3 className="w-8 h-8 text-purple-600 mb-2" />
            <div className="font-semibold text-purple-800">Analytics Pedagógicos</div>
          </button>
          <button 
            onClick={() => onSectionChange && onSectionChange('resources')}
            className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors"
          >
            <Play className="w-8 h-8 text-yellow-600 mb-2" />
            <div className="font-semibold text-yellow-800">Biblioteca de Recursos</div>
          </button>
        </div>
      </div>
    </div>
  );
};