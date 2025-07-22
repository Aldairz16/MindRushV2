import React, { useState } from 'react';
import { 
  BookOpen, 
  CheckCircle, 
  X, 
  Play, 
  Pause,
  ArrowRight,
  FileText,
  Video,
  Download,
  Clock
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
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentContent > 0) {
      setCurrentContent(currentContent - 1);
    }
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'text': return FileText;
      case 'resource': return Download;
      default: return BookOpen;
    }
  };

  const current = content[currentContent];
  const ContentIcon = getContentIcon(current.type);
  const progress = ((currentContent + 1) / content.length) * 100;
  const isCompleted = completedContent.length === content.length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 lg:p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <BookOpen className="w-5 h-5 lg:w-6 lg:h-6 mr-2" />
              <span className="font-semibold text-sm lg:text-base">{title}</span>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 p-1"
            >
              <X className="w-4 h-4 lg:w-5 lg:h-5" />
            </button>
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm">
              Contenido {currentContent + 1} de {content.length}
            </div>
            <div className="text-sm">
              {completedContent.length} de {content.length} completados
            </div>
          </div>
          
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Content Navigation */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center space-x-4 overflow-x-auto">
            {content.map((item, index) => (
              <button
                key={item.id}
                onClick={() => setCurrentContent(index)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg whitespace-nowrap ${
                  index === currentContent 
                    ? 'bg-blue-100 text-blue-700' 
                    : completedContent.includes(item.id)
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-current bg-opacity-20 flex items-center justify-center">
                  {completedContent.includes(item.id) ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <span className="text-xs font-bold">{index + 1}</span>
                  )}
                </div>
                <span className="text-sm font-medium">{item.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <ContentIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{current.title}</h2>
                {current.duration && (
                  <div className="flex items-center text-gray-600 mt-1">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="text-sm">{current.duration} minutos</span>
                  </div>
                )}
              </div>
            </div>

            {/* Content Display */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              {current.type === 'video' && (
                <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-4 transition-all"
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8 text-white" />
                    ) : (
                      <Play className="w-8 h-8 text-white" />
                    )}
                  </button>
                </div>
              )}
              
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">{current.content}</p>
              </div>

              {current.resources && current.resources.length > 0 && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-3">Recursos adicionales:</h4>
                  <div className="space-y-2">
                    {current.resources.map((resource, index) => (
                      <div key={index} className="flex items-center text-blue-700">
                        <Download className="w-4 h-4 mr-2" />
                        <span className="text-sm">{resource}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Progress Indicator */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progreso del módulo</span>
                <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentContent === 0}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
              Anterior
            </button>

            <div className="text-sm text-gray-600">
              {currentContent + 1} de {content.length}
            </div>

            {currentContent + 1 === content.length ? (
              <button
                onClick={handleNext}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg flex items-center font-medium"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {isCompleted ? 'Finalizar' : 'Completar'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center font-medium"
              >
                Siguiente
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};