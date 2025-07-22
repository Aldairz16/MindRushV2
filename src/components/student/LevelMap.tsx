import React, { useState } from 'react';
import { 
  Star, 
  Lock, 
  Play, 
  Trophy, 
  CheckCircle, 
  Circle,
  Zap,
  Target,
  BookOpen,
  Crown,
  Gem,
  Users
} from 'lucide-react';

interface Level {
  id: number;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  isUnlocked: boolean;
  isCompleted: boolean;
  currentProgress: number;
  totalLessons: number;
  xpReward: number;
  category: string;
  estimatedTime: string;
  prerequisite?: number;
}

export const LevelMap: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);

  const levels: Level[] = [
    {
      id: 1,
      title: "Introducción a la Programación",
      description: "Conceptos básicos de programación y lógica computacional",
      difficulty: 'easy',
      isUnlocked: true,
      isCompleted: true,
      currentProgress: 8,
      totalLessons: 8,
      xpReward: 100,
      category: "Fundamentos",
      estimatedTime: "2 horas"
    },
    {
      id: 2,
      title: "Variables y Tipos de Datos",
      description: "Aprende a almacenar y manipular información",
      difficulty: 'easy',
      isUnlocked: true,
      isCompleted: true,
      currentProgress: 6,
      totalLessons: 6,
      xpReward: 120,
      category: "Fundamentos",
      estimatedTime: "1.5 horas",
      prerequisite: 1
    },
    {
      id: 3,
      title: "Estructuras de Control",
      description: "Condicionales, bucles y control de flujo",
      difficulty: 'easy',
      isUnlocked: true,
      isCompleted: false,
      currentProgress: 3,
      totalLessons: 10,
      xpReward: 150,
      category: "Fundamentos",
      estimatedTime: "3 horas",
      prerequisite: 2
    },
    {
      id: 4,
      title: "Funciones y Procedimientos",
      description: "Organiza tu código con funciones reutilizables",
      difficulty: 'medium',
      isUnlocked: true,
      isCompleted: false,
      currentProgress: 0,
      totalLessons: 12,
      xpReward: 200,
      category: "Intermedio",
      estimatedTime: "4 horas",
      prerequisite: 3
    },
    {
      id: 5,
      title: "Arrays y Listas",
      description: "Manejo de colecciones de datos",
      difficulty: 'medium',
      isUnlocked: false,
      isCompleted: false,
      currentProgress: 0,
      totalLessons: 8,
      xpReward: 180,
      category: "Intermedio",
      estimatedTime: "3 horas",
      prerequisite: 4
    },
    {
      id: 6,
      title: "Programación Orientada a Objetos",
      description: "Clases, objetos y encapsulación",
      difficulty: 'medium',
      isUnlocked: false,
      isCompleted: false,
      currentProgress: 0,
      totalLessons: 15,
      xpReward: 250,
      category: "Intermedio",
      estimatedTime: "5 horas",
      prerequisite: 5
    },
    {
      id: 7,
      title: "Algoritmos de Búsqueda",
      description: "Búsqueda lineal, binaria y algoritmos eficientes",
      difficulty: 'hard',
      isUnlocked: false,
      isCompleted: false,
      currentProgress: 0,
      totalLessons: 10,
      xpReward: 300,
      category: "Avanzado",
      estimatedTime: "4 horas",
      prerequisite: 6
    },
    {
      id: 8,
      title: "Algoritmos de Ordenamiento",
      description: "Bubble sort, merge sort, quick sort y más",
      difficulty: 'hard',
      isUnlocked: false,
      isCompleted: false,
      currentProgress: 0,
      totalLessons: 12,
      xpReward: 350,
      category: "Avanzado",
      estimatedTime: "5 horas",
      prerequisite: 7
    },
    {
      id: 9,
      title: "Estructuras de Datos Avanzadas",
      description: "Árboles, grafos y estructuras complejas",
      difficulty: 'expert',
      isUnlocked: false,
      isCompleted: false,
      currentProgress: 0,
      totalLessons: 20,
      xpReward: 500,
      category: "Experto",
      estimatedTime: "8 horas",
      prerequisite: 8
    },
    {
      id: 10,
      title: "Proyecto Final",
      description: "Aplicación completa usando todos los conceptos",
      difficulty: 'expert',
      isUnlocked: false,
      isCompleted: false,
      currentProgress: 0,
      totalLessons: 1,
      xpReward: 1000,
      category: "Proyecto",
      estimatedTime: "10 horas",
      prerequisite: 9
    }
  ];

  const getDifficultyConfig = (difficulty: string) => {
    const configs = {
      easy: {
        color: 'from-green-400 to-green-600',
        borderColor: 'border-green-500',
        bgColor: 'bg-green-500',
        textColor: 'text-green-600',
        icon: Circle
      },
      medium: {
        color: 'from-blue-400 to-blue-600',
        borderColor: 'border-blue-500',
        bgColor: 'bg-blue-500',
        textColor: 'text-blue-600',
        icon: Target
      },
      hard: {
        color: 'from-purple-400 to-purple-600',
        borderColor: 'border-purple-500',
        bgColor: 'bg-purple-500',
        textColor: 'text-purple-600',
        icon: Zap
      },
      expert: {
        color: 'from-red-400 to-red-600',
        borderColor: 'border-red-500',
        bgColor: 'bg-red-500',
        textColor: 'text-red-600',
        icon: Crown
      }
    };
    return configs[difficulty as keyof typeof configs] || configs.easy;
  };

  const handleLevelClick = (level: Level) => {
    if (level.isUnlocked) {
      setSelectedLevel(level);
    }
  };

  const renderLevel = (level: Level, position: { x: number; y: number }) => {
    const config = getDifficultyConfig(level.difficulty);
    const IconComponent = config.icon;
    const isCurrentLevel = level.currentProgress > 0 && level.currentProgress < level.totalLessons;
    
    return (
      <div
        key={level.id}
        className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
        style={{ left: `${position.x}%`, top: `${position.y}%` }}
        onClick={() => handleLevelClick(level)}
      >
        {/* Connection Line to Previous Level */}
        {level.prerequisite && (
          <div className={`absolute w-1 h-20 ${level.isUnlocked ? 'bg-green-300' : 'bg-gray-300'} -top-20 left-1/2 transform -translate-x-1/2`} />
        )}
        
        {/* Level Node */}
        <div className={`
          relative w-20 h-20 rounded-full border-4 transition-all duration-300 hover:scale-110
          ${level.isUnlocked 
            ? level.isCompleted 
              ? 'border-gold bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg' 
              : isCurrentLevel
                ? `${config.borderColor} bg-gradient-to-br ${config.color} shadow-lg ring-4 ring-blue-200`
                : `${config.borderColor} bg-gradient-to-br ${config.color} shadow-md`
            : 'border-gray-400 bg-gray-300 opacity-60'
          }
        `}>
          {/* Level Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            {level.isCompleted ? (
              <CheckCircle className="w-8 h-8 text-white" />
            ) : level.isUnlocked ? (
              isCurrentLevel ? (
                <Play className="w-8 h-8 text-white" />
              ) : (
                <IconComponent className="w-6 h-6 text-white" />
              )
            ) : (
              <Lock className="w-6 h-6 text-gray-500" />
            )}
          </div>

          {/* Level Number */}
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs font-bold text-gray-700 shadow-md">
            {level.id}
          </div>

          {/* Progress Ring for Current Level */}
          {isCurrentLevel && (
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="35%"
                fill="none"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="3"
              />
              <circle
                cx="50%"
                cy="50%"
                r="35%"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeDasharray={`${(level.currentProgress / level.totalLessons) * 2 * Math.PI * 14} ${2 * Math.PI * 14}`}
                strokeLinecap="round"
              />
            </svg>
          )}

          {/* Completion Stars */}
          {level.isCompleted && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <div className="flex space-x-1">
                {[1, 2, 3].map((star) => (
                  <Star key={star} className="w-3 h-3 text-yellow-300 fill-current" />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Level Title */}
        <div className="mt-2 text-center">
          <div className="text-xs font-semibold text-gray-800 max-w-20 mx-auto leading-tight">
            {level.title.split(' ').slice(0, 2).join(' ')}
          </div>
        </div>
      </div>
    );
  };

  // Define positions for the zigzag path
  const levelPositions = [
    { x: 50, y: 90 },  // Level 1 - Bottom center
    { x: 25, y: 80 },  // Level 2 - Left
    { x: 75, y: 70 },  // Level 3 - Right
    { x: 35, y: 60 },  // Level 4 - Left
    { x: 65, y: 50 },  // Level 5 - Right
    { x: 40, y: 40 },  // Level 6 - Left
    { x: 60, y: 30 },  // Level 7 - Right
    { x: 45, y: 20 },  // Level 8 - Left
    { x: 55, y: 10 },  // Level 9 - Right
    { x: 50, y: 5 },   // Level 10 - Top center (Boss)
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl lg:text-3xl font-bold mb-2">Mapa de Aprendizaje</h1>
        <p className="text-indigo-100">Avanza por los niveles y domina la programación paso a paso</p>
      </div>

      {/* Progress Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <span className="text-2xl font-bold text-gray-800">
              {levels.filter(l => l.isCompleted).length}
            </span>
          </div>
          <p className="text-sm text-gray-600">Niveles Completados</p>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <Play className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold text-gray-800">
              {levels.find(l => l.currentProgress > 0 && l.currentProgress < l.totalLessons)?.id || '-'}
            </span>
          </div>
          <p className="text-sm text-gray-600">Nivel Actual</p>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <Zap className="w-8 h-8 text-purple-500" />
            <span className="text-2xl font-bold text-gray-800">
              {levels.filter(l => l.isCompleted).reduce((sum, l) => sum + l.xpReward, 0)}
            </span>
          </div>
          <p className="text-sm text-gray-600">XP Ganado</p>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-8 h-8 text-green-500" />
            <span className="text-2xl font-bold text-gray-800">
              {levels.filter(l => l.isUnlocked).length}
            </span>
          </div>
          <p className="text-sm text-gray-600">Niveles Desbloqueados</p>
        </div>
      </div>

      {/* Level Map */}
      <div className="bg-gradient-to-b from-blue-50 to-indigo-100 rounded-xl p-6 relative min-h-96 lg:min-h-[600px]">
        <div className="relative w-full h-full">
          {levels.map((level, index) => 
            renderLevel(level, levelPositions[index])
          )}
        </div>
      </div>

      {/* Level Details Modal */}
      {selectedLevel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getDifficultyConfig(selectedLevel.difficulty).color} flex items-center justify-center`}>
                  <span className="text-white font-bold">{selectedLevel.id}</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{selectedLevel.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyConfig(selectedLevel.difficulty).textColor} bg-gray-100`}>
                    {selectedLevel.category}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedLevel(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <p className="text-gray-600 mb-4">{selectedLevel.description}</p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Progreso</span>
                <span className="font-medium">{selectedLevel.currentProgress}/{selectedLevel.totalLessons} lecciones</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full bg-gradient-to-r ${getDifficultyConfig(selectedLevel.difficulty).color}`}
                  style={{ width: `${(selectedLevel.currentProgress / selectedLevel.totalLessons) * 100}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span>{selectedLevel.xpReward} XP</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-blue-500" />
                  <span>{selectedLevel.estimatedTime}</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              {selectedLevel.currentProgress === 0 ? (
                <button className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-colors">
                  Comenzar Nivel
                </button>
              ) : selectedLevel.isCompleted ? (
                <button className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-colors">
                  Revisar Nivel
                </button>
              ) : (
                <button className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-600 hover:to-purple-700 transition-colors">
                  Continuar
                </button>
              )}
              <button 
                onClick={() => setSelectedLevel(null)}
                className="px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
