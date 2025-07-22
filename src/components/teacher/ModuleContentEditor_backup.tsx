import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Save,
  BookOpen,
  HelpCircle,
  Video,
  FileText,
  Monitor,
  Link,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { CourseModule, ModuleContent, TriviaQuestion } from '../../data/demoCourses';

interface ModuleContentEditorProps {
  module: CourseModule;
  onSave: (module: CourseModule) => void;
  onCancel: () => void;
}

export const ModuleContentEditor: React.FC<ModuleContentEditorProps> = ({
  module,
  onSave,
  onCancel
}) => {
  const [editingModule, setEditingModule] = useState<CourseModule>({ ...module });
  const [activeSection, setActiveSection] = useState<'info' | 'content' | 'trivia'>('info');
  const [expandedContent, setExpandedContent] = useState<string[]>([]);

  const toggleContentExpansion = (contentId: string) => {
    setExpandedContent(prev => 
      prev.includes(contentId) 
        ? prev.filter(id => id !== contentId)
        : [...prev, contentId]
    );
  };

  const updateModuleInfo = (field: keyof CourseModule, value: any) => {
    setEditingModule(prev => ({ ...prev, [field]: value }));
  };

  const addContent = () => {
    const newContent: ModuleContent = {
      id: `content-${Date.now()}`,
      type: 'text',
      title: '',
      content: '',
      duration: 10
    };
    setEditingModule(prev => ({
      ...prev,
      content: [...prev.content, newContent]
    }));
  };

  const updateContent = (contentId: string, field: keyof ModuleContent, value: any) => {
    setEditingModule(prev => ({
      ...prev,
      content: prev.content.map(c => 
        c.id === contentId ? { ...c, [field]: value } : c
      )
    }));
  };

  const removeContent = (contentId: string) => {
    setEditingModule(prev => ({
      ...prev,
      content: prev.content.filter(c => c.id !== contentId)
    }));
  };

  const addTriviaQuestion = () => {
    const newQuestion: TriviaQuestion = {
      id: `trivia-${Date.now()}`,
      question: '',
      type: 'multiple-choice',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      timeLimit: 30,
      points: 100,
      difficulty: 'medium',
      category: 'General'
    };
    setEditingModule(prev => ({
      ...prev,
      triviaQuestions: [...(prev.triviaQuestions || []), newQuestion]
    }));
  };

  const updateTriviaQuestion = (questionId: string, field: keyof TriviaQuestion, value: any) => {
    setEditingModule(prev => ({
      ...prev,
      triviaQuestions: (prev.triviaQuestions || []).map(q => 
        q.id === questionId ? { ...q, [field]: value } : q
      )
    }));
  };

  const removeTriviaQuestion = (questionId: string) => {
    setEditingModule(prev => ({
      ...prev,
      triviaQuestions: (prev.triviaQuestions || []).filter(q => q.id !== questionId)
    }));
  };

  const contentTypeIcons = {
    video: Video,
    text: FileText,
    interactive: Monitor,
    resource: Link,
    quiz: HelpCircle
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Editar Módulo</h2>
            <p className="text-gray-600 mt-1">Configure el contenido y las preguntas del módulo</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => onSave(editingModule)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveSection('info')}
          className={`px-6 py-4 font-medium transition-colors ${
            activeSection === 'info'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <BookOpen className="w-4 h-4 inline mr-2" />
          Información General
        </button>
        <button
          onClick={() => setActiveSection('content')}
          className={`px-6 py-4 font-medium transition-colors ${
            activeSection === 'content'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <FileText className="w-4 h-4 inline mr-2" />
          Contenido Teórico ({editingModule.content.length})
        </button>
        <button
          onClick={() => setActiveSection('trivia')}
          className={`px-6 py-4 font-medium transition-colors ${
            activeSection === 'trivia'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <HelpCircle className="w-4 h-4 inline mr-2" />
          Preguntas Trivia ({editingModule.triviaQuestions?.length || 0})
        </button>
      </div>

      <div className="p-6">
        {/* Module Information Section */}
        {activeSection === 'info' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título del Módulo *
                </label>
                <input
                  type="text"
                  value={editingModule.title}
                  onChange={(e) => updateModuleInfo('title', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Introducción a JavaScript"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Módulo *
                </label>
                <select
                  value={editingModule.nodeType}
                  onChange={(e) => updateModuleInfo('nodeType', e.target.value as 'theory' | 'trivia')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="theory">Contenido Teórico</option>
                  <option value="trivia">Preguntas Trivia</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duración (minutos) *
                </label>
                <input
                  type="number"
                  value={editingModule.duration}
                  onChange={(e) => updateModuleInfo('duration', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="45"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Lección
                </label>
                <select
                  value={editingModule.type}
                  onChange={(e) => updateModuleInfo('type', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="lesson">Lección</option>
                  <option value="quiz">Quiz</option>
                  <option value="project">Proyecto</option>
                  <option value="assignment">Tarea</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción del Módulo
              </label>
              <textarea
                value={editingModule.description}
                onChange={(e) => updateModuleInfo('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe qué aprenderán los estudiantes en este módulo..."
              />
            </div>
          </div>
        )}

        {/* Theory Content Section */}
        {activeSection === 'content' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Contenido Teórico</h3>
              <button
                onClick={addContent}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Contenido
              </button>
            </div>

            {editingModule.content.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">No hay contenido teórico</p>
                <p className="text-sm text-gray-500">Agrega videos, texto, ejercicios interactivos o recursos</p>
              </div>
            ) : (
              <div className="space-y-4">
                {editingModule.content.map((content, index) => {
                  const Icon = contentTypeIcons[content.type] || FileText;
                  const isExpanded = expandedContent.includes(content.id);
                  
                  return (
                    <div key={content.id} className="border border-gray-200 rounded-lg">
                      <div className="p-4 bg-gray-50 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Icon className="w-5 h-5 text-gray-600" />
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {content.title || `Contenido ${index + 1}`}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {content.type === 'video' && 'Video'}
                              {content.type === 'text' && 'Texto'}
                              {content.type === 'interactive' && 'Interactivo'}
                              {content.type === 'resource' && 'Recurso'}
                              {content.type === 'quiz' && 'Quiz'}
                              {content.duration && ` • ${content.duration} min`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleContentExpansion(content.id)}
                            className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => removeContent(content.id)}
                            className="p-2 text-red-600 hover:text-red-700 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="p-4 space-y-4">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Título
                              </label>
                              <input
                                type="text"
                                value={content.title}
                                onChange={(e) => updateContent(content.id, 'title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Título del contenido"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tipo de Contenido
                              </label>
                              <select
                                value={content.type}
                                onChange={(e) => updateContent(content.id, 'type', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              >
                                <option value="video">Video</option>
                                <option value="text">Texto</option>
                                <option value="interactive">Interactivo</option>
                                <option value="resource">Recurso</option>
                                <option value="quiz">Quiz</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Duración (minutos)
                              </label>
                              <input
                                type="number"
                                value={content.duration || ''}
                                onChange={(e) => updateContent(content.id, 'duration', parseInt(e.target.value) || 0)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="10"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Contenido (HTML soportado)
                            </label>
                            <textarea
                              value={content.content}
                              onChange={(e) => updateContent(content.id, 'content', e.target.value)}
                              rows={8}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                              placeholder="<h3>Título</h3><p>Contenido del módulo...</p><pre><code>// Código de ejemplo</code></pre>"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Puedes usar HTML para formatear el contenido. Soporta: h1-h6, p, ul, ol, li, pre, code, strong, em
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Trivia Questions Section */}
        {activeSection === 'trivia' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Preguntas de Trivia</h3>
              <button
                onClick={addTriviaQuestion}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Pregunta
              </button>
            </div>

            {(editingModule.triviaQuestions || []).length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">No hay preguntas de trivia</p>
                <p className="text-sm text-gray-500">Agrega preguntas de opción múltiple, verdadero/falso, etc.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {(editingModule.triviaQuestions || []).map((question, index) => {
                  const isExpanded = expandedContent.includes(question.id);
                  
                  return (
                    <div key={question.id} className="border border-gray-200 rounded-lg">
                      <div className="p-4 bg-purple-50 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <HelpCircle className="w-5 h-5 text-purple-600" />
                          <div>
                            <h4 className="font-medium text-gray-900">
                              Pregunta {index + 1}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {question.type === 'multiple-choice' && 'Opción múltiple'}
                              {question.type === 'true-false' && 'Verdadero/Falso'}
                              {question.type === 'type-answer' && 'Respuesta libre'}
                              • {question.points} puntos • {question.timeLimit}s
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleContentExpansion(question.id)}
                            className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => removeTriviaQuestion(question.id)}
                            className="p-2 text-red-600 hover:text-red-700 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="p-4 space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Pregunta *
                            </label>
                            <textarea
                              value={question.question}
                              onChange={(e) => updateTriviaQuestion(question.id, 'question', e.target.value)}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="Escribe tu pregunta aquí..."
                            />
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tipo de Pregunta
                              </label>
                              <select
                                value={question.type}
                                onChange={(e) => updateTriviaQuestion(question.id, 'type', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              >
                                <option value="multiple-choice">Opción Múltiple</option>
                                <option value="true-false">Verdadero/Falso</option>
                                <option value="type-answer">Respuesta Libre</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tiempo Límite (segundos)
                              </label>
                              <input
                                type="number"
                                value={question.timeLimit}
                                onChange={(e) => updateTriviaQuestion(question.id, 'timeLimit', parseInt(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="30"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Puntos
                              </label>
                              <input
                                type="number"
                                value={question.points}
                                onChange={(e) => updateTriviaQuestion(question.id, 'points', parseInt(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="100"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Dificultad
                              </label>
                              <select
                                value={question.difficulty}
                                onChange={(e) => updateTriviaQuestion(question.id, 'difficulty', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              >
                                <option value="easy">Fácil</option>
                                <option value="medium">Medio</option>
                                <option value="hard">Difícil</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Categoría
                              </label>
                              <input
                                type="text"
                                value={question.category}
                                onChange={(e) => updateTriviaQuestion(question.id, 'category', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="JavaScript, React, etc."
                              />
                            </div>
                          </div>

                          {(question.type === 'multiple-choice' || question.type === 'true-false') && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Opciones de Respuesta
                              </label>
                              <div className="space-y-2">
                                {question.options.map((option, optionIndex) => (
                                  <div key={optionIndex} className="flex items-center space-x-2">
                                    <input
                                      type="radio"
                                      name={`correct-${question.id}`}
                                      checked={question.correctAnswer === optionIndex}
                                      onChange={() => updateTriviaQuestion(question.id, 'correctAnswer', optionIndex)}
                                      className="text-purple-600"
                                    />
                                    <input
                                      type="text"
                                      value={option}
                                      onChange={(e) => {
                                        const newOptions = [...question.options];
                                        newOptions[optionIndex] = e.target.value;
                                        updateTriviaQuestion(question.id, 'options', newOptions);
                                      }}
                                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                      placeholder={`Opción ${optionIndex + 1}`}
                                    />
                                  </div>
                                ))}
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                Selecciona la opción correcta marcando el círculo correspondiente
                              </p>
                            </div>
                          )}

                          {question.type === 'type-answer' && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Respuesta Correcta
                              </label>
                              <input
                                type="text"
                                value={question.correctText || ''}
                                onChange={(e) => updateTriviaQuestion(question.id, 'correctText', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Respuesta exacta esperada"
                              />
                            </div>
                          )}

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Explicación
                            </label>
                            <textarea
                              value={question.explanation}
                              onChange={(e) => updateTriviaQuestion(question.id, 'explanation', e.target.value)}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="Explica por qué esta es la respuesta correcta..."
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
