import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Play, 
  Trophy, 
  Clock, 
  Target,
  Brain,
  Zap,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';
import { TheoryNode } from './TheoryNode';
import { TriviaNode } from './TriviaNode';
import { Course } from '../../data/demoCourses';
import { apiService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

interface CourseViewerProps {
  course: Course;
  onBack: () => void;
  onComplete?: () => void;
}

export const CourseViewer: React.FC<CourseViewerProps> = ({ course, onBack, onComplete }) => {
  const [currentModule, setCurrentModule] = useState(0);
  const [activeContent, setActiveContent] = useState<'overview' | 'theory' | 'trivia'>('overview');
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [moduleProgress, setModuleProgress] = useState<{[key: string]: number}>({});
  const [totalScore, setTotalScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const { user } = useAuth();

  useEffect(() => {
    // Load user progress for this course
    loadProgress();
  }, [course.id, user]);

  const loadProgress = async () => {
    try {
      // In a real app, this would load from the API
      const savedProgress = localStorage.getItem(`course_progress_${course.id}_${user?.id}`);
      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        setCompletedModules(progress.completedModules || []);
        setModuleProgress(progress.moduleProgress || {});
        setTotalScore(progress.totalScore || 0);
        setTotalQuestions(progress.totalQuestions || 0);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const saveProgress = async (progress: any) => {
    try {
      // Save to localStorage and potentially sync to API
      localStorage.setItem(`course_progress_${course.id}_${user?.id}`, JSON.stringify(progress));
      
      // Also try to save to API if available
      if (user) {
        await apiService.updateActivity({
          userId: user.id,
          courseId: course.id,
          type: 'progress',
          data: progress,
          completedAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const handleModuleComplete = (moduleId: string) => {
    const newCompletedModules = [...completedModules];
    if (!newCompletedModules.includes(moduleId)) {
      newCompletedModules.push(moduleId);
      setCompletedModules(newCompletedModules);
    }

    const progress = {
      completedModules: newCompletedModules,
      moduleProgress,
      totalScore,
      totalQuestions,
      lastUpdated: new Date().toISOString()
    };

    saveProgress(progress);

    // Check if course is complete
    if (newCompletedModules.length === course.modules.length) {
      onComplete?.();
    }
  };

  const handleTheoryComplete = () => {
    const module = course.modules[currentModule];
    const newProgress = { ...moduleProgress };
    newProgress[module.id] = (newProgress[module.id] || 0) + 50; // 50% for theory completion
    setModuleProgress(newProgress);
    
    if (newProgress[module.id] >= 100) {
      handleModuleComplete(module.id);
    }
    
    setActiveContent('overview');
  };

  const handleTriviaComplete = (score: number, questions: number) => {
    const module = course.modules[currentModule];
    const newProgress = { ...moduleProgress };
    const scorePercentage = (score / questions) * 50; // 50% weight for trivia
    newProgress[module.id] = (newProgress[module.id] || 0) + scorePercentage;
    setModuleProgress(newProgress);
    
    setTotalScore(totalScore + score);
    setTotalQuestions(totalQuestions + questions);

    // Save activity to API
    if (user) {
      apiService.updateActivity({
        userId: user.id,
        courseId: course.id,
        type: 'trivia',
        score: Math.round((score / questions) * 100),
        data: { score, questions, moduleId: module.id },
        completedAt: new Date().toISOString()
      }).catch(console.error);
    }
    
    if (newProgress[module.id] >= 100) {
      handleModuleComplete(module.id);
    }
    
    setActiveContent('overview');
  };

  const currentModuleData = course.modules[currentModule];
  const moduleCompletion = moduleProgress[currentModuleData?.id] || 0;
  const isModuleCompleted = completedModules.includes(currentModuleData?.id);
  const overallProgress = (completedModules.length / course.modules.length) * 100;

  // Render Theory Node
  if (activeContent === 'theory' && currentModuleData?.content) {
    return (
      <TheoryNode
        title={`${currentModuleData.title} - Teoría`}
        content={currentModuleData.content}
        onComplete={handleTheoryComplete}
        onClose={() => setActiveContent('overview')}
      />
    );
  }

  // Render Trivia Node
  if (activeContent === 'trivia' && currentModuleData?.triviaQuestions) {
    return (
      <TriviaNode
        questions={currentModuleData.triviaQuestions}
        onComplete={handleTriviaComplete}
        onClose={() => setActiveContent('overview')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Volver
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-semibold text-gray-900">{course.title}</h1>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-sm text-gray-600">
                Progreso: {Math.round(overallProgress)}%
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${overallProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Module Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Módulos del Curso</h2>
              <div className="space-y-3">
                {course.modules.map((module, index) => (
                  <button
                    key={module.id}
                    onClick={() => {
                      setCurrentModule(index);
                      setActiveContent('overview');
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      index === currentModule
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{module.title}</div>
                        <div className="text-sm text-gray-500">
                          {Math.round(moduleProgress[module.id] || 0)}% completado
                        </div>
                      </div>
                      {completedModules.includes(module.id) && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${moduleProgress[module.id] || 0}%` }}
                      ></div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border">
              {/* Module Header */}
              <div className="p-6 border-b">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {currentModuleData?.title}
                    </h1>
                    <p className="text-gray-600 mb-4">{currentModuleData?.description}</p>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {currentModuleData?.duration} min
                      </div>
                      <div className="flex items-center">
                        <Target className="w-4 h-4 mr-1" />
                        {course.difficulty}
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-1" />
                        {currentModuleData?.content?.length || 0} elementos
                      </div>
                      <div className="flex items-center">
                        <Zap className="w-4 h-4 mr-1" />
                        {currentModuleData?.triviaQuestions?.length || 0} preguntas
                      </div>
                    </div>
                  </div>
                  
                  {isModuleCompleted && (
                    <div className="flex items-center text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Completado
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="mt-6">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Progreso del módulo</span>
                    <span className="font-medium text-gray-900">{Math.round(moduleCompletion)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${moduleCompletion}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Content Actions */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Theory Button */}
                  {currentModuleData?.content && (
                    <button
                      onClick={() => setActiveContent('theory')}
                      className="p-6 border-2 border-dashed border-blue-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
                    >
                      <div className="text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                          <Brain className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Contenido Teórico</h3>
                        <p className="text-gray-600 text-sm mb-4">
                          Aprende los conceptos fundamentales de este módulo
                        </p>
                        <div className="flex items-center justify-center text-blue-600">
                          <Play className="w-4 h-4 mr-2" />
                          <span className="text-sm font-medium">Comenzar Teoría</span>
                        </div>
                      </div>
                    </button>
                  )}

                  {/* Trivia Button */}
                  {currentModuleData?.triviaQuestions && (
                    <button
                      onClick={() => setActiveContent('trivia')}
                      className="p-6 border-2 border-dashed border-purple-300 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all group"
                    >
                      <div className="text-center">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                          <Zap className="w-6 h-6 text-purple-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Trivia Interactiva</h3>
                        <p className="text-gray-600 text-sm mb-4">
                          Pon a prueba tus conocimientos con preguntas dinámicas
                        </p>
                        <div className="flex items-center justify-center text-purple-600">
                          <Trophy className="w-4 h-4 mr-2" />
                          <span className="text-sm font-medium">Iniciar Trivia</span>
                        </div>
                      </div>
                    </button>
                  )}
                </div>

                {/* Module Objectives */}
                {course.objectives && (
                  <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Objetivos de Aprendizaje</h3>
                    <ul className="space-y-2">
                      {course.objectives.map((objective: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <Target className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Progress Stats */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">{Math.round(overallProgress)}%</div>
                    <div className="text-sm text-blue-700">Progreso Total</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">{completedModules.length}</div>
                    <div className="text-sm text-green-700">Módulos Completados</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0}%
                    </div>
                    <div className="text-sm text-purple-700">Puntuación Promedio</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
