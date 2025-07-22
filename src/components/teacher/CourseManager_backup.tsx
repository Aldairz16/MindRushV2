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
  WifiOff
} from 'lucide-react';
import { apiService, Course, CourseModule } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { ModuleContentEditor } from './ModuleContentEditor';
import { CourseCreator } from './CourseCreator';

export const CourseManager: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('published');
  const [editingModule, setEditingModule] = useState<CourseModule | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Initialize courses from storage on component mount
  useEffect(() => {
    const initialCourses = initializeCoursesStorage(demoCourses);
    setCourses(initialCourses);
  }, []);

  // Save courses to storage whenever courses change
  useEffect(() => {
    if (courses.length > 0) {
      saveCoursesToStorage(courses);
    }
  }, [courses]);

  const handleEditModule = (module: CourseModule) => {
    setEditingModule(module);
  };

  const handleSaveModule = (updatedModule: CourseModule) => {
    setCourses(prevCourses => 
      prevCourses.map(course => ({
        ...course,
        modules: course.modules.map(module => 
          module.id === updatedModule.id ? updatedModule : module
        )
      }))
    );
    setEditingModule(null);
  };

  const handleCancelEdit = () => {
    setEditingModule(null);
  };

  const handleCreateCourse = () => {
    setIsCreatingCourse(true);
  };

  const handleSaveCourse = (newCourse: Course) => {
    setCourses(prev => [...prev, newCourse]);
    setIsCreatingCourse(false);
    setSuccessMessage(`Curso "${newCourse.title}" creado exitosamente`);
    // Clear success message after 3 seconds
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleCancelCreate = () => {
    setIsCreatingCourse(false);
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
          </div>
        </div>

        {/* Course Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-500">Estudiantes</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{selectedCourse.studentsEnrolled}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-500">Módulos</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{selectedCourse.modules.length}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center justify-between mb-2">
              <Star className="w-5 h-5 text-yellow-600" />
              <span className="text-sm text-gray-500">Rating</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{selectedCourse.rating}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-gray-500">Completado</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{selectedCourse.completionRate}%</p>
          </div>
        </div>

        {/* Course Modules */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Módulos del Curso</h2>
            <p className="text-gray-600 mt-1">Gestiona el contenido de cada módulo</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {selectedCourse.modules.map((module, index) => (
                <div key={module.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{module.title}</h3>
                        <p className="text-sm text-gray-600">{module.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {module.duration} min
                          </span>
                          <span className="flex items-center">
                            {module.nodeType === 'theory' ? (
                              <>
                                <FileText className="w-3 h-3 mr-1" />
                                Contenido Teórico ({module.content.length} elementos)
                              </>
                            ) : (
                              <>
                                <HelpCircle className="w-3 h-3 mr-1" />
                                Trivia ({module.triviaQuestions?.length || 0} preguntas)
                              </>
                            )}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            module.nodeType === 'theory' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {module.nodeType === 'theory' ? 'Teoría' : 'Trivia'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleEditModule(module)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Editar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
            <p className="text-green-800 font-medium">{successMessage}</p>
          </div>
          <button
            onClick={() => setSuccessMessage('')}
            className="text-green-600 hover:text-green-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">Gestión de Cursos</h1>
            <p className="text-blue-100">Administra y supervisa todos tus cursos</p>
          </div>
          <button 
            onClick={handleCreateCourse}
            className="mt-4 lg:mt-0 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Crear Nuevo Curso
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-500">Total Cursos</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-500">Estudiantes</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {courses.reduce((sum, course) => sum + course.studentsEnrolled, 0)}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <Star className="w-5 h-5 text-yellow-600" />
            <span className="text-sm text-gray-500">Rating Promedio</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {(courses.reduce((sum, course) => sum + course.rating, 0) / courses.length).toFixed(1)}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            <span className="text-sm text-gray-500">Completado</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {Math.round(courses.reduce((sum, course) => sum + course.completionRate, 0) / courses.length)}%
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="flex border-b border-gray-200">
          {[
            { id: 'published', label: 'Cursos Publicados', count: courses.filter(c => c.status === 'published').length },
            { id: 'draft', label: 'Borradores', count: courses.filter(c => c.status === 'draft').length },
            { id: 'all', label: 'Todos', count: courses.length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`px-6 py-4 font-medium transition-colors ${
                selectedTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {filteredCourses.map(course => (
              <div key={course.id} className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                          {course.status === 'published' ? 'Publicado' : course.status === 'draft' ? 'Borrador' : 'Archivado'}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(course.difficulty)}`}>
                          {course.difficulty}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{course.description}</p>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {course.studentsEnrolled} estudiantes
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-1" />
                        {course.modules.length} módulos
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-1" />
                        {course.rating} rating
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(course.updatedAt).toLocaleDateString('es-ES')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-6">
                    {course.status === 'published' && (
                      <button className="p-2 text-yellow-600 hover:text-yellow-700 transition-colors">
                        <Pause className="w-5 h-5" />
                      </button>
                    )}
                    {course.status === 'draft' && (
                      <button className="p-2 text-green-600 hover:text-green-700 transition-colors">
                        <Play className="w-5 h-5" />
                      </button>
                    )}
                    <button className="p-2 text-gray-600 hover:text-gray-700 transition-colors">
                      <Settings className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setSelectedCourse(course)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Gestionar
                    </button>
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
