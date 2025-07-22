import React, { useState } from 'react';
import { 
  Plus, 
  Save, 
  ArrowLeft,
  BookOpen,
  Video,
  FileText,
  HelpCircle,
  Upload,
  X,
  Calendar,
  Users,
  Star
} from 'lucide-react';
import { Course, CourseModule, ModuleContent } from '../../data/demoCourses';

interface CourseCreatorProps {
  onSave: (course: Course) => void;
  onCancel: () => void;
}

export const CourseCreator: React.FC<CourseCreatorProps> = ({ onSave, onCancel }) => {
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    instructor: 'Prof. Nuevo Instructor',
    instructorId: '1',
    category: '',
    difficulty: 'Principiante' as 'Principiante' | 'Intermedio' | 'Avanzado',
    duration: 10,
    tags: [] as string[],
    objectives: [''],
    prerequisites: [''],
    thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800'
  });

  const [modules, setModules] = useState<CourseModule[]>([
    {
      id: 'mod-1',
      title: '',
      description: '',
      type: 'lesson' as 'lesson' | 'quiz' | 'project' | 'assignment',
      duration: 30,
      content: [],
      order: 1,
      nodeType: 'theory' as 'theory' | 'trivia',
      triviaQuestions: []
    }
  ]);

  const [newTag, setNewTag] = useState('');

  const handleSaveCourse = () => {
    const newCourse: Course = {
      id: `course-${Date.now()}`,
      title: courseData.title,
      description: courseData.description,
      instructor: courseData.instructor,
      instructorId: courseData.instructorId,
      category: courseData.category,
      difficulty: courseData.difficulty,
      duration: courseData.duration,
      rating: 0,
      studentsEnrolled: 0,
      thumbnail: courseData.thumbnail,
      tags: courseData.tags,
      objectives: courseData.objectives.filter(obj => obj.trim() !== ''),
      prerequisites: courseData.prerequisites.filter(prereq => prereq.trim() !== ''),
      modules: modules.filter(mod => mod.title.trim() !== ''),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      status: 'draft',
      completionRate: 0,
      certificateEnabled: true
    };

    onSave(newCourse);
  };

  const addObjective = () => {
    setCourseData(prev => ({
      ...prev,
      objectives: [...prev.objectives, '']
    }));
  };

  const updateObjective = (index: number, value: string) => {
    setCourseData(prev => ({
      ...prev,
      objectives: prev.objectives.map((obj, i) => i === index ? value : obj)
    }));
  };

  const removeObjective = (index: number) => {
    setCourseData(prev => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index)
    }));
  };

  const addPrerequisite = () => {
    setCourseData(prev => ({
      ...prev,
      prerequisites: [...prev.prerequisites, '']
    }));
  };

  const updatePrerequisite = (index: number, value: string) => {
    setCourseData(prev => ({
      ...prev,
      prerequisites: prev.prerequisites.map((prereq, i) => i === index ? value : prereq)
    }));
  };

  const removePrerequisite = (index: number) => {
    setCourseData(prev => ({
      ...prev,
      prerequisites: prev.prerequisites.filter((_, i) => i !== index)
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !courseData.tags.includes(newTag.trim())) {
      setCourseData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setCourseData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addModule = () => {
    const newModule: CourseModule = {
      id: `mod-${modules.length + 1}`,
      title: '',
      description: '',
      type: 'lesson',
      duration: 30,
      content: [],
      order: modules.length + 1,
      nodeType: 'theory',
      triviaQuestions: []
    };
    setModules([...modules, newModule]);
  };

  const updateModule = (index: number, field: keyof CourseModule, value: any) => {
    setModules(prev => 
      prev.map((module, i) => 
        i === index ? { ...module, [field]: value } : module
      )
    );
  };

  const removeModule = (index: number) => {
    setModules(prev => prev.filter((_, i) => i !== index));
  };

  const addContentToModule = (moduleIndex: number) => {
    const newContent: ModuleContent = {
      id: `content-${Date.now()}`,
      type: 'text',
      title: '',
      content: '',
      duration: 10
    };
    
    setModules(prev => 
      prev.map((module, i) => 
        i === moduleIndex ? {
          ...module,
          content: [...module.content, newContent]
        } : module
      )
    );
  };

  const categories = [
    'programming',
    'design',
    'business',
    'marketing',
    'science',
    'language',
    'other'
  ];

  const isFormValid = () => {
    return courseData.title.trim() !== '' && 
           courseData.description.trim() !== '' && 
           courseData.category !== '' &&
           modules.some(module => module.title.trim() !== '');
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <button
              onClick={onCancel}
              className="text-purple-100 hover:text-white mb-2 text-sm flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Volver a gestión de cursos
            </button>
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">Crear Nuevo Curso</h1>
            <p className="text-purple-100">Diseña una experiencia de aprendizaje única</p>
          </div>
          <div className="flex space-x-3 mt-4 lg:mt-0">
            <button 
              onClick={onCancel}
              className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSaveCourse}
              disabled={!isFormValid()}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors flex items-center ${
                isFormValid() 
                  ? 'bg-white text-purple-600 hover:bg-purple-50' 
                  : 'bg-white/50 text-purple-300 cursor-not-allowed'
              }`}
            >
              <Save className="w-4 h-4 mr-2" />
              Guardar Curso
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Información Básica</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título del Curso *
                </label>
                <input
                  type="text"
                  value={courseData.title}
                  onChange={(e) => setCourseData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Ej: JavaScript para Principiantes"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción *
                </label>
                <textarea
                  value={courseData.description}
                  onChange={(e) => setCourseData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Describe qué aprenderán los estudiantes..."
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría *
                  </label>
                  <select
                    value={courseData.category}
                    onChange={(e) => setCourseData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar categoría</option>
                    <option value="programming">Programación</option>
                    <option value="design">Diseño</option>
                    <option value="business">Negocios</option>
                    <option value="marketing">Marketing</option>
                    <option value="science">Ciencia</option>
                    <option value="language">Idiomas</option>
                    <option value="other">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nivel de Dificultad
                  </label>
                  <select
                    value={courseData.difficulty}
                    onChange={(e) => setCourseData(prev => ({ ...prev, difficulty: e.target.value as any }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="Principiante">Principiante</option>
                    <option value="Intermedio">Intermedio</option>
                    <option value="Avanzado">Avanzado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duración (horas)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={courseData.duration}
                    onChange={(e) => setCourseData(prev => ({ ...prev, duration: parseInt(e.target.value) || 10 }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="10"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Etiquetas
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {courseData.tags.map((tag, index) => (
                    <span key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center">
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-purple-600 hover:text-purple-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Agregar etiqueta..."
                  />
                  <button
                    onClick={addTag}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Objectives */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Objetivos del Curso
                </label>
                <div className="space-y-2">
                  {courseData.objectives.map((objective, index) => (
                    <div key={index} className="flex space-x-2">
                      <input
                        type="text"
                        value={objective}
                        onChange={(e) => updateObjective(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="¿Qué aprenderán los estudiantes?"
                      />
                      {courseData.objectives.length > 1 && (
                        <button
                          onClick={() => removeObjective(index)}
                          className="text-red-600 hover:text-red-700 p-2"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={addObjective}
                  className="mt-2 text-purple-600 hover:text-purple-700 text-sm flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Agregar objetivo
                </button>
              </div>
            </div>
          </div>

          {/* Course Modules */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Módulos del Curso</h2>
              <button
                onClick={addModule}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Módulo
              </button>
            </div>

            <div className="space-y-6">
              {modules.map((module, moduleIndex) => (
                <div key={module.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-800">Módulo {moduleIndex + 1}</h3>
                    {modules.length > 1 && (
                      <button
                        onClick={() => removeModule(moduleIndex)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={module.title}
                        onChange={(e) => updateModule(moduleIndex, 'title', e.target.value)}
                        placeholder="Título del módulo..."
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <select
                        value={module.nodeType}
                        onChange={(e) => updateModule(moduleIndex, 'nodeType', e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="theory">Contenido Teórico</option>
                        <option value="trivia">Preguntas Trivia</option>
                      </select>
                    </div>
                    
                    <textarea
                      value={module.description}
                      onChange={(e) => updateModule(moduleIndex, 'description', e.target.value)}
                      placeholder="Descripción del módulo..."
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <input
                        type="number"
                        value={module.duration}
                        onChange={(e) => updateModule(moduleIndex, 'duration', parseInt(e.target.value) || 30)}
                        placeholder="Duración (minutos)"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <select
                        value={module.type}
                        onChange={(e) => updateModule(moduleIndex, 'type', e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="lesson">Lección</option>
                        <option value="quiz">Quiz</option>
                        <option value="project">Proyecto</option>
                        <option value="assignment">Tarea</option>
                      </select>
                    </div>

                    {module.nodeType === 'theory' && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-blue-800">
                            Elementos de contenido: {module.content.length}
                          </span>
                          <button
                            onClick={() => addContentToModule(moduleIndex)}
                            className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Agregar contenido
                          </button>
                        </div>
                        <p className="text-xs text-blue-600">
                          Podrás editar el contenido detallado después de crear el curso
                        </p>
                      </div>
                    )}

                    {module.nodeType === 'trivia' && (
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-purple-800">
                            Preguntas de trivia: {module.triviaQuestions?.length || 0}
                          </span>
                        </div>
                        <p className="text-xs text-purple-600">
                          Podrás agregar preguntas después de crear el curso
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Course Image */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Imagen del Curso</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Imagen por defecto</p>
              <p className="text-sm text-gray-500">Podrás cambiarla después</p>
            </div>
          </div>

          {/* Prerequisites */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Prerrequisitos</h3>
            <div className="space-y-2">
              {courseData.prerequisites.map((prereq, index) => (
                <div key={index} className="flex space-x-2">
                  <input
                    type="text"
                    value={prereq}
                    onChange={(e) => updatePrerequisite(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    placeholder="Conocimiento necesario..."
                  />
                  {courseData.prerequisites.length > 1 && (
                    <button
                      onClick={() => removePrerequisite(index)}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={addPrerequisite}
              className="mt-2 text-purple-600 hover:text-purple-700 text-sm flex items-center"
            >
              <Plus className="w-3 h-3 mr-1" />
              Agregar prerrequisito
            </button>
          </div>

          {/* Course Stats Preview */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Vista Previa</h3>
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                {courseData.duration} horas de contenido
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <BookOpen className="w-4 h-4 mr-2" />
                {modules.length} módulos
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-2" />
                0 estudiantes (nuevo curso)
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Star className="w-4 h-4 mr-2" />
                Sin calificaciones aún
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
