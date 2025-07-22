import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Play, 
  Lock, 
  CheckCircle, 
  Star, 
  Trophy,
  Zap,
  Target,
  BookOpen,
  Brain,
  Clock,
  Award
} from 'lucide-react';
import { Course, CourseModule } from '../../data/demoCourses';
import { TriviaNode } from './TriviaNode';
import { TheoryContent } from './TheoryContent';

interface CourseLevelMapProps {
  course: Course;
  onBack: () => void;
}

interface LevelProgress {
  [courseId: string]: {
    completedLevels: number[];
    currentLevel: number;
    totalXP: number;
  };
}

export const CourseLevelMap: React.FC<CourseLevelMapProps> = ({ course, onBack }) => {
  const [progress, setProgress] = useState<LevelProgress>(() => {
    const saved = localStorage.getItem('course-progress');
    return saved ? JSON.parse(saved) : {};
  });
  
  const [selectedModule, setSelectedModule] = useState<CourseModule | null>(null);
  const [showTrivia, setShowTrivia] = useState(false);
  const [showTheory, setShowTheory] = useState(false);

  const courseProgress = progress[course.id] || {
    completedLevels: [],
    currentLevel: 1,
    totalXP: 0
  };

  // Guardar progreso en localStorage
  useEffect(() => {
    localStorage.setItem('course-progress', JSON.stringify(progress));
  }, [progress]);

  const handleLevelComplete = (moduleId: string, xpEarned: number) => {
    const moduleIndex = course.modules.findIndex(m => m.id === moduleId);
    const levelNumber = moduleIndex + 1;

    setProgress(prev => ({
      ...prev,
      [course.id]: {
        ...prev[course.id],
        completedLevels: [...(prev[course.id]?.completedLevels || []), levelNumber],
        currentLevel: Math.max((prev[course.id]?.currentLevel || 1), levelNumber + 1),
        totalXP: (prev[course.id]?.totalXP || 0) + xpEarned
      }
    }));

    setShowTrivia(false);
    setShowTheory(false);
    setSelectedModule(null);
  };

  const isLevelUnlocked = (levelNumber: number) => {
    if (levelNumber === 1) return true;
    return courseProgress.completedLevels.includes(levelNumber - 1);
  };

  const isLevelCompleted = (levelNumber: number) => {
    return courseProgress.completedLevels.includes(levelNumber);
  };

  const handleLevelClick = (module: CourseModule, levelNumber: number) => {
    if (!isLevelUnlocked(levelNumber)) {
      return;
    }

    setSelectedModule(module);

    if (module.nodeType === 'trivia' && module.triviaQuestions) {
      setShowTrivia(true);
    } else if (module.nodeType === 'theory' && module.content) {
      setShowTheory(true);
    } else {
      alert('Este nivel no tiene contenido disponible aún');
    }
  };

  const getLevelIcon = (module: CourseModule, levelNumber: number) => {
    if (isLevelCompleted(levelNumber)) {
      return <CheckCircle className="w-8 h-8 text-white" />;
    }
    
    if (!isLevelUnlocked(levelNumber)) {
      return <Lock className="w-8 h-8 text-gray-400" />;
    }

    switch (module.nodeType) {
      case 'trivia':
        return <Brain className="w-8 h-8 text-white" />;
      case 'theory':
        return <BookOpen className="w-8 h-8 text-white" />;
      default:
        return <Play className="w-8 h-8 text-white" />;
    }
  };

  const getLevelColor = (module: CourseModule, levelNumber: number) => {
    if (isLevelCompleted(levelNumber)) {
      return 'bg-green-500 hover:bg-green-600 border-green-400';
    }
    
    if (!isLevelUnlocked(levelNumber)) {
      return 'bg-gray-300 border-gray-200 cursor-not-allowed';
    }

    if (levelNumber === courseProgress.currentLevel) {
      return 'bg-blue-500 hover:bg-blue-600 border-blue-400 ring-4 ring-blue-200 animate-pulse';
    }

    switch (module.nodeType) {
      case 'trivia':
        return 'bg-purple-500 hover:bg-purple-600 border-purple-400';
      case 'theory':
        return 'bg-indigo-500 hover:bg-indigo-600 border-indigo-400';
      default:
        return 'bg-gray-500 hover:bg-gray-600 border-gray-400';
    }
  };

  const renderLevelPath = () => {
    const levels = course.modules.map((module, index) => {
      const levelNumber = index + 1;
      const isEven = index % 2 === 0;
      
      return (
        <div key={module.id} className="relative">
          {/* Línea conectora */}
          {index < course.modules.length - 1 && (
            <div 
              className={`absolute top-20 ${isEven ? 'left-16' : 'right-16'} w-32 h-0.5 bg-gray-300 z-0`}
              style={{
                transform: isEven ? 'rotate(15deg)' : 'rotate(-15deg)',
                transformOrigin: isEven ? 'left' : 'right'
              }}
            />
          )}
          
          {/* Nodo del nivel */}
          <div 
            className={`flex flex-col items-center cursor-pointer transition-all duration-300 ${
              isEven ? 'ml-0' : 'ml-32'
            }`}
            onClick={() => handleLevelClick(module, levelNumber)}
          >
            <div 
              className={`
                relative w-16 h-16 rounded-full border-4 flex items-center justify-center
                transition-all duration-300 transform hover:scale-110 z-10
                ${getLevelColor(module, levelNumber)}
              `}
            >
              {getLevelIcon(module, levelNumber)}
              
              {/* Número de nivel */}
              <div className="absolute -top-3 -right-3 bg-white border-2 border-current rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold">
                {levelNumber}
              </div>
            </div>
            
            {/* Información del nivel */}
            <div className="mt-3 text-center max-w-32">
              <h3 className="text-sm font-semibold text-gray-800 mb-1">
                {module.title}
              </h3>
              <div className="flex items-center justify-center gap-1 text-xs text-gray-600">
                <Clock className="w-3 h-3" />
                {module.duration}min
              </div>
              {module.nodeType === 'trivia' && (
                <div className="flex items-center justify-center gap-1 text-xs text-purple-600 mt-1">
                  <Zap className="w-3 h-3" />
                  {module.triviaQuestions?.length || 0} preguntas
                </div>
              )}
            </div>
          </div>
        </div>
      );
    });

    return (
      <div className="relative py-8">
        <div className="flex flex-col gap-12">
          {levels}
        </div>
      </div>
    );
  };

  if (showTrivia && selectedModule) {
    return (
      <TriviaNode
        questions={selectedModule.triviaQuestions || []}
        onComplete={(score) => {
          const xpEarned = score * 10; // 10 XP por respuesta correcta
          handleLevelComplete(selectedModule.id, xpEarned);
        }}
        onClose={() => {
          setShowTrivia(false);
          setSelectedModule(null);
        }}
      />
    );
  }

  if (showTheory && selectedModule) {
    return (
      <TheoryContent
        module={selectedModule}
        onComplete={() => {
          const xpEarned = 50; // XP fijo por completar contenido teórico
          handleLevelComplete(selectedModule.id, xpEarned);
        }}
        onBack={() => {
          setShowTheory(false);
          setSelectedModule(null);
        }}
      />
    );
  }

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
                Volver a Cursos
              </button>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-bold text-gray-800">{course.title}</h1>
            </div>
            
            {/* Stats */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span className="font-semibold text-gray-700">
                  {courseProgress.completedLevels.length}/{course.modules.length} Niveles
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-purple-500" />
                <span className="font-semibold text-gray-700">
                  {courseProgress.totalXP} XP
                </span>
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
                  width: `${(courseProgress.completedLevels.length / course.modules.length) * 100}%` 
                }}
              />
            </div>
            <span className="text-sm font-medium text-gray-700">
              {Math.round((courseProgress.completedLevels.length / course.modules.length) * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Course Description */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <p className="text-gray-600 mb-4">{course.description}</p>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-500" />
              <span className="text-gray-600">Dificultad: <strong>{course.difficulty}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-green-500" />
              <span className="text-gray-600">Duración: <strong>{course.duration}h</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-yellow-500" />
              <span className="text-gray-600">Instructor: <strong>{course.instructor}</strong></span>
            </div>
          </div>
        </div>

        {/* Level Map */}
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Mapa de Niveles
          </h2>
          {renderLevelPath()}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-800 mb-1">¿Cómo funciona?</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Completa los niveles en orden secuencial</li>
                <li>• Gana XP respondiendo correctamente las preguntas</li>
                <li>• Desbloquea el siguiente nivel al completar el actual</li>
                <li>• Los niveles teóricos te preparan para las evaluaciones</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
