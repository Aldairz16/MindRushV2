import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Save, 
  ArrowLeft,
  BookOpen,
  X,
  Calendar,
  Users,
  Star,
  Trash2,
  Copy
} from 'lucide-react';
import { Course, CourseModule } from '../../data/demoCourses';
import { useAuth } from '../../contexts/AuthContext';

interface CourseCreatorEnhancedProps {
  initialCourse?: Course | null;
  onSave: (course: Course) => void;
  onCancel: () => void;
}

export const CourseCreatorEnhanced: React.FC<CourseCreatorEnhancedProps> = ({ 
  initialCourse, 
  onSave, 
  onCancel 
}) => {
  const { user } = useAuth();
  
  const [courseData, setCourseData] = useState({
    title: initialCourse?.title || '',
    description: initialCourse?.description || '',
    instructor: initialCourse?.instructor || user?.name || 'Prof. Nuevo Instructor',
    instructorId: initialCourse?.instructorId || user?.id.toString() || '1',
    category: initialCourse?.category || '',
    difficulty: initialCourse?.difficulty || 'Principiante' as 'Principiante' | 'Intermedio' | 'Avanzado',
    duration: initialCourse?.duration || 10,
    tags: initialCourse?.tags || [] as string[],
    objectives: initialCourse?.objectives || [''],
    prerequisites: initialCourse?.prerequisites || [''],
    thumbnail: initialCourse?.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'
  });

  const [modules, setModules] = useState<CourseModule[]>(
    initialCourse?.modules || [
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
    ]
  );

  const [newTag, setNewTag] = useState('');
  const [isEditing] = useState(!!initialCourse);

  useEffect(() => {
    if (initialCourse) {
      setCourseData({
        title: initialCourse.title,
        description: initialCourse.description,
        instructor: initialCourse.instructor,
        instructorId: initialCourse.instructorId,
        category: initialCourse.category,
        difficulty: initialCourse.difficulty,
        duration: initialCourse.duration,
        tags: initialCourse.tags,
        objectives: initialCourse.objectives,
        prerequisites: initialCourse.prerequisites,
        thumbnail: initialCourse.thumbnail
      });
      setModules(initialCourse.modules);
    }
  }, [initialCourse]);

  const handleSaveCourse = () => {
    const courseToSave: Course = {
      id: initialCourse?.id || `course-${Date.now()}`,
      title: courseData.title,
      description: courseData.description,
      instructor: courseData.instructor,
      instructorId: courseData.instructorId,
      category: courseData.category,
      difficulty: courseData.difficulty,
      duration: courseData.duration,
      rating: initialCourse?.rating || 0,
      studentsEnrolled: initialCourse?.studentsEnrolled || 0,
      thumbnail: courseData.thumbnail,
      tags: courseData.tags,
      objectives: courseData.objectives.filter(obj => obj.trim() !== ''),
      prerequisites: courseData.prerequisites.filter(prereq => prereq.trim() !== ''),
      modules: modules.filter(mod => mod.title.trim() !== '').map((mod, index) => ({
        ...mod,
        order: index + 1
      })),
      createdAt: initialCourse?.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      status: initialCourse?.status || 'draft',
      completionRate: initialCourse?.completionRate || 0,
      certificateEnabled: initialCourse?.certificateEnabled || true
    };

    onSave(courseToSave);
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

  const duplicateModule = (index: number) => {
    const moduleToClone = modules[index];
    const duplicatedModule: CourseModule = {
      ...moduleToClone,
      id: `mod-${Date.now()}`,
      title: `${moduleToClone.title} (Copia)`,
      order: modules.length + 1
    };
    setModules(prev => [...prev, duplicatedModule]);
  };

  // Trivia questions management
  const addTriviaQuestion = (moduleIndex: number) => {
    const newQuestion = {
      id: `q-${Date.now()}`,
      question: '',
      type: 'multiple-choice' as 'multiple-choice' | 'true-false' | 'type-answer' | 'multiple-select',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      timeLimit: 30,
      points: 10,
      difficulty: 'medium' as 'easy' | 'medium' | 'hard',
      category: 'General'
    };

    setModules(prev => 
      prev.map((module, i) => 
        i === moduleIndex 
          ? { ...module, triviaQuestions: [...(module.triviaQuestions || []), newQuestion] }
          : module
      )
    );
  };

  const updateTriviaQuestion = (moduleIndex: number, questionIndex: number, field: string, value: any) => {
    setModules(prev => 
      prev.map((module, i) => 
        i === moduleIndex 
          ? {
              ...module,
              triviaQuestions: module.triviaQuestions?.map((question, j) => 
                j === questionIndex ? { ...question, [field]: value } : question
              ) || []
            }
          : module
      )
    );
  };

  const removeTriviaQuestion = (moduleIndex: number, questionIndex: number) => {
    setModules(prev => 
      prev.map((module, i) => 
        i === moduleIndex 
          ? {
              ...module,
              triviaQuestions: module.triviaQuestions?.filter((_, j) => j !== questionIndex) || []
            }
          : module
      )
    );
  };

  const updateQuestionOption = (moduleIndex: number, questionIndex: number, optionIndex: number, value: string) => {
    setModules(prev => 
      prev.map((module, i) => 
        i === moduleIndex 
          ? {
              ...module,
              triviaQuestions: module.triviaQuestions?.map((question, j) => 
                j === questionIndex 
                  ? {
                      ...question,
                      options: question.options.map((option, k) => k === optionIndex ? value : option)
                    }
                  : question
              ) || []
            }
          : module
      )
    );
  };

  const isFormValid = () => {
    return courseData.title.trim() !== '' && 
           courseData.description.trim() !== '' && 
           courseData.category !== '' &&
           modules.some(module => module.title.trim() !== '');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl mx-6 mt-6 p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <button
              onClick={onCancel}
              className="text-purple-100 hover:text-white mb-2 text-sm flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Volver a gestión de cursos
            </button>
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">
              {isEditing ? 'Editar Curso' : 'Crear Nuevo Curso'}
            </h1>
            <p className="text-purple-100">
              {isEditing ? 'Modifica la información de tu curso' : 'Diseña una experiencia de aprendizaje única'}
            </p>
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
              className="bg-white text-purple-600 px-6 py-2 rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              {isEditing ? 'Guardar Cambios' : 'Crear Curso'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center mb-6">
            <BookOpen className="w-6 h-6 text-blue-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-800">Información Básica</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título del Curso *
                </label>
                <input
                  type="text"
                  value={courseData.title}
                  onChange={(e) => setCourseData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: JavaScript Avanzado 2024"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría *
                </label>
                <select
                  value={courseData.category}
                  onChange={(e) => setCourseData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Selecciona una categoría</option>
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="fullstack">Full Stack</option>
                  <option value="mobile">Desarrollo Móvil</option>
                  <option value="data-science">Ciencia de Datos</option>
                  <option value="devops">DevOps</option>
                  <option value="design">Diseño</option>
                  <option value="other">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dificultad
                </label>
                <select
                  value={courseData.difficulty}
                  onChange={(e) => setCourseData(prev => ({ ...prev, difficulty: e.target.value as any }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Principiante">Principiante</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Avanzado">Avanzado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duración Estimada (horas)
                </label>
                <input
                  type="number"
                  value={courseData.duration}
                  onChange={(e) => setCourseData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="1"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción *
                </label>
                <textarea
                  value={courseData.description}
                  onChange={(e) => setCourseData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32 resize-none"
                  placeholder="Describe de qué trata tu curso..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL de la Imagen de Portada
                </label>
                <div className="space-y-3">
                  <input
                    type="url"
                    value={courseData.thumbnail}
                    onChange={(e) => setCourseData(prev => ({ ...prev, thumbnail: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://..."
                  />
                  {courseData.thumbnail && (
                    <div className="relative">
                      <img
                        src={courseData.thumbnail}
                        alt="Vista previa"
                        className="w-full h-32 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center mb-6">
            <Star className="w-6 h-6 text-yellow-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-800">Etiquetas</h2>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {courseData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
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
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Agregar etiqueta..."
              />
              <button
                onClick={addTag}
                className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Objectives */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center mb-6">
            <Users className="w-6 h-6 text-green-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-800">Objetivos de Aprendizaje</h2>
          </div>

          <div className="space-y-3">
            {courseData.objectives.map((objective, index) => (
              <div key={index} className="flex space-x-2">
                <input
                  type="text"
                  value={objective}
                  onChange={(e) => updateObjective(index, e.target.value)}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Objetivo de aprendizaje..."
                />
                <button
                  onClick={() => removeObjective(index)}
                  className="px-3 py-3 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={addObjective}
              className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors"
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Agregar Objetivo
            </button>
          </div>
        </div>

        {/* Prerequisites */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center mb-6">
            <Calendar className="w-6 h-6 text-purple-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-800">Prerrequisitos</h2>
          </div>

          <div className="space-y-3">
            {courseData.prerequisites.map((prerequisite, index) => (
              <div key={index} className="flex space-x-2">
                <input
                  type="text"
                  value={prerequisite}
                  onChange={(e) => updatePrerequisite(index, e.target.value)}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Prerrequisito..."
                />
                <button
                  onClick={() => removePrerequisite(index)}
                  className="px-3 py-3 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={addPrerequisite}
              className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors"
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Agregar Prerrequisito
            </button>
          </div>
        </div>

        {/* Modules */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <BookOpen className="w-6 h-6 text-indigo-500 mr-3" />
              <h2 className="text-xl font-semibold text-gray-800">Módulos del Curso</h2>
            </div>
            <button
              onClick={addModule}
              className="flex items-center px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Módulo
            </button>
          </div>

          <div className="space-y-4">
            {modules.map((module, index) => (
              <div key={module.id} className="border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título del Módulo
                    </label>
                    <input
                      type="text"
                      value={module.title}
                      onChange={(e) => updateModule(index, 'title', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ej: Introducción a JavaScript"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duración (minutos)
                    </label>
                    <input
                      type="number"
                      value={module.duration}
                      onChange={(e) => updateModule(index, 'duration', parseInt(e.target.value) || 30)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="1"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={module.description}
                    onChange={(e) => updateModule(index, 'description', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={2}
                    placeholder="Describe el contenido de este módulo..."
                  />
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-4">
                    <select
                      value={module.nodeType}
                      onChange={(e) => updateModule(index, 'nodeType', e.target.value)}
                      className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="theory">Teoría</option>
                      <option value="trivia">Trivia</option>
                    </select>
                    <select
                      value={module.type}
                      onChange={(e) => updateModule(index, 'type', e.target.value)}
                      className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="lesson">Lección</option>
                      <option value="quiz">Quiz</option>
                      <option value="project">Proyecto</option>
                      <option value="assignment">Tarea</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => duplicateModule(index)}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                      title="Duplicar módulo"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeModule(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      title="Eliminar módulo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Trivia Questions Section - Only show if nodeType is 'trivia' */}
                {module.nodeType === 'trivia' && (
                  <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-medium text-purple-800">Preguntas de Trivia</h4>
                      <button
                        onClick={() => addTriviaQuestion(index)}
                        className="bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700 flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Agregar Pregunta
                      </button>
                    </div>

                    {module.triviaQuestions && module.triviaQuestions.length > 0 ? (
                      <div className="space-y-4">
                        {module.triviaQuestions.map((question, qIndex) => (
                          <div key={question.id} className="bg-white p-4 border border-purple-200 rounded-lg">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                              <div className="lg:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Pregunta {qIndex + 1}
                                </label>
                                <textarea
                                  value={question.question}
                                  onChange={(e) => updateTriviaQuestion(index, qIndex, 'question', e.target.value)}
                                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                  placeholder="Escribe tu pregunta aquí..."
                                  rows={2}
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Tipo de Pregunta
                                </label>
                                <select
                                  value={question.type}
                                  onChange={(e) => updateTriviaQuestion(index, qIndex, 'type', e.target.value)}
                                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                >
                                  <option value="multiple-choice">Opción múltiple</option>
                                  <option value="true-false">Verdadero/Falso</option>
                                  <option value="type-answer">Respuesta escrita</option>
                                  <option value="multiple-select">Selección múltiple</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Tiempo Límite (segundos)
                                </label>
                                <input
                                  type="number"
                                  value={question.timeLimit}
                                  onChange={(e) => updateTriviaQuestion(index, qIndex, 'timeLimit', parseInt(e.target.value))}
                                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                  min="10"
                                  max="300"
                                />
                              </div>
                            </div>

                            {/* Options for multiple choice questions */}
                            {(question.type === 'multiple-choice' || question.type === 'multiple-select') && (
                              <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Opciones de Respuesta
                                </label>
                                <div className="space-y-2">
                                  {question.options.map((option, oIndex) => (
                                    <div key={oIndex} className="flex items-center gap-3">
                                      <div className="flex items-center">
                                        <input
                                          type={question.type === 'multiple-select' ? 'checkbox' : 'radio'}
                                          name={`question-${question.id}`}
                                          checked={
                                            question.type === 'multiple-select'
                                              ? (question.correctAnswers || []).includes(oIndex)
                                              : question.correctAnswer === oIndex
                                          }
                                          onChange={(e) => {
                                            if (question.type === 'multiple-select') {
                                              const currentAnswers = question.correctAnswers || [];
                                              const newAnswers = e.target.checked
                                                ? [...currentAnswers, oIndex]
                                                : currentAnswers.filter(a => a !== oIndex);
                                              updateTriviaQuestion(index, qIndex, 'correctAnswers', newAnswers);
                                            } else {
                                              updateTriviaQuestion(index, qIndex, 'correctAnswer', oIndex);
                                            }
                                          }}
                                          className="mr-2"
                                        />
                                        <span className="text-sm font-medium">{String.fromCharCode(65 + oIndex)}.</span>
                                      </div>
                                      <input
                                        type="text"
                                        value={option}
                                        onChange={(e) => updateQuestionOption(index, qIndex, oIndex, e.target.value)}
                                        className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                        placeholder={`Opción ${String.fromCharCode(65 + oIndex)}`}
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* True/False options */}
                            {question.type === 'true-false' && (
                              <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Respuesta Correcta
                                </label>
                                <div className="flex gap-4">
                                  <label className="flex items-center">
                                    <input
                                      type="radio"
                                      name={`question-${question.id}`}
                                      checked={question.correctAnswer === 0}
                                      onChange={() => updateTriviaQuestion(index, qIndex, 'correctAnswer', 0)}
                                      className="mr-2"
                                    />
                                    Verdadero
                                  </label>
                                  <label className="flex items-center">
                                    <input
                                      type="radio"
                                      name={`question-${question.id}`}
                                      checked={question.correctAnswer === 1}
                                      onChange={() => updateTriviaQuestion(index, qIndex, 'correctAnswer', 1)}
                                      className="mr-2"
                                    />
                                    Falso
                                  </label>
                                </div>
                              </div>
                            )}

                            {/* Type answer */}
                            {question.type === 'type-answer' && (
                              <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Respuesta Correcta
                                </label>
                                <input
                                  type="text"
                                  value={question.correctText || ''}
                                  onChange={(e) => updateTriviaQuestion(index, qIndex, 'correctText', e.target.value)}
                                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                  placeholder="Escribe la respuesta correcta..."
                                />
                              </div>
                            )}

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Puntos
                                </label>
                                <input
                                  type="number"
                                  value={question.points}
                                  onChange={(e) => updateTriviaQuestion(index, qIndex, 'points', parseInt(e.target.value))}
                                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                  min="1"
                                  max="100"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Dificultad
                                </label>
                                <select
                                  value={question.difficulty}
                                  onChange={(e) => updateTriviaQuestion(index, qIndex, 'difficulty', e.target.value)}
                                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                >
                                  <option value="easy">Fácil</option>
                                  <option value="medium">Medio</option>
                                  <option value="hard">Difícil</option>
                                </select>
                              </div>
                            </div>

                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Explicación
                              </label>
                              <textarea
                                value={question.explanation}
                                onChange={(e) => updateTriviaQuestion(index, qIndex, 'explanation', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                placeholder="Explica por qué esta es la respuesta correcta..."
                                rows={2}
                              />
                            </div>

                            <div className="flex justify-end">
                              <button
                                onClick={() => removeTriviaQuestion(index, qIndex)}
                                className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                              >
                                <Trash2 className="w-4 h-4" />
                                Eliminar Pregunta
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-purple-600">
                        <p className="mb-4">No hay preguntas de trivia todavía</p>
                        <button
                          onClick={() => addTriviaQuestion(index)}
                          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                        >
                          Crear Primera Pregunta
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {modules.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="mb-4">No hay módulos en este curso todavía</p>
                <button
                  onClick={addModule}
                  className="bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-600"
                >
                  Crear Primer Módulo
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6">
          <button
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSaveCourse}
            disabled={!isFormValid()}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            {isEditing ? 'Guardar Cambios' : 'Crear Curso'}
          </button>
        </div>
      </div>
    </div>
  );
};
