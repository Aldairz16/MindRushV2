import React, { useState, useEffect } from 'react';
import { getCoursesByInstructor } from '../../data/demoCourses';
import { apiService, Course, User } from '../../services/api';
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  Award,
  Edit,
  BarChart3,
  Clock,
  Plus,
  Wifi,
  WifiOff,
  AlertCircle
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
  }, [activeSection, user.id]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setServerStatus('checking');
      
      // Load teacher's courses from API
      const allCourses = await apiService.getCourses();
      const teacherCourses = allCourses.filter(course => course.instructorId === user.id.toString());
      setCourses(teacherCourses);
      
      // Load students enrolled in teacher's courses
      const allUsers = await apiService.getUsers();
      const studentUsers = allUsers.filter(u => u.role === 'student');
      
      // Filter students who are enrolled in teacher's courses
      const enrolledStudents = studentUsers.filter(student => 
        student.enrolledCourses?.some(courseId => 
          teacherCourses.some(course => course.id === courseId)
        )
      );
      setStudents(enrolledStudents);
      
      // Load enrollments
      const allEnrollments = await apiService.getEnrollments();
      const teacherEnrollments = allEnrollments.filter(enrollment =>
        teacherCourses.some(course => course.id === enrollment.courseId)
      );
      setEnrollments(teacherEnrollments);
      
      setServerStatus('online');
      setError('');
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setServerStatus('offline');
      setError('No se pudieron cargar los datos. Usando datos de demostración.');
      
      // Fallback to demo data
      const demoTeacherCourses = getCoursesByInstructor(user.id);
      setCourses(demoTeacherCourses as Course[]);
      setStudents([]);
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
    return (
      <CourseCreator 
        onSave={(course) => {
          console.log('Curso creado:', course);
          loadDashboardData(); // Reload data after creating course
          onSectionChange?.('courses');
        }}
        onCancel={() => onSectionChange?.('dashboard')}
      />
    );
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

  // Show loading state
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

  // Calculate stats from real data or fallback to demo data
  const currentCourses = courses.length > 0 ? courses : getCoursesByInstructor(user.id);
  const totalStudents = students.length;
  const totalEnrollments = enrollments.length;
  
  const courseStats = [
    { 
      label: 'Cursos Activos', 
      value: currentCourses.filter(course => course.status === 'published').length.toString(), 
      color: 'bg-blue-500',
      icon: BookOpen 
    },
    { 
      label: 'Estudiantes', 
      value: totalStudents.toString(), 
      color: 'bg-green-500',
      icon: Users 
    },
    { 
      label: 'Inscripciones', 
      value: totalEnrollments.toString(), 
      color: 'bg-purple-500',
      icon: Award 
    },
    { 
      label: 'Cursos Totales', 
      value: currentCourses.length.toString(), 
      color: 'bg-yellow-500',
      icon: BarChart3 
    },
  ];

  const myCourses = currentCourses;

  const recentActivity = students.length > 0 ? 
    students.slice(0, 4).map((student, index) => ({
      message: `${student.name} está progresando en sus cursos`,
      time: `${index + 1} hour${index !== 0 ? 's' : ''} ago`,
      student: student
    })) :
    [
      { message: 'Ana García completó el módulo de Derivadas', time: '15 min ago' },
      { message: 'Nuevo comentario en el foro de Física Cuántica', time: '1 hour ago' },
      { message: 'Carlos Mendoza obtuvo certificación en Algoritmos', time: '2 hours ago' },
      { message: 'Recordatorio: Clase en vivo mañana a las 10:00 AM', time: '3 hours ago' },
    ];

  return (
    <div className="space-y-6">
      {/* Header with Server Status */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Estudio de Creación</h1>
            <p className="text-blue-100">Bienvenido, {user.name} - Crea experiencias de aprendizaje memorables</p>
          </div>
          
          {/* Server Status Indicator */}
          <div className={`flex items-center px-3 py-2 rounded-full ${
            serverStatus === 'online' ? 'bg-green-100 text-green-800' : 
            serverStatus === 'offline' ? 'bg-yellow-100 text-yellow-800' : 
            'bg-gray-100 text-gray-800'
          }`}>
            {serverStatus === 'online' ? (
              <><Wifi className="w-4 h-4 mr-2" /> En línea</>
            ) : serverStatus === 'offline' ? (
              <><WifiOff className="w-4 h-4 mr-2" /> Sin conexión</>
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {courseStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-full`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Courses */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Mis Cursos</h2>
            <button 
              onClick={() => onSectionChange?.('create-course')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
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
                  <button 
                    onClick={() => onSectionChange?.('courses')}
                    className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </button>
                  <button 
                    onClick={() => onSectionChange?.('analytics')}
                    className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 px-3 py-2 rounded-lg flex items-center justify-center transition-colors"
                  >
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Actividad Reciente</h2>
            <button 
              onClick={() => onSectionChange?.('students')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Ver todos
            </button>
          </div>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                   onClick={() => onSectionChange?.('students')}>
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
            onClick={() => onSectionChange?.('create-course')}
            className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <Plus className="w-8 h-8 text-blue-600 mb-2 mx-auto" />
            <div className="font-semibold text-blue-800">Crear Nuevo Curso</div>
          </button>
          <button 
            onClick={() => onSectionChange?.('courses')}
            className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
          >
            <Award className="w-8 h-8 text-green-600 mb-2 mx-auto" />
            <div className="font-semibold text-green-800">Gestionar Cursos</div>
          </button>
          <button 
            onClick={() => onSectionChange?.('analytics')}
            className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
          >
            <BarChart3 className="w-8 h-8 text-purple-600 mb-2 mx-auto" />
            <div className="font-semibold text-purple-800">Analytics Pedagógicos</div>
          </button>
          <button 
            onClick={() => onSectionChange?.('students')}
            className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors"
          >
            <Users className="w-8 h-8 text-yellow-600 mb-2 mx-auto" />
            <div className="font-semibold text-yellow-800">Gestionar Estudiantes</div>
          </button>
        </div>
      </div>
    </div>
  );
};