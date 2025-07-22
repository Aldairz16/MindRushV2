import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  CheckCircle, 
  X, 
  Trophy, 
  Target,
  Zap,
  Star,
  ArrowRight,
  Type,
  Image as ImageIcon,
  List,
  AlertCircle,
  Volume2,
  Play,
  Pause,
  RotateCcw,
  TrendingUp,
  Award,
  Eye,
  EyeOff
} from 'lucide-react';
import { TriviaQuestion } from '../../data/demoCourses';

interface TriviaNodeProps {
  questions: TriviaQuestion[];
  onComplete: (score: number, totalQuestions: number) => void;
  onClose: () => void;
}

export const TriviaNode: React.FC<TriviaNodeProps> = ({ questions, onComplete, onClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [textAnswer, setTextAnswer] = useState('');
  const [sequenceOrder, setSequenceOrder] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [timeLeft, setTimeLeft] = useState(questions[0]?.timeLimit || 30);
  const [isAnswered, setIsAnswered] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [showExplanation, setShowExplanation] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [answerResults, setAnswerResults] = useState<{correct: boolean, points: number, timeBonus: number}[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !isAnswered) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isAnswered && gameStarted) {
      handleTimeUp();
    }
  }, [timeLeft, isAnswered, gameStarted]);

  const startGame = () => {
    setGameStarted(true);
    setQuestionStartTime(Date.now());
  };

  const playSound = (type: 'correct' | 'incorrect' | 'countdown') => {
    if (!soundEnabled) return;
    // In a real app, you would play actual sound files here
    console.log(`Playing ${type} sound`);
  };

  const handleTimeUp = () => {
    setIsAnswered(true);
    setShowResult(true);
    setStreak(0);
    playSound('incorrect');
    
    const result = { correct: false, points: 0, timeBonus: 0 };
    setAnswerResults(prev => [...prev, result]);
    
    setTimeout(() => {
      nextQuestion();
    }, 4000);
  };

  const checkAnswer = () => {
    const question = questions[currentQuestion];
    let isCorrect = false;

    switch (question.type) {
      case 'multiple-choice':
      case 'true-false':
        isCorrect = selectedAnswer === question.correctAnswer;
        break;
      case 'type-answer':
        isCorrect = textAnswer.toLowerCase().trim() === question.correctText?.toLowerCase().trim();
        break;
      case 'select-image':
        isCorrect = selectedAnswer === question.correctAnswer;
        break;
      case 'order-sequence':
        isCorrect = JSON.stringify(sequenceOrder) === JSON.stringify(question.sequenceOrder);
        break;
      case 'multiple-select':
        const sortedSelected = [...selectedAnswers].sort();
        const sortedCorrect = [...(question.correctAnswers || [])].sort();
        isCorrect = JSON.stringify(sortedSelected) === JSON.stringify(sortedCorrect);
        break;
    }

    // Calculate points with enhanced scoring system
    let points = 0;
    let timeBonus = 0;
    
    if (isCorrect) {
      const timeTaken = (Date.now() - questionStartTime) / 1000;
      const timeRatio = Math.max(0, (question.timeLimit - timeTaken) / question.timeLimit);
      timeBonus = Math.floor(timeRatio * 500); // Up to 500 bonus points for speed
      
      const difficultyMultiplier = question.difficulty === 'easy' ? 1 : question.difficulty === 'medium' ? 1.5 : 2;
      const streakMultiplier = 1 + (streak * 0.1); // 10% bonus per streak
      
      points = Math.floor((question.points + timeBonus) * difficultyMultiplier * streakMultiplier);
      
      setScore(score + points);
      setStreak(streak + 1);
      setMaxStreak(Math.max(maxStreak, streak + 1));
      playSound('correct');
    } else {
      setStreak(0);
      playSound('incorrect');
    }

    const result = { correct: isCorrect, points, timeBonus };
    setAnswerResults(prev => [...prev, result]);
    setTotalPoints(totalPoints + question.points);

    return isCorrect;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered) return;
    
    const question = questions[currentQuestion];
    
    if (question.type === 'multiple-choice' || question.type === 'true-false' || question.type === 'select-image') {
      setSelectedAnswer(answerIndex);
      setIsAnswered(true);
      setShowResult(true);
      checkAnswer();
      
      setTimeout(() => {
        nextQuestion();
      }, 3000);
    }
  };

  const handleTextSubmit = () => {
    if (isAnswered || !textAnswer.trim()) return;
    
    setIsAnswered(true);
    setShowResult(true);
    checkAnswer();
    
    setTimeout(() => {
      nextQuestion();
    }, 3000);
  };

  const handleSequenceReorder = (dragIndex: number, hoverIndex: number) => {
    const newOrder = [...sequenceOrder];
    const draggedItem = newOrder[dragIndex];
    newOrder.splice(dragIndex, 1);
    newOrder.splice(hoverIndex, 0, draggedItem);
    setSequenceOrder(newOrder);
  };

  const submitSequence = () => {
    if (isAnswered) return;
    
    setIsAnswered(true);
    setShowResult(true);
    checkAnswer();
    
    setTimeout(() => {
      nextQuestion();
    }, 3000);
  };

  const nextQuestion = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setSelectedAnswers([]);
      setTextAnswer('');
      setSequenceOrder([...Array(questions[currentQuestion + 1].options.length)].map((_, i) => i));
      setShowResult(false);
      setIsAnswered(false);
      setTimeLeft(questions[currentQuestion + 1].timeLimit);
    } else {
      setGameCompleted(true);
    }
  };

  const getAnswerColor = (index: number, questionType: string) => {
    if (!showResult) {
      if (questionType === 'order-sequence') {
        return 'bg-white border-2 border-gray-300 hover:border-blue-500';
      }
      return selectedAnswer === index ? 'bg-blue-500 text-white' : 'bg-white hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-300';
    }
    
    const question = questions[currentQuestion];
    if (index === question.correctAnswer) {
      return 'bg-green-500 text-white border-2 border-green-600';
    }
    
    if (selectedAnswer === index && index !== question.correctAnswer) {
      return 'bg-red-500 text-white border-2 border-red-600';
    }
    
    return 'bg-gray-100 text-gray-600 border-2 border-gray-300';
  };

  const getTimeColor = () => {
    const percentage = (timeLeft / questions[currentQuestion].timeLimit) * 100;
    if (percentage > 50) return 'text-green-600';
    if (percentage > 25) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getQuestionIcon = (type: string) => {
    switch (type) {
      case 'multiple-choice': return Target;
      case 'true-false': return CheckCircle;
      case 'type-answer': return Type;
      case 'select-image': return ImageIcon;
      case 'order-sequence': return List;
      default: return Target;
    }
  };

  const renderQuestion = () => {
    const question = questions[currentQuestion];
    const QuestionIcon = getQuestionIcon(question.type);

    switch (question.type) {
      case 'multiple-choice':
      case 'true-false':
      case 'select-image':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4 mb-6">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={isAnswered}
                className={`p-3 lg:p-4 rounded-lg transition-all duration-200 text-left font-medium text-sm lg:text-base ${getAnswerColor(index, question.type)} ${
                  !isAnswered ? 'hover:scale-105 cursor-pointer transform' : 'cursor-default'
                }`}
              >
                <div className="flex items-center">
                  <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-current bg-opacity-20 flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="font-bold text-xs lg:text-sm">{String.fromCharCode(65 + index)}</span>
                  </div>
                  <span className="flex-1">{option}</span>
                </div>
              </button>
            ))}
          </div>
        );

      case 'type-answer':
        return (
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTextSubmit()}
                disabled={isAnswered}
                placeholder="Escribe tu respuesta aquí..."
                className="w-full p-4 lg:p-6 text-lg lg:text-xl border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none disabled:bg-gray-100 text-center font-medium"
              />
              <button
                onClick={handleTextSubmit}
                disabled={isAnswered || !textAnswer.trim()}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-lg font-medium text-sm lg:text-base"
              >
                Enviar
              </button>
            </div>
          </div>
        );

      case 'order-sequence':
        return (
          <div className="mb-6">
            <div className="grid grid-cols-1 gap-3 mb-4">
              {sequenceOrder.map((optionIndex, position) => (
                <div
                  key={position}
                  className={`p-3 lg:p-4 rounded-lg cursor-move ${getAnswerColor(position, question.type)} flex items-center`}
                  draggable={!isAnswered}
                  onDragStart={(e) => e.dataTransfer.setData('text/plain', position.toString())}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const dragPosition = parseInt(e.dataTransfer.getData('text/plain'));
                    handleSequenceReorder(dragPosition, position);
                  }}
                >
                  <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3 font-bold text-sm lg:text-base">
                    {position + 1}
                  </div>
                  <span className="flex-1 font-medium text-sm lg:text-base">{question.options[optionIndex]}</span>
                  <div className="text-gray-400">
                    <List className="w-4 h-4 lg:w-5 lg:h-5" />
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={submitSequence}
              disabled={isAnswered}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white py-3 lg:py-4 rounded-lg font-semibold text-sm lg:text-base"
            >
              Confirmar Orden
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  if (gameCompleted) {
    const totalPoints = questions.reduce((total, q) => total + q.points, 0);
    const percentage = Math.round((score / totalPoints) * 100);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 lg:p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 lg:p-8 text-center">
          <div className="mb-6">
            <Trophy className="w-12 h-12 lg:w-16 lg:h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-2">¡Trivia Completada!</h2>
            <p className="text-gray-600 text-sm lg:text-base">Has terminado todas las preguntas</p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 lg:p-6 rounded-lg mb-6">
            <div className="text-2xl lg:text-3xl font-bold text-blue-600 mb-2">{score} puntos</div>
            <div className="text-base lg:text-lg text-gray-700 mb-2">{percentage}% de acierto</div>
            <div className="text-sm text-gray-600 mb-2">
              {currentQuestion + 1} de {questions.length} preguntas respondidas
            </div>
            <div className="flex items-center justify-center text-sm text-purple-600">
              <Zap className="w-4 h-4 mr-1" />
              Racha máxima: {maxStreak}
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 lg:py-3 rounded-lg font-medium text-sm lg:text-base"
            >
              Cerrar
            </button>
            <button
              onClick={() => onComplete(score, questions.length)}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 lg:py-3 rounded-lg font-medium flex items-center justify-center text-sm lg:text-base"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Continuar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const QuestionIcon = getQuestionIcon(question.type);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 lg:p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full overflow-hidden max-h-[95vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <QuestionIcon className="w-5 h-5 lg:w-6 lg:h-6 mr-2" />
              <span className="font-semibold text-sm lg:text-base">
                {question.type === 'multiple-choice' && 'Selección Múltiple'}
                {question.type === 'true-false' && 'Verdadero o Falso'}
                {question.type === 'type-answer' && 'Respuesta Libre'}
                {question.type === 'select-image' && 'Seleccionar Imagen'}
                {question.type === 'order-sequence' && 'Ordenar Secuencia'}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 p-1"
            >
              <X className="w-4 h-4 lg:w-5 lg:h-5" />
            </button>
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs lg:text-sm">
              Pregunta {currentQuestion + 1} de {questions.length}
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Zap className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                <span className="text-xs lg:text-sm">Racha: {streak}</span>
              </div>
              <div className={`flex items-center font-bold text-sm lg:text-base ${getTimeColor()}`}>
                <Clock className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                {timeLeft}s
              </div>
            </div>
          </div>
          
          <div className="w-full bg-white/20 rounded-full h-2 mt-3">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="p-6 lg:p-8 overflow-y-auto max-h-[calc(95vh-200px)]">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6 lg:mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                  question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {question.difficulty === 'easy' ? 'Fácil' : 
                   question.difficulty === 'medium' ? 'Medio' : 'Difícil'}
                </span>
                <div className="flex items-center text-sm text-gray-600">
                  <Star className="w-4 h-4 mr-1" />
                  {question.points} puntos
                </div>
              </div>
              <h2 className="text-lg lg:text-xl font-bold text-gray-800 mb-2">{question.question}</h2>
              <div className="text-xs lg:text-sm text-gray-500">{question.category}</div>
            </div>

            {renderQuestion()}

            {/* Explanation */}
            {showResult && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 lg:p-6 animate-fadeIn">
                <div className="flex items-start">
                  <div className="bg-blue-500 p-2 rounded-full mr-3 flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-blue-800 mb-1">Explicación:</div>
                    <p className="text-blue-700 text-sm lg:text-base">{question.explanation}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};