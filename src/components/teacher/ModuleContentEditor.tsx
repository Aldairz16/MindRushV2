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
  ChevronUp,
  Target,
  Image,
  List,
  Type,
  Clock,
  Award,
  Settings,
  Eye,
  Edit3,
  Copy,
  Move,
  Zap
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
  const [previewMode, setPreviewMode] = useState(false);

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

  const addContent = (type: 'text' | 'video' | 'interactive' | 'resource' = 'text') => {
    const newContent: ModuleContent = {
      id: `content-${Date.now()}`,
      type,
      title: '',
      content: '',
      duration: 10
    };
    setEditingModule(prev => ({
      ...prev,
      content: [...prev.content, newContent]
    }));
    setExpandedContent(prev => [...prev, newContent.id]);
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
    setExpandedContent(prev => prev.filter(id => id !== contentId));
  };

  const duplicateContent = (contentId: string) => {
    const originalContent = editingModule.content.find(c => c.id === contentId);
    if (originalContent) {
      const duplicatedContent = {
        ...originalContent,
        id: `content-${Date.now()}`,
        title: `${originalContent.title} (Copia)`
      };
      setEditingModule(prev => ({
        ...prev,
        content: [...prev.content, duplicatedContent]
      }));
    }
  };

  const moveContent = (contentId: string, direction: 'up' | 'down') => {
    const contentArray = [...editingModule.content];
    const index = contentArray.findIndex(c => c.id === contentId);
    
    if (direction === 'up' && index > 0) {
      [contentArray[index], contentArray[index - 1]] = [contentArray[index - 1], contentArray[index]];
    } else if (direction === 'down' && index < contentArray.length - 1) {
      [contentArray[index], contentArray[index + 1]] = [contentArray[index + 1], contentArray[index]];
    }
    
    setEditingModule(prev => ({ ...prev, content: contentArray }));
  };

  const addTriviaQuestion = (type: TriviaQuestion['type'] = 'multiple-choice') => {
    const newQuestion: TriviaQuestion = {
      id: `trivia-${Date.now()}`,
      question: '',
      type,
      options: type === 'true-false' ? ['Verdadero', 'Falso'] : ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      timeLimit: 30,
      points: 10,
      difficulty: 'medium',
      category: ''
    };

    if (type === 'multiple-select') {
      newQuestion.correctAnswers = [];
    }
    if (type === 'type-answer') {
      newQuestion.correctText = '';
    }
    if (type === 'order-sequence') {
      newQuestion.sequenceOrder = [0, 1, 2, 3];
    }

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

  const duplicateTriviaQuestion = (questionId: string) => {
    const originalQuestion = editingModule.triviaQuestions?.find(q => q.id === questionId);
    if (originalQuestion) {
      const duplicatedQuestion = {
        ...originalQuestion,
        id: `trivia-${Date.now()}`,
        question: `${originalQuestion.question} (Copia)`
      };
      setEditingModule(prev => ({
        ...prev,
        triviaQuestions: [...(prev.triviaQuestions || []), duplicatedQuestion]
      }));
    }
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'text': return FileText;
      case 'video': return Video;
      case 'interactive': return Target;
      case 'resource': return Link;
      default: return BookOpen;
    }
  };

  const getQuestionIcon = (type: string) => {
    switch (type) {
      case 'multiple-choice': return List;
      case 'true-false': return HelpCircle;
      case 'type-answer': return Type;
      case 'select-image': return Image;
      case 'order-sequence': return Move;
      case 'multiple-select': return List;
      default: return HelpCircle;
    }
  };

  const estimatedModuleDuration = editingModule.content.reduce((total, content) => total + content.duration, 0);
  const totalTriviaQuestions = editingModule.triviaQuestions?.length || 0;

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Editor de Módulo</h1>
              <p className="text-blue-100">Crea y edita contenido educativo interactivo</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-all"
            >
              <Eye className="w-4 h-4" />
              <span>{previewMode ? 'Editar' : 'Vista Previa'}</span>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <Clock className="w-6 h-6 mb-2" />
            <div className="text-lg font-bold">{estimatedModuleDuration} min</div>
            <div className="text-sm text-blue-100">Duración estimada</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <FileText className="w-6 h-6 mb-2" />
            <div className="text-lg font-bold">{editingModule.content.length}</div>
            <div className="text-sm text-blue-100">Secciones de contenido</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <Zap className="w-6 h-6 mb-2" />
            <div className="text-lg font-bold">{totalTriviaQuestions}</div>
            <div className="text-sm text-blue-100">Preguntas de trivia</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {[
            { id: 'info', label: 'Información', icon: Settings },
            { id: 'content', label: 'Contenido', icon: FileText },
            { id: 'trivia', label: 'Trivia', icon: Zap }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id as any)}
              className={`
                flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-all
                ${activeSection === id 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="p-6">
        {/* Module Information */}
        {activeSection === 'info' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título del Módulo
                </label>
                <input
                  type="text"
                  value={editingModule.title}
                  onChange={(e) => updateModuleInfo('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej. Introducción a React"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Módulo
                </label>
                <select
                  value={editingModule.nodeType}
                  onChange={(e) => updateModuleInfo('nodeType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="theory">Teoría</option>
                  <option value="trivia">Trivia</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={editingModule.description}
                onChange={(e) => updateModuleInfo('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe el contenido y objetivos de este módulo..."
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duración (minutos)
                </label>
                <input
                  type="number"
                  value={editingModule.duration}
                  onChange={(e) => updateModuleInfo('duration', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Orden
                </label>
                <input
                  type="number"
                  value={editingModule.order}
                  onChange={(e) => updateModuleInfo('order', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Lección
                </label>
                <select
                  value={editingModule.type}
                  onChange={(e) => updateModuleInfo('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="lesson">Lección</option>
                  <option value="quiz">Quiz</option>
                  <option value="project">Proyecto</option>
                  <option value="assignment">Tarea</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Content Management */}
        {activeSection === 'content' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Secciones de Contenido</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => addContent('text')}
                  className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
                >
                  <FileText className="w-4 h-4" />
                  <span>Texto</span>
                </button>
                <button
                  onClick={() => addContent('video')}
                  className="flex items-center space-x-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-all"
                >
                  <Video className="w-4 h-4" />
                  <span>Video</span>
                </button>
                <button
                  onClick={() => addContent('interactive')}
                  className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all"
                >
                  <Target className="w-4 h-4" />
                  <span>Interactivo</span>
                </button>
                <button
                  onClick={() => addContent('resource')}
                  className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-all"
                >
                  <Link className="w-4 h-4" />
                  <span>Recurso</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {editingModule.content.map((content, index) => {
                const ContentIcon = getContentIcon(content.type);
                const isExpanded = expandedContent.includes(content.id);
                
                return (
                  <div key={content.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <ContentIcon className="w-5 h-5 text-gray-600" />
                        <div>
                          <h3 className="font-medium text-gray-800">
                            {content.title || `Contenido ${index + 1}`}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {content.type} • {content.duration} min
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => moveContent(content.id, 'up')}
                          disabled={index === 0}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => moveContent(content.id, 'down')}
                          disabled={index === editingModule.content.length - 1}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => duplicateContent(content.id)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleContentExpansion(content.id)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeContent(content.id)}
                          className="p-1 text-red-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {isExpanded && (
                      <div className="p-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Título
                            </label>
                            <input
                              type="text"
                              value={content.title}
                              onChange={(e) => updateContent(content.id, 'title', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Título del contenido"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Duración (minutos)
                            </label>
                            <input
                              type="number"
                              value={content.duration}
                              onChange={(e) => updateContent(content.id, 'duration', parseInt(e.target.value))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              min="1"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {content.type === 'video' ? 'URL del Video' : 'Contenido'}
                          </label>
                          <textarea
                            value={content.content}
                            onChange={(e) => updateContent(content.id, 'content', e.target.value)}
                            rows={content.type === 'text' ? 8 : 3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder={
                              content.type === 'video' 
                                ? 'https://ejemplo.com/video.mp4' 
                                : content.type === 'resource'
                                  ? 'URL del recurso o descripción'
                                  : 'Escribe el contenido aquí...'
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Trivia Management */}
        {activeSection === 'trivia' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Preguntas de Trivia</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => addTriviaQuestion('multiple-choice')}
                  className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
                >
                  <List className="w-4 h-4" />
                  <span>Opción Múltiple</span>
                </button>
                <button
                  onClick={() => addTriviaQuestion('true-false')}
                  className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Verdadero/Falso</span>
                </button>
                <button
                  onClick={() => addTriviaQuestion('type-answer')}
                  className="flex items-center space-x-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-all"
                >
                  <Type className="w-4 h-4" />
                  <span>Texto Libre</span>
                </button>
                <button
                  onClick={() => addTriviaQuestion('multiple-select')}
                  className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-all"
                >
                  <List className="w-4 h-4" />
                  <span>Múltiple Selección</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {editingModule.triviaQuestions?.map((question, index) => {
                const QuestionIcon = getQuestionIcon(question.type);
                
                return (
                  <div key={question.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <QuestionIcon className="w-5 h-5 text-gray-600" />
                        <div>
                          <h3 className="font-medium text-gray-800">
                            Pregunta {index + 1}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {question.type} • {question.points} puntos • {question.difficulty}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => duplicateTriviaQuestion(question.id)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeTriviaQuestion(question.id)}
                          className="p-1 text-red-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Pregunta
                        </label>
                        <textarea
                          value={question.question}
                          onChange={(e) => updateTriviaQuestion(question.id, 'question', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Escribe la pregunta aquí..."
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Dificultad
                          </label>
                          <select
                            value={question.difficulty}
                            onChange={(e) => updateTriviaQuestion(question.id, 'difficulty', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="easy">Fácil</option>
                            <option value="medium">Medio</option>
                            <option value="hard">Difícil</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Puntos
                          </label>
                          <input
                            type="number"
                            value={question.points}
                            onChange={(e) => updateTriviaQuestion(question.id, 'points', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            min="1"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tiempo Límite (seg)
                          </label>
                          <input
                            type="number"
                            value={question.timeLimit}
                            onChange={(e) => updateTriviaQuestion(question.id, 'timeLimit', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            min="10"
                          />
                        </div>
                      </div>

                      {/* Options for multiple choice questions */}
                      {(question.type === 'multiple-choice' || question.type === 'multiple-select') && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Opciones de Respuesta
                          </label>
                          <div className="space-y-2">
                            {question.options.map((option, optionIndex) => (
                              <div key={optionIndex} className="flex items-center space-x-2">
                                <input
                                  type={question.type === 'multiple-select' ? 'checkbox' : 'radio'}
                                  name={`correct-${question.id}`}
                                  checked={
                                    question.type === 'multiple-select'
                                      ? question.correctAnswers?.includes(optionIndex) || false
                                      : question.correctAnswer === optionIndex
                                  }
                                  onChange={(e) => {
                                    if (question.type === 'multiple-select') {
                                      const currentAnswers = question.correctAnswers || [];
                                      const newAnswers = e.target.checked
                                        ? [...currentAnswers, optionIndex]
                                        : currentAnswers.filter(i => i !== optionIndex);
                                      updateTriviaQuestion(question.id, 'correctAnswers', newAnswers);
                                    } else {
                                      updateTriviaQuestion(question.id, 'correctAnswer', optionIndex);
                                    }
                                  }}
                                  className="mt-1"
                                />
                                <input
                                  type="text"
                                  value={option}
                                  onChange={(e) => {
                                    const newOptions = [...question.options];
                                    newOptions[optionIndex] = e.target.value;
                                    updateTriviaQuestion(question.id, 'options', newOptions);
                                  }}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  placeholder={`Opción ${optionIndex + 1}`}
                                />
                                {question.options.length > 2 && (
                                  <button
                                    onClick={() => {
                                      const newOptions = question.options.filter((_, i) => i !== optionIndex);
                                      updateTriviaQuestion(question.id, 'options', newOptions);
                                    }}
                                    className="p-2 text-red-400 hover:text-red-600"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            ))}
                            {question.options.length < 6 && (
                              <button
                                onClick={() => {
                                  const newOptions = [...question.options, ''];
                                  updateTriviaQuestion(question.id, 'options', newOptions);
                                }}
                                className="flex items-center space-x-2 text-blue-500 hover:text-blue-600"
                              >
                                <Plus className="w-4 h-4" />
                                <span>Agregar opción</span>
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* True/False questions */}
                      {question.type === 'true-false' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Respuesta Correcta
                          </label>
                          <div className="flex space-x-4">
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name={`tf-${question.id}`}
                                checked={question.correctAnswer === 0}
                                onChange={() => updateTriviaQuestion(question.id, 'correctAnswer', 0)}
                                className="mr-2"
                              />
                              Verdadero
                            </label>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name={`tf-${question.id}`}
                                checked={question.correctAnswer === 1}
                                onChange={() => updateTriviaQuestion(question.id, 'correctAnswer', 1)}
                                className="mr-2"
                              />
                              Falso
                            </label>
                          </div>
                        </div>
                      )}

                      {/* Type answer questions */}
                      {question.type === 'type-answer' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Respuesta Correcta
                          </label>
                          <input
                            type="text"
                            value={question.correctText || ''}
                            onChange={(e) => updateTriviaQuestion(question.id, 'correctText', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Respuesta exacta esperada"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Explicación
                        </label>
                        <textarea
                          value={question.explanation}
                          onChange={(e) => updateTriviaQuestion(question.id, 'explanation', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Explica por qué esta es la respuesta correcta..."
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t">
        <div className="text-sm text-gray-600">
          Última modificación: {new Date().toLocaleString()}
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSave(editingModule)}
            className="flex items-center space-x-2 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Módulo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
