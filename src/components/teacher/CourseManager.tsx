import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Eye,
  Copy,
  BookOpen,
  Users,
  Star,
  Clock,
  Zap,
  Search,
  Grid,
  List as ListIcon,
  ChevronRight,
  CheckCircle
} from 'lucide-react';
import { ModuleContentEditor } from './ModuleContentEditor';
import { CourseCreatorEnhanced } from './CourseCreatorEnhanced';
import { Course, CourseModule } from '../../data/demoCourses';
import { apiService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';

export const CourseManager: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [editingModule, setEditingModule] = useState<CourseModule | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'published' | 'archived'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const { user } = useAuth();
  const { addNotification } = useNotifications();

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const allCourses = await apiService.getCourses();
      // Filter courses by instructor for teachers
      const userCourses = user?.role === 'teacher' 
        ? allCourses.filter(course => course.instructorId === user.id.toString())
        : allCourses;
      setCourses(userCourses);
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = () => {
    setShowCreateCourse(true);
  };

  const handleSaveCourse = async (course: Course) => {
    try {
      // More robust check: A course is new if:
      // 1. We're not currently editing a course (editingCourse is null)
      // 2. AND the course has a temporary ID (starts with 'course-')
      const isNewCourse = !editingCourse && course.id.startsWith('course-');
      
      if (isNewCourse) {
        // New course - use createCourse API
        const courseWithoutId = {
          ...course,
          instructor: user?.name || course.instructor,
          instructorId: user?.id.toString() || course.instructorId,
        };
        delete (courseWithoutId as any).id;
        await apiService.createCourse(courseWithoutId);
        
        addNotification({
          type: 'success',
          title: 'Curso creado exitosamente',
          message: `El curso "${course.title}" ha sido creado como borrador.`
        });
      } else {
        // Existing course - use updateCourse API
        await apiService.updateCourse(course.id, course);
        
        addNotification({
          type: 'success',
          title: 'Curso actualizado',
          message: `Los cambios en "${course.title}" han sido guardados.`
        });
      }
      
      await loadCourses();
      setSelectedCourse(null);
      setShowCreateCourse(false);
      setEditingCourse(null);
    } catch (error) {
      console.error('Error saving course:', error);
      addNotification({
        type: 'error',
        title: 'Error al guardar curso',
        message: 'No se pudieron guardar los cambios. Inténtalo de nuevo.'
      });
    }
  };

  const handleCancelCreate = () => {
    setShowCreateCourse(false);
    setEditingCourse(null);
    setSelectedCourse(null);
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setSelectedCourse(course);
    setShowCreateCourse(true);
  };

  const handleDeleteCourse = async (courseId: string) => {
    const courseToDelete = courses.find(c => c.id === courseId);
    const courseName = courseToDelete?.title || 'el curso';
    
    if (confirm(`¿Estás seguro de que quieres eliminar "${courseName}"? Esta acción no se puede deshacer.`)) {
      try {
        await apiService.deleteCourse(courseId);
        await loadCourses();
        
        addNotification({
          type: 'success',
          title: 'Curso eliminado',
          message: `"${courseName}" ha sido eliminado exitosamente.`
        });
      } catch (error) {
        console.error('Error deleting course:', error);
        addNotification({
          type: 'error',
          title: 'Error al eliminar curso',
          message: 'No se pudo eliminar el curso. Inténtalo de nuevo.'
        });
      }
    }
  };

  const handleAddModule = () => {
    if (!selectedCourse) return;
    
    const newModule: CourseModule = {
      id: `module-${Date.now()}`,
      title: `Módulo ${selectedCourse.modules.length + 1}`,
      description: '',
      type: 'lesson',
      duration: 30,
      content: [],
      order: selectedCourse.modules.length + 1,
      nodeType: 'theory',
      triviaQuestions: []
    };
    
    setEditingModule(newModule);
  };

  const handleSaveModule = (module: CourseModule) => {
    if (!selectedCourse) return;
    
    const isNewModule = module.id.startsWith('module-');
    const updatedModules = isNewModule
      ? [...selectedCourse.modules, module]
      : selectedCourse.modules.map(m => m.id === module.id ? module : m);
    
    const updatedCourse = { ...selectedCourse, modules: updatedModules };
    setSelectedCourse(updatedCourse);
    setEditingModule(null);
    
    // Auto-save course
    handleSaveCourse(updatedCourse);
    
    addNotification({
      type: 'success',
      title: isNewModule ? 'Módulo creado' : 'Módulo actualizado',
      message: `El módulo "${module.title}" ha sido ${isNewModule ? 'creado' : 'actualizado'} exitosamente.`
    });
  };

  const handleDeleteModule = (moduleId: string) => {
    if (!selectedCourse) return;
    
    const moduleToDelete = selectedCourse.modules.find(m => m.id === moduleId);
    const moduleName = moduleToDelete?.title || 'el módulo';
    
    if (confirm(`¿Estás seguro de que quieres eliminar "${moduleName}"?`)) {
      const updatedModules = selectedCourse.modules.filter(m => m.id !== moduleId);
      const updatedCourse = { ...selectedCourse, modules: updatedModules };
      setSelectedCourse(updatedCourse);
      handleSaveCourse(updatedCourse);
      
      addNotification({
        type: 'success',
        title: 'Módulo eliminado',
        message: `"${moduleName}" ha sido eliminado del curso.`
      });
    }
  };

  const updateCourseStatus = async (courseId: string, newStatus: 'draft' | 'published' | 'archived') => {
    try {
      const courseToUpdate = courses.find(c => c.id === courseId);
      if (!courseToUpdate) return;

      await apiService.updateCourse(courseId, { status: newStatus });
      await loadCourses();
      
      const statusLabels = {
        draft: 'borrador',
        published: 'publicado',
        archived: 'archivado'
      };
      
      addNotification({
        type: 'success',
        title: 'Estado actualizado',
        message: `El curso "${courseToUpdate.title}" ahora está ${statusLabels[newStatus]}.`
      });
    } catch (error) {
      console.error('Error updating course status:', error);
      addNotification({
        type: 'error',
        title: 'Error al actualizar estado',
        message: 'No se pudo cambiar el estado del curso.'
      });
    }
  };

  const duplicateModule = (module: CourseModule) => {
    const duplicatedModule = {
      ...module,
      id: `module-${Date.now()}`,
      title: `${module.title} (Copia)`,
      order: selectedCourse!.modules.length + 1
    };
    
    const updatedModules = [...selectedCourse!.modules, duplicatedModule];
    const updatedCourse = { ...selectedCourse!, modules: updatedModules };
    setSelectedCourse(updatedCourse);
    handleSaveCourse(updatedCourse);
    
    addNotification({
      type: 'success',
      title: 'Módulo duplicado',
      message: `Se ha creado una copia de "${module.title}".`
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'text-green-600 bg-green-100';
      case 'draft': return 'text-yellow-600 bg-yellow-100';
      case 'archived': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Principiante': return 'text-green-600 bg-green-100';
      case 'Intermedio': return 'text-yellow-600 bg-yellow-100';
      case 'Avanzado': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || course.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const calculateCourseStats = (course: Course) => {
    const totalContent = course.modules.reduce((sum, module) => sum + module.content.length, 0);
    const totalQuestions = course.modules.reduce((sum, module) => sum + (module.triviaQuestions?.length || 0), 0);
    const totalDuration = course.modules.reduce((sum, module) => sum + module.duration, 0);
    return { totalContent, totalQuestions, totalDuration };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Course Creator/Editor View
  if (showCreateCourse) {
    return (
      <CourseCreatorEnhanced
        initialCourse={editingCourse}
        onSave={handleSaveCourse}
        onCancel={handleCancelCreate}
      />
    );
  }

  // Module Content Editor View
  if (editingModule) {
    return (
      <ModuleContentEditor
        module={editingModule}
        onSave={handleSaveModule}
        onCancel={() => setEditingModule(null)}
      />
    );
  }

  // Course Detail View
  if (selectedCourse && !showCreateCourse) {
    const stats = calculateCourseStats(selectedCourse);
    
    return (
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-all"
                >
                  <ChevronRight className="w-5 h-5 transform rotate-180" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold">{selectedCourse.title}</h1>
                  <p className="text-blue-100">{selectedCourse.modules.length} módulos • {stats.totalDuration} min</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEditCourse(selectedCourse)}
                  className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-all"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Editar Curso</span>
                </button>
                
                <select
                  value={selectedCourse.status}
                  onChange={(e) => updateCourseStatus(selectedCourse.id, e.target.value as any)}
                  className={`px-3 py-1 rounded-full text-sm font-medium border-none outline-none ${getStatusColor(selectedCourse.status)}`}
                >
                  <option value="draft">Borrador</option>
                  <option value="published">Publicado</option>
                  <option value="archived">Archivado</option>
                </select>
                
                <button
                  onClick={() => setPreviewMode(!previewMode)}
                  className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-all"
                >
                  <Eye className="w-4 h-4" />
                  <span>{previewMode ? 'Editar' : 'Vista Previa'}</span>
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <BookOpen className="w-6 h-6 mb-2" />
                <div className="text-lg font-bold">{stats.totalContent}</div>
                <div className="text-sm text-blue-100">Contenidos</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <Zap className="w-6 h-6 mb-2" />
                <div className="text-lg font-bold">{stats.totalQuestions}</div>
                <div className="text-sm text-blue-100">Preguntas Trivia</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <Users className="w-6 h-6 mb-2" />
                <div className="text-lg font-bold">{selectedCourse.studentsEnrolled}</div>
                <div className="text-sm text-blue-100">Estudiantes</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <Star className="w-6 h-6 mb-2" />
                <div className="text-lg font-bold">{selectedCourse.rating.toFixed(1)}</div>
                <div className="text-sm text-blue-100">Calificación</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modules List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Módulos del Curso</h2>
            <button
              onClick={handleAddModule}
              className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Módulo</span>
            </button>
          </div>

          <div className="space-y-4">
            {selectedCourse.modules.map((module, index) => {
              const moduleStats = {
                content: module.content.length,
                questions: module.triviaQuestions?.length || 0,
                duration: module.duration
              };
              
              return (
                <div key={module.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all">
                  <div className="bg-gray-50 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                          <span className="font-bold text-blue-600">{index + 1}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{module.title}</h3>
                          <p className="text-sm text-gray-600">{module.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span className="flex items-center">
                              <BookOpen className="w-3 h-3 mr-1" />
                              {moduleStats.content} contenidos
                            </span>
                            <span className="flex items-center">
                              <Zap className="w-3 h-3 mr-1" />
                              {moduleStats.questions} preguntas
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {moduleStats.duration} min
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs ${module.nodeType === 'theory' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                              {module.nodeType === 'theory' ? 'Teoría' : 'Trivia'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => duplicateModule(module)}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
                          title="Duplicar módulo"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingModule(module)}
                          className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-all"
                          title="Editar módulo"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteModule(module.id)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-all"
                          title="Eliminar módulo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {selectedCourse.modules.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">No hay módulos aún</h3>
                <p className="mb-4">Comienza agregando tu primer módulo al curso</p>
                <button
                  onClick={handleAddModule}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all"
                >
                  Crear Primer Módulo
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Main Course List View
  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Gestión de Cursos</h1>
            <p className="text-gray-600">Crea, edita y administra tus cursos</p>
          </div>
          <button
            onClick={handleCreateCourse}
            className="flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Nuevo Curso</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar cursos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Todos los estados</option>
            <option value="draft">Borradores</option>
            <option value="published">Publicados</option>
            <option value="archived">Archivados</option>
          </select>
          
          <div className="flex border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-50'} transition-all`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-50'} transition-all`}
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-600">{courses.length}</div>
                <div className="text-sm text-blue-600">Total Cursos</div>
              </div>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {courses.filter(c => c.status === 'published').length}
                </div>
                <div className="text-sm text-green-600">Publicados</div>
              </div>
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <Edit3 className="w-8 h-8 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {courses.filter(c => c.status === 'draft').length}
                </div>
                <div className="text-sm text-yellow-600">Borradores</div>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {courses.reduce((sum, c) => sum + c.studentsEnrolled, 0)}
                </div>
                <div className="text-sm text-purple-600">Estudiantes</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course List/Grid */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
        {filteredCourses.map((course) => {
          const stats = calculateCourseStats(course);
          
          return (
            <div
              key={course.id}
              className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer ${
                viewMode === 'list' ? 'flex' : ''
              }`}
              onClick={() => setSelectedCourse(course)}
            >
              {viewMode === 'grid' ? (
                <>
                  <div className="relative">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                        {course.status === 'published' ? 'Publicado' : course.status === 'draft' ? 'Borrador' : 'Archivado'}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(course.difficulty)}`}>
                        {course.difficulty}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{course.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-2" />
                        {course.modules.length} módulos
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        {stats.totalDuration} min
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        {course.studentsEnrolled} estudiantes
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-2" />
                        {course.rating.toFixed(1)}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        Actualizado: {new Date(course.updatedAt).toLocaleDateString()}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditCourse(course);
                          }}
                          className="p-1 text-blue-500 hover:bg-blue-50 rounded"
                          title="Editar curso"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingModule(course.modules[0] || null);
                          }}
                          className="p-1 text-green-500 hover:bg-green-50 rounded"
                          title="Editar módulos"
                        >
                          <BookOpen className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCourse(course.id);
                          }}
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-24 h-24 object-cover"
                  />
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">{course.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">{course.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>{course.modules.length} módulos</span>
                          <span>{stats.totalDuration} min</span>
                          <span>{course.studentsEnrolled} estudiantes</span>
                          <span className={`px-2 py-1 rounded-full ${getStatusColor(course.status)}`}>
                            {course.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditCourse(course);
                          }}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded"
                          title="Editar curso"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingModule(course.modules[0] || null);
                          }}
                          className="p-2 text-green-500 hover:bg-green-50 rounded"
                          title="Editar módulos"
                        >
                          <BookOpen className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCourse(course.id);
                          }}
                          className="p-2 text-red-500 hover:bg-red-50 rounded"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-medium mb-2">
            {searchTerm || filterStatus !== 'all' ? 'No se encontraron cursos' : 'No tienes cursos aún'}
          </h3>
          <p className="mb-6">
            {searchTerm || filterStatus !== 'all' 
              ? 'Intenta ajustar los filtros de búsqueda' 
              : 'Comienza creando tu primer curso'
            }
          </p>
          {!searchTerm && filterStatus === 'all' && (
            <button
              onClick={handleCreateCourse}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all"
            >
              Crear Primer Curso
            </button>
          )}
        </div>
      )}
    </div>
  );
};
