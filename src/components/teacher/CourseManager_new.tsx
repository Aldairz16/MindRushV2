import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  Edit3, 
  Users, 
  BarChart3,
  Star,
  Calendar,
  Settings,
  Play,
  Pause,
  FileText,
  HelpCircle,
  CheckCircle,
  X,
  Wifi,
  WifiOff,
  AlertCircle
} from 'lucide-react';
import { apiService, Course } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { ModuleContentEditor } from './ModuleContentEditor';
import { CourseCreator } from './CourseCreator';

interface CourseModule {
  id: string;
  title: string;
  content: {
    type: 'theory' | 'trivia';
    data: any;
  };
}

export const CourseManager: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('published');
  const [editingModule, setEditingModule] = useState<CourseModule | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [serverStatus, setServerStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  
  const { user } = useAuth();

  // Check server status and load courses
  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setServerStatus('checking');
      
      const coursesData = await apiService.getCourses();
      setCourses(coursesData);
      setServerStatus('online');
      setError('');
    } catch (err) {
      console.error('Error loading courses:', err);
      setServerStatus('offline');
      setError('No se pudieron cargar los cursos. Trabajando en modo offline.');
      // Load from localStorage as fallback
      const savedCourses = localStorage.getItem('courses');
      if (savedCourses) {
        setCourses(JSON.parse(savedCourses));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditModule = (module: CourseModule) => {
    setEditingModule(module);
  };

  const handleSaveModule = async (updatedModule: CourseModule) => {
    try {
      // Update the course with the new module data
      if (selectedCourse) {
        const updatedCourse = {
          ...selectedCourse,
          modules: selectedCourse.modules.map(module => 
            module.id === updatedModule.id ? updatedModule : module
          )
        };

        if (serverStatus === 'online') {
          await apiService.updateCourse(updatedCourse.id, updatedCourse);
        } else {
          // Save to localStorage as fallback
          const savedCourses = JSON.parse(localStorage.getItem('courses') || '[]');
          const updatedCourses = savedCourses.map((course: Course) => 
            course.id === updatedCourse.id ? updatedCourse : course
          );
          localStorage.setItem('courses', JSON.stringify(updatedCourses));
        }

        setSelectedCourse(updatedCourse);
        setCourses(prev => prev.map(course => 
          course.id === updatedCourse.id ? updatedCourse : course
        ));
      }
      setEditingModule(null);
      setSuccessMessage('Módulo actualizado exitosamente');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error updating module:', err);
      setError('Error al actualizar el módulo');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleCancelEdit = () => {
    setEditingModule(null);
  };

  const handleCreateCourse = () => {
    setIsCreatingCourse(true);
  };

  const handleSaveCourse = async (courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      let newCourse: Course;

      if (serverStatus === 'online') {
        newCourse = await apiService.createCourse({
          ...courseData,
          teacherId: user?.id || '1',
          enrolledStudents: 0,
          averageRating: 0,
          status: 'draft'
        });
      } else {
        // Create course locally as fallback
        newCourse = {
          ...courseData,
          id: Date.now().toString(),
          teacherId: user?.id || '1',
          enrolledStudents: 0,
          averageRating: 0,
          status: 'draft',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        const savedCourses = JSON.parse(localStorage.getItem('courses') || '[]');
        savedCourses.push(newCourse);
        localStorage.setItem('courses', JSON.stringify(savedCourses));
      }

      setCourses(prev => [...prev, newCourse]);
      setIsCreatingCourse(false);
      setSuccessMessage(`Curso "${newCourse.title}" creado exitosamente`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error creating course:', err);
      setError('Error al crear el curso');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleCancelCreate = () => {
    setIsCreatingCourse(false);
  };

  const handleUpdateCourseStatus = async (courseId: string, status: 'published' | 'draft' | 'archived') => {
    try {
      const courseToUpdate = courses.find(c => c.id === courseId);
      if (!courseToUpdate) return;

      const updatedCourse = { ...courseToUpdate, status };

      if (serverStatus === 'online') {
        await apiService.updateCourse(courseId, updatedCourse);
      } else {
        const savedCourses = JSON.parse(localStorage.getItem('courses') || '[]');
        const updatedCourses = savedCourses.map((course: Course) => 
          course.id === courseId ? updatedCourse : course
        );
        localStorage.setItem('courses', JSON.stringify(updatedCourses));
      }

      setCourses(prev => prev.map(course => 
        course.id === courseId ? updatedCourse : course
      ));

      setSuccessMessage(`Curso ${status === 'published' ? 'publicado' : status === 'draft' ? 'guardado como borrador' : 'archivado'} exitosamente`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error updating course status:', err);
      setError('Error al actualizar el estado del curso');
      setTimeout(() => setError(''), 3000);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'published': 'bg-green-100 text-green-800',
      'draft': 'bg-yellow-100 text-yellow-800',
      'archived': 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      'Principiante': 'bg-blue-100 text-blue-800',
      'Intermedio': 'bg-orange-100 text-orange-800',
      'Avanzado': 'bg-red-100 text-red-800'
    };
    return colors[difficulty as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const filteredCourses = courses.filter(course => {
    if (selectedTab === 'published') return course.status === 'published';
    if (selectedTab === 'draft') return course.status === 'draft';
    return true;
  });

  // If creating a course, show the creator
  if (isCreatingCourse) {
    return (
      <CourseCreator
        onSave={handleSaveCourse}
        onCancel={handleCancelCreate}
      />
    );
  }

  // If editing a module, show the editor
  if (editingModule) {
    return (
      <ModuleContentEditor
        module={editingModule}
        onSave={handleSaveModule}
        onCancel={handleCancelEdit}
      />
    );
  }

  // If viewing course details, show course modules
  if (selectedCourse) {
    return (
      <div className="p-4 lg:p-6 space-y-6">
        {/* Course Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="text-blue-100 hover:text-white mb-2 text-sm"
              >
                ← Volver a mis cursos
              </button>
              <h1 className="text-2xl lg:text-3xl font-bold mb-2">{selectedCourse.title}</h1>
              <p className="text-blue-100">{selectedCourse.description}</p>
            </div>
            <div className="flex items-center gap-2">
              {serverStatus === 'online' && <Wifi className="w-5 h-5 text-green-300" />}
              {serverStatus === 'offline' && <WifiOff className="w-5 h-5 text-red-300" />}
              <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(selectedCourse.status)}`}>
                {selectedCourse.status === 'published' ? 'Publicado' : 
                 selectedCourse.status === 'draft' ? 'Borrador' : 'Archivado'}
              </span>
            </div>
          </div>
        </div>

        {/* Course Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="text-2xl font-bold text-gray-900">{selectedCourse.enrolledStudents}</span>
            </div>
            <p className="text-sm text-gray-600">Estudiantes</p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="w-5 h-5 text-green-500" />
              <span className="text-2xl font-bold text-gray-900">{selectedCourse.modules.length}</span>
            </div>
            <p className="text-sm text-gray-600">Módulos</p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center justify-between mb-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-2xl font-bold text-gray-900">{selectedCourse.averageRating.toFixed(1)}</span>
            </div>
            <p className="text-sm text-gray-600">Valoración</p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-5 h-5 text-purple-500" />
              <span className="text-2xl font-bold text-gray-900">{selectedCourse.estimatedHours}h</span>
            </div>
            <p className="text-sm text-gray-600">Duración</p>
          </div>
        </div>

        {/* Course Actions */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleUpdateCourseStatus(selectedCourse.id, selectedCourse.status === 'published' ? 'draft' : 'published')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
              selectedCourse.status === 'published' 
                ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {selectedCourse.status === 'published' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {selectedCourse.status === 'published' ? 'Despublicar' : 'Publicar'}
          </button>

          <button
            onClick={() => handleUpdateCourseStatus(selectedCourse.id, 'archived')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
          >
            <Settings className="w-4 h-4" />
            Archivar
          </button>
        </div>

        {/* Modules List */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Módulos del Curso</h2>
          </div>
          <div className="p-4 space-y-4">
            {selectedCourse.modules.map((module, index) => (
              <div key={module.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{module.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {module.content.type === 'theory' ? (
                          <FileText className="w-4 h-4 text-blue-500" />
                        ) : (
                          <HelpCircle className="w-4 h-4 text-purple-500" />
                        )}
                        <span className="text-sm text-gray-600 capitalize">
                          {module.content.type === 'theory' ? 'Contenido Teórico' : 'Trivia'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEditModule(module)}
                    className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                  >
                    <Edit3 className="w-4 h-4" />
                    Editar
                  </button>
                </div>
              </div>
            ))}
            
            {selectedCourse.modules.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No hay módulos en este curso todavía.</p>
                <p className="text-sm">Edita el curso para agregar contenido.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando cursos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Gestión de Cursos</h1>
          <p className="text-gray-600">Administra tus cursos y contenido educativo</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Server Status Indicator */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100">
            {serverStatus === 'online' && (
              <>
                <Wifi className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-700">Online</span>
              </>
            )}
            {serverStatus === 'offline' && (
              <>
                <WifiOff className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-700">Offline</span>
              </>
            )}
            {serverStatus === 'checking' && (
              <>
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-gray-700">Conectando...</span>
              </>
            )}
          </div>

          <button
            onClick={handleCreateCourse}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Crear Curso
          </button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          {successMessage}
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-8">
          {[
            { key: 'published', label: 'Publicados', count: courses.filter(c => c.status === 'published').length },
            { key: 'draft', label: 'Borradores', count: courses.filter(c => c.status === 'draft').length },
            { key: 'all', label: 'Todos', count: courses.length }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                selectedTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </nav>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCourses.map(course => (
          <div key={course.id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
            <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-xl"></div>
            
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 line-clamp-2">{course.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(course.status)}`}>
                  {course.status === 'published' ? 'Publicado' : 
                   course.status === 'draft' ? 'Borrador' : 'Archivado'}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{course.description}</p>
              
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{course.enrolledStudents}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  <span>{course.averageRating.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span>{course.modules.length} módulos</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(course.difficulty)}`}>
                  {course.difficulty}
                </span>
                <button
                  onClick={() => setSelectedCourse(course)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Ver detalles →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {selectedTab === 'published' ? 'No tienes cursos publicados' :
             selectedTab === 'draft' ? 'No tienes borradores' : 'No tienes cursos'}
          </h3>
          <p className="text-gray-600 mb-6">
            {selectedTab === 'published' ? 'Publica tus borradores para que los estudiantes puedan acceder.' :
             selectedTab === 'draft' ? 'Crea tu primer curso para comenzar.' : 'Crea tu primer curso para comenzar.'}
          </p>
          <button
            onClick={handleCreateCourse}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Crear Primer Curso
          </button>
        </div>
      )}
    </div>
  );
};
