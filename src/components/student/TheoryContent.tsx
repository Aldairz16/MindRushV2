import React, { useState } from 'react';
import { 
  ArrowLeft, 
  BookOpen, 
  Play, 
  CheckCircle, 
  Clock, 
  FileText,
  Video,
  Download,
  Target,
  ArrowRight
} from 'lucide-react';
import { CourseModule, ModuleContent } from '../../data/demoCourses';

interface TheoryContentProps {
  module: CourseModule;
  onComplete: () => void;
  onBack: () => void;
}

export const TheoryContent: React.FC<TheoryContentProps> = ({ module, onComplete, onBack }) => {
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [completedContent, setCompletedContent] = useState<string[]>([]);
  
  const currentContent = module.content[currentContentIndex];
  const isLastContent = currentContentIndex === module.content.length - 1;
  const allContentCompleted = completedContent.length === module.content.length;

  const handleContentComplete = () => {
    if (!completedContent.includes(currentContent.id)) {
      setCompletedContent([...completedContent, currentContent.id]);
    }
    
    if (isLastContent) {
      // Si es el último contenido, marcar módulo como completado
      setTimeout(() => {
        onComplete();
      }, 1000);
    } else {
      // Avanzar al siguiente contenido
      setCurrentContentIndex(currentContentIndex + 1);
    }
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'text':
        return <FileText className="w-5 h-5" />;
      case 'resource':
        return <Download className="w-5 h-5" />;
      case 'interactive':
        return <Target className="w-5 h-5" />;
      default:
        return <BookOpen className="w-5 h-5" />;
    }
  };

  const renderContent = () => {
    if (!currentContent) return null;

    switch (currentContent.type) {
      case 'text':
        return (
          <div className="prose max-w-none">
            <div className="bg-white rounded-lg shadow-sm border p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">{currentContent.title}</h2>
              <div 
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: currentContent.content }}
              />
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{currentContent.title}</h2>
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-6">
              <div className="text-center">
                <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Video: {currentContent.title}</p>
                <p className="text-sm text-gray-500 mt-2">Duración: {currentContent.duration} minutos</p>
              </div>
            </div>
            <div className="text-gray-700 leading-relaxed">
              <p>{currentContent.content}</p>
            </div>
          </div>
        );

      case 'interactive':
        return (
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{currentContent.title}</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <div className="flex items-center mb-4">
                <Target className="w-8 h-8 text-blue-500 mr-3" />
                <h3 className="text-lg font-semibold text-blue-800">Actividad Interactiva</h3>
              </div>
              <p className="text-blue-700 mb-4">{currentContent.content}</p>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
                Comenzar Actividad
              </button>
            </div>
          </div>
        );

      case 'resource':
        return (
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{currentContent.title}</h2>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Download className="w-8 h-8 text-green-500 mr-3" />
                <h3 className="text-lg font-semibold text-green-800">Recurso Descargable</h3>
              </div>
              <p className="text-green-700 mb-4">{currentContent.content}</p>
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Descargar Recurso
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{currentContent.title}</h2>
            <p className="text-gray-700">{currentContent.content}</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Volver al Mapa
              </button>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-bold text-gray-800">{module.title}</h1>
            </div>
            
            {/* Progress */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <span className="text-sm text-gray-600">{module.duration} min</span>
              </div>
              <div className="text-sm text-gray-600">
                {currentContentIndex + 1} de {module.content.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 py-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-600">Progreso:</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ 
                  width: `${((currentContentIndex + (completedContent.includes(currentContent?.id) ? 1 : 0)) / module.content.length) * 100}%` 
                }}
              />
            </div>
            <span className="text-sm font-medium text-gray-700">
              {Math.round(((currentContentIndex + (completedContent.includes(currentContent?.id) ? 1 : 0)) / module.content.length) * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Content Navigation */}
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">Contenido del Nivel</h3>
          <div className="flex gap-2 overflow-x-auto">
            {module.content.map((content, index) => (
              <button
                key={content.id}
                onClick={() => setCurrentContentIndex(index)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                  index === currentContentIndex
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : completedContent.includes(content.id)
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {completedContent.includes(content.id) ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  getContentIcon(content.type)
                )}
                {content.title}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="mb-6">
          {renderContent()}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setCurrentContentIndex(Math.max(0, currentContentIndex - 1))}
            disabled={currentContentIndex === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              currentContentIndex === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Anterior
          </button>

          <div className="flex gap-3">
            {!completedContent.includes(currentContent?.id) && (
              <button
                onClick={handleContentComplete}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Marcar como Completado
              </button>
            )}

            {!isLastContent ? (
              <button
                onClick={() => setCurrentContentIndex(currentContentIndex + 1)}
                disabled={!completedContent.includes(currentContent?.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  !completedContent.includes(currentContent?.id)
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                Siguiente
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : allContentCompleted && (
              <button
                onClick={onComplete}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Completar Nivel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
