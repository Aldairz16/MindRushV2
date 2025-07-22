import React, { useState } from 'react';
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
  ArrowRight
} from 'lucide-react';
import { demoCourses, Course } from '../../data/demoCourses';
import { CourseLevelMap } from './CourseLevelMap';

export const CourseExplorer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  const categories = [
    { id: 'all', label: 'Todas las Categorías', count: demoCourses.length },
    { id: 'programming', label: 'Programación', count: 3 },
    { id: 'design', label: 'Diseño', count: 1 },
    { id: 'science', label: 'Ciencias', count: 1 }
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
    if (favorites.includes(courseId)) {
      setFavorites(favorites.filter(id => id !== courseId));
    } else {
      setFavorites([...favorites, courseId]);
    }
  };

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
  };

  // Si hay un curso seleccionado, mostrar su mapa de niveles
  if (selectedCourse) {
    return (
      <CourseLevelMap 
        course={selectedCourse} 
        onBack={() => setSelectedCourse(null)} 
      />
    );
  }

  const filteredCourses = demoCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || course.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getProgressInfo = (course: Course) => {
    const saved = localStorage.getItem('course-progress');
    const progress = saved ? JSON.parse(saved) : {};
    const courseProgress = progress[course.id];
    
    if (!courseProgress) {
      return { completed: 0, total: course.modules.length, percentage: 0 };
    }
    
    return {
      completed: courseProgress.completedLevels?.length || 0,
      total: course.modules.length,
      percentage: Math.round(((courseProgress.completedLevels?.length || 0) / course.modules.length) * 100)
    };
  };

  const renderCourseCard = (course: Course) => {
    const progressInfo = getProgressInfo(course);
    
    return (
      <div 
        key={course.id} 
        className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer" 
        onClick={() => handleCourseClick(course)}
      >
        {/* Course Image */}
        <div className="relative h-48">
          <img 
            src={course.thumbnail} 
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4">
            <button
              onClick={(e) => toggleFavorite(course.id, e)}
              className={`p-2 rounded-full ${
                favorites.includes(course.id) 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/80 text-gray-600 hover:bg-white'
              } transition-colors`}
            >
              <Heart className={`w-4 h-4 ${favorites.includes(course.id) ? 'fill-current' : ''}`} />
            </button>
          </div>
          <div className="absolute bottom-4 left-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(course.difficulty)}`}>
              {course.difficulty}
            </span>
          </div>
        </div>

        {/* Course Content */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-bold text-gray-900 leading-tight flex-1">
              {course.title}
            </h3>
            <div className="flex items-center gap-1 ml-3">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium text-gray-700">{course.rating}</span>
            </div>
          </div>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {course.description}
          </p>

          {/* Course Stats */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {course.duration}h
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {course.studentsEnrolled}
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              {course.modules.length} niveles
            </div>
          </div>

          {/* Progress Bar */}
          {progressInfo.completed > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">Progreso</span>
                <span className="text-blue-600 font-medium">{progressInfo.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressInfo.percentage}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {progressInfo.completed} de {progressInfo.total} niveles completados
              </div>
            </div>
          )}

          {/* Action Button */}
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
            {progressInfo.completed > 0 ? (
              <>
                <Play className="w-4 h-4" />
                Continuar Curso
              </>
            ) : (
              <>
                <Target className="w-4 h-4" />
                Comenzar Curso
              </>
            )}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Explorar Cursos</h1>
          
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar cursos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>

              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {difficulties.map(diff => (
                  <option key={diff.id} value={diff.id}>{diff.label}</option>
                ))}
              </select>

              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron cursos</h3>
            <p className="text-gray-600">Intenta ajustar tus filtros de búsqueda</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(renderCourseCard)}
          </div>
        )}
      </div>
    </div>
  );
};
