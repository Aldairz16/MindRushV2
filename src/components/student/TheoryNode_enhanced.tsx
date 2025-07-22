import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  CheckCircle, 
  X, 
  Play, 
  Pause,
  ArrowRight,
  ArrowLeft,
  FileText,
  Video,
  Download,
  Clock,
  Eye,
  Bookmark,
  Share2,
  PrinterIcon,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Star,
  MessageCircle,
  Lightbulb,
  Target,
  Award
} from 'lucide-react';
import { ModuleContent } from '../../data/demoCourses';

interface TheoryNodeProps {
  title: string;
  content: ModuleContent[];
  onComplete: () => void;
  onClose: () => void;
}

export const TheoryNode: React.FC<TheoryNodeProps> = ({ title, content, onComplete, onClose }) => {
  const [currentContent, setCurrentContent] = useState(0);
  const [completedContent, setCompletedContent] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [readingTime, setReadingTime] = useState(0);
  const [textSize, setTextSize] = useState(16);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [notes, setNotes] = useState<{[key: string]: string}>({});
  const [showNotes, setShowNotes] = useState(false);
  const [currentNote, setCurrentNote] = useState('');

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isPlaying) {
      timer = setInterval(() => {
        setReadingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  useEffect(() => {
    // Auto-start reading when content loads
    setIsPlaying(true);
  }, [currentContent]);

  const handleContentComplete = (contentId: string) => {
    if (!completedContent.includes(contentId)) {
      setCompletedContent([...completedContent, contentId]);
    }
  };

  const handleNext = () => {
    const current = content[currentContent];
    handleContentComplete(current.id);
    
    if (currentContent + 1 < content.length) {
      setCurrentContent(currentContent + 1);
      setReadingTime(0);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentContent > 0) {
      setCurrentContent(currentContent - 1);
      setReadingTime(0);
    }
  };

  const toggleBookmark = (contentId: string) => {
    setBookmarks(prev => 
      prev.includes(contentId) 
        ? prev.filter(id => id !== contentId)
        : [...prev, contentId]
    );
  };

  const saveNote = (contentId: string) => {
    if (currentNote.trim()) {
      setNotes(prev => ({ ...prev, [contentId]: currentNote }));
      setCurrentNote('');
      setShowNotes(false);
    }
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'text': return FileText;
      case 'interactive': return Target;
      case 'resource': return Download;
      default: return BookOpen;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getEstimatedReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(' ').length;
    return Math.ceil(words / wordsPerMinute);
  };

  const current = content[currentContent];
  const ContentIcon = getContentIcon(current.type);
  const progress = ((currentContent + 1) / content.length) * 100;
  const isCompleted = completedContent.length === content.length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 lg:p-4">
      <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white'} rounded-xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col`}>
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-6 h-6" />
              <div>
                <h1 className="font-bold text-lg">{title}</h1>
                <p className="text-sm text-blue-100">{current.title}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setTextSize(Math.max(12, textSize - 2))}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-all"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTextSize(Math.min(24, textSize + 2))}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-all"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-all"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-4 text-sm">
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                {currentContent + 1}/{content.length}
              </span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {formatTime(readingTime)}
              </span>
              <span className="flex items-center">
                <Star className="w-4 h-4 mr-1" />
                ~{getEstimatedReadingTime(current.content)} min
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => toggleBookmark(current.id)}
                className={`p-2 rounded-full transition-all ${
                  bookmarks.includes(current.id) ? 'bg-yellow-500' : 'bg-white bg-opacity-20 hover:bg-opacity-30'
                }`}
              >
                <Bookmark className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowNotes(!showNotes)}
                className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-all"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="w-full bg-white/20 rounded-full h-3 mb-2">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-green-400 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="text-xs text-blue-100">
            {completedContent.length} de {content.length} secciones completadas • {Math.round(progress)}% del módulo
          </div>
        </div>

        {/* Content Navigation Tabs */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} px-6 py-3 border-b`}>
          <div className="flex space-x-1 overflow-x-auto">
            {content.map((item, index) => (
              <button
                key={item.id}
                onClick={() => setCurrentContent(index)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${index === currentContent 
                    ? 'bg-blue-500 text-white' 
                    : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-200'}`
                  }
                  ${completedContent.includes(item.id) ? 'ring-2 ring-green-400' : ''}
                `}
              >
                <ContentIcon className="w-4 h-4" />
                <span className="whitespace-nowrap">{item.title}</span>
                {completedContent.includes(item.id) && (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 lg:p-8">
              {/* Content Type Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <ContentIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{current.title}</h2>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Duración estimada: {current.duration} minutos
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {current.type === 'video' && (
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      <span>{isPlaying ? 'Pausar' : 'Reproducir'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Content Body */}
              <div className="prose max-w-none">
                {current.type === 'text' && (
                  <div 
                    className={`leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                    style={{ fontSize: `${textSize}px`, lineHeight: '1.7' }}
                  >
                    {current.content.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}

                {current.type === 'video' && (
                  <div className="bg-gray-900 rounded-xl p-8 text-center">
                    <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Video: {current.title}</h3>
                    <p className="text-gray-400 mb-4">URL: {current.content}</p>
                    <div className="text-sm text-gray-500">
                      En una implementación real, aquí se cargaría el reproductor de video
                    </div>
                  </div>
                )}

                {current.type === 'interactive' && (
                  <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl p-8 text-center">
                    <Target className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Actividad Interactiva</h3>
                    <p className="text-gray-700 mb-4">{current.content}</p>
                    <button className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-all">
                      Comenzar Actividad
                    </button>
                  </div>
                )}

                {current.type === 'resource' && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                    <div className="flex items-center space-x-4">
                      <Download className="w-8 h-8 text-green-600" />
                      <div className="flex-1">
                        <h3 className="font-bold text-green-800">{current.title}</h3>
                        <p className="text-green-700">{current.content}</p>
                      </div>
                      <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all">
                        Descargar
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Key Points Section */}
              <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
                <div className="flex items-center space-x-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-yellow-600" />
                  <h3 className="font-bold text-yellow-800">Puntos Clave</h3>
                </div>
                <ul className="space-y-2 text-yellow-700">
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Recuerda practicar los conceptos aprendidos</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Toma notas de los puntos más importantes</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Aplica lo aprendido en proyectos reales</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Notes Sidebar */}
          {showNotes && (
            <div className={`w-80 border-l ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} p-4`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">Mis Notas</h3>
                <button
                  onClick={() => setShowNotes(false)}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <textarea
                    value={currentNote}
                    onChange={(e) => setCurrentNote(e.target.value)}
                    placeholder="Agregar nota para esta sección..."
                    className={`w-full p-3 border rounded-lg ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300'} resize-none`}
                    rows={4}
                  />
                  <button
                    onClick={() => saveNote(current.id)}
                    className="w-full mt-2 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all"
                  >
                    Guardar Nota
                  </button>
                </div>
                
                {notes[current.id] && (
                  <div className={`p-3 border rounded-lg ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}>
                    <h4 className="font-medium mb-2">Nota guardada:</h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {notes[current.id]}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Footer */}
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border-t p-4 lg:p-6`}>
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentContent === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            <div className="text-center">
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Sección {currentContent + 1} de {content.length}
              </div>
              {completedContent.includes(current.id) && (
                <div className="flex items-center justify-center space-x-1 text-green-600 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>Completado</span>
                </div>
              )}
            </div>

            <button
              onClick={handleNext}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
            >
              <span>{currentContent === content.length - 1 ? 'Finalizar' : 'Siguiente'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {isCompleted && (
            <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded-lg text-center">
              <div className="flex items-center justify-center space-x-2 text-green-800 mb-2">
                <Award className="w-5 h-5" />
                <span className="font-bold">¡Módulo Completado!</span>
              </div>
              <p className="text-green-700 text-sm">
                Has completado todas las secciones de este módulo. ¡Excelente trabajo!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
