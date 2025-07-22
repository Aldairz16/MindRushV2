import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Star, 
  Clock, 
  Users, 
  BookOpen,
  Play,
  Heart,
  Target,
  Grid,
  List,
  ArrowRight,
  CheckCircle,
  Wifi,
  WifiOff,
  AlertCircle,
  UserPlus
} from 'lucide-react';
import { apiService, Course } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

export const CourseExplorer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [serverStatus, setServerStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const [enrolling, setEnrolling] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const { user } = useAuth();

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

  const handleEnrollCourse = async (courseId: string) => {
    if (!user) return;

    try {
      setEnrolling(courseId);
      
      if (serverStatus === 'online') {
        await apiService.enrollUser(user.id, courseId);
        
        // Update course enrollment count
        setCourses(prev => prev.map(course => 
          course.id === courseId 
            ? { ...course, studentsEnrolled: course.studentsEnrolled + 1 }
            : course
        ));
        
        setSuccessMessage('¡Te has inscrito exitosamente al curso!');
      } else {
        // Local enrollment fallback
        const enrollments = JSON.parse(localStorage.getItem('enrollments') || '[]');
        const newEnrollment = {
          id: Date.now(),
          userId: user.id,
          courseId,
          enrolledAt: new Date().toISOString(),
          status: 'active'
        };
        enrollments.push(newEnrollment);
        localStorage.setItem('enrollments', JSON.stringify(enrollments));
        
        setSuccessMessage('¡Te has inscrito exitosamente al curso! (Modo offline)');
      }
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error enrolling in course:', err);
      setError('Error al inscribirse al curso');
      setTimeout(() => setError(''), 3000);
    } finally {
      setEnrolling(null);
    }
  };

  const isEnrolled = (courseId: string) => {
    return user?.enrolledCourses?.includes(courseId) || false;
  };

  const categories = [
    { id: 'all', label: 'Todas las Categorías', count: courses.length },
    { id: 'Programación', label: 'Programación', count: courses.filter(c => c.category === 'Programación').length },
    { id: 'Frontend', label: 'Frontend', count: courses.filter(c => c.category === 'Frontend').length },
    { id: 'Data Science', label: 'Data Science', count: courses.filter(c => c.category === 'Data Science').length }
  ];

  const difficulties = [
    { id: 'all', label: 'Todos los Niveles' },
    { id: 'Principiante', label: 'Principiante' },
    { id: 'Intermedio', label: 'Intermedio' },
    { id: 'Avanzado', label: 'Avanzado' }
  ];

  const getDifficultyColor = (difficulty: string) => {
    const colors: { [key: string]: string } = {
      'Principiante': 'bg-green-100 text-green-800',
      'Intermedio': 'bg-yellow-100 text-yellow-800',
      'Avanzado': 'bg-red-100 text-red-800'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  const toggleFavorite = (courseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || course.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

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

  if (selectedCourse) {
    return (
      <div className="p-4 lg:p-6 space-y-6">
        {/* Course Detail Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
          <button
            onClick={() => setSelectedCourse(null)}
            className="text-blue-100 hover:text-white mb-4 text-sm"
          >
            ← Volver a explorar cursos
          </button>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h1 className="text-2xl lg:text-3xl font-bold mb-2">{selectedCourse.title}</h1>
              <p className="text-blue-100 mb-4">{selectedCourse.description}</p>
              
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{selectedCourse.studentsEnrolled} estudiantes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  <span>{selectedCourse.rating.toFixed(1)} ({selectedCourse.studentsEnrolled} reseñas)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{selectedCourse.duration} horas</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(selectedCourse.difficulty)}`}>
                  {selectedCourse.difficulty}
                </span>
              </div>
            </div>
            
            <div className="bg-white/10 rounded-lg p-4">
              <div className="mb-4">
                <p className="text-blue-100 text-sm mb-2">Instructor</p>
                <p className="font-semibold">{selectedCourse.instructor}</p>
              </div>
              
              {isEnrolled(selectedCourse.id) ? (
                <div className="flex items-center gap-2 text-green-300">
                  <CheckCircle className="w-5 h-5" />
                  <span>Ya estás inscrito</span>
                </div>
              ) : (
                <button
                  onClick={() => handleEnrollCourse(selectedCourse.id)}
                  disabled={enrolling === selectedCourse.id}
                  className="w-full bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {enrolling === selectedCourse.id ? (
                    <>
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      Inscribiendo...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Inscribirse al Curso
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Modules */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">Contenido del Curso</h2>
              </div>
              <div className="p-6 space-y-4">
                {selectedCourse.modules.map((module: any, index) => (
                  <div key={module.id} className="border rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{module.title}</h3>
                        <p className="text-sm text-gray-600">{module.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>{module.type === 'theory' ? '📖 Teoría' : '🧩 Trivia'}</span>
                          <span>{module.duration} min</span>
                        </div>
                      </div>
                      {isEnrolled(selectedCourse.id) && (
                        <Play className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Objectives */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">Objetivos de Aprendizaje</h2>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  {selectedCourse.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Target className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Prerequisites */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-gray-900">Prerrequisitos</h3>
              </div>
              <div className="p-4">
                <ul className="space-y-2">
                  {selectedCourse.prerequisites.map((prereq, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      {prereq}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-gray-900">Tecnologías</h3>
              </div>
              <div className="p-4">
                <div className="flex flex-wrap gap-2">
                  {selectedCourse.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Explorar Cursos</h1>
          <p className="text-gray-600">Descubre nuevos conocimientos y habilidades</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Server Status */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100">
            {serverStatus === 'online' && (
              <>
                <Wifi className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-700">Sincronizado</span>
              </>
            )}
            {serverStatus === 'offline' && (
              <>
                <WifiOff className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-700">Offline</span>
              </>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
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

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-4 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar cursos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.label} ({category.count})
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {difficulties.map(difficulty => (
                <option key={difficulty.id} value={difficulty.id}>
                  {difficulty.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Course Grid/List */}
      <div className={viewMode === 'grid' 
        ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" 
        : "space-y-4"
      }>
        {filteredCourses.map(course => (
          <div
            key={course.id}
            onClick={() => setSelectedCourse(course)}
            className={`bg-white rounded-xl shadow-sm border hover:shadow-md transition-all cursor-pointer ${
              viewMode === 'list' ? 'flex gap-4 p-4' : ''
            }`}
          >
            {viewMode === 'grid' ? (
              <>
                <div 
                  className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-xl relative"
                  style={{
                    backgroundImage: `url(${course.thumbnail})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <button
                    onClick={(e) => toggleFavorite(course.id, e)}
                    className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                  >
                    <Heart className={`w-4 h-4 ${favorites.includes(course.id) ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
                  </button>
                </div>
                
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-2">{course.title}</h3>
                    {isEnrolled(course.id) && (
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 ml-2" />
                    )}
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{course.description}</p>
                  <p className="text-sm text-blue-600 mb-3">{course.instructor}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{course.studentsEnrolled}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      <span>{course.rating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}h</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(course.difficulty)}`}>
                      {course.difficulty}
                    </span>
                    <ArrowRight className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div 
                  className="w-32 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex-shrink-0"
                  style={{
                    backgroundImage: `url(${course.thumbnail})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{course.title}</h3>
                    {isEnrolled(course.id) && (
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{course.description}</p>
                  <p className="text-sm text-blue-600 mb-2">{course.instructor}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{course.studentsEnrolled}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      <span>{course.rating.toFixed(1)}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(course.difficulty)}`}>
                      {course.difficulty}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron cursos</h3>
          <p className="text-gray-600">Intenta ajustar los filtros de búsqueda</p>
        </div>
      )}
    </div>
  );
};
