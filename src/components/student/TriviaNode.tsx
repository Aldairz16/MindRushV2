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
  VolumeX,
  Play,
  RotateCcw,
  TrendingUp,
  Award,
  HelpCircle
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

  const checkAnswer = (userSelectedAnswer?: number | number[] | string) => {
    const question = questions[currentQuestion];
    let isCorrect = false;

    switch (question.type) {
      case 'multiple-choice':
      case 'true-false':
        // Use the passed parameter or the state value
        const actualSelectedAnswer = userSelectedAnswer !== undefined ? userSelectedAnswer as number : selectedAnswer;
        isCorrect = actualSelectedAnswer === question.correctAnswer;
        break;
      case 'type-answer':
        // Use the passed parameter or the state value
        const actualTextAnswer = userSelectedAnswer !== undefined ? userSelectedAnswer as string : textAnswer;
        isCorrect = actualTextAnswer.toLowerCase().trim() === question.correctText?.toLowerCase().trim();
        break;
      case 'select-image':
        // Use the passed parameter or the state value
        const actualImageAnswer = userSelectedAnswer !== undefined ? userSelectedAnswer as number : selectedAnswer;
        isCorrect = actualImageAnswer === question.correctAnswer;
        break;
      case 'order-sequence':
        isCorrect = JSON.stringify(sequenceOrder) === JSON.stringify(question.sequenceOrder);
        break;
      case 'multiple-select':
        // Use the passed parameter or the state value
        const actualSelectedAnswers = userSelectedAnswer !== undefined ? userSelectedAnswer as number[] : selectedAnswers;
        const sortedSelected = [...actualSelectedAnswers].sort();
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
      checkAnswer(answerIndex); // Pass the answer index directly
      
      setTimeout(() => {
        nextQuestion();
      }, 4000);
    } else if (question.type === 'multiple-select') {
      const newSelected = selectedAnswers.includes(answerIndex)
        ? selectedAnswers.filter(i => i !== answerIndex)
        : [...selectedAnswers, answerIndex];
      setSelectedAnswers(newSelected);
    }
  };

  const handleMultipleSelectSubmit = () => {
    if (isAnswered || selectedAnswers.length === 0) return;
    
    setIsAnswered(true);
    setShowResult(true);
    checkAnswer(selectedAnswers);
    
    setTimeout(() => {
      nextQuestion();
    }, 4000);
  };

  const handleTextSubmit = () => {
    if (isAnswered || textAnswer.trim() === '') return;
    
    setIsAnswered(true);
    setShowResult(true);
    checkAnswer(textAnswer);
    
    setTimeout(() => {
      nextQuestion();
    }, 4000);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setSelectedAnswers([]);
      setTextAnswer('');
      setSequenceOrder([]);
      setShowResult(false);
      setIsAnswered(false);
      setTimeLeft(questions[currentQuestion + 1]?.timeLimit || 30);
      setQuestionStartTime(Date.now());
      setShowExplanation(false);
    } else {
      completeGame();
    }
  };

  const completeGame = () => {
    setGameCompleted(true);
    onComplete(score, questions.length);
  };

  const restartGame = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setSelectedAnswers([]);
    setTextAnswer('');
    setSequenceOrder([]);
    setShowResult(false);
    setIsAnswered(false);
    setScore(0);
    setTotalPoints(0);
    setStreak(0);
    setMaxStreak(0);
    setGameCompleted(false);
    setGameStarted(false);
    setAnswerResults([]);
    setTimeLeft(questions[0]?.timeLimit || 30);
    setQuestionStartTime(Date.now());
  };

  const getQuestionIcon = (type: string) => {
    switch (type) {
      case 'multiple-choice': return List;
      case 'true-false': return CheckCircle;
      case 'type-answer': return Type;
      case 'select-image': return ImageIcon;
      case 'order-sequence': return Target;
      case 'multiple-select': return List;
      default: return HelpCircle;
    }
  };

  const getScorePercentage = () => {
    return totalPoints > 0 ? Math.round((score / (totalPoints + answerResults.reduce((sum, r) => sum + r.timeBonus, 0))) * 100) : 0;
  };

  const getRankEmoji = () => {
    const percentage = getScorePercentage();
    if (percentage >= 95) return "🏆";
    if (percentage >= 85) return "🥇";
    if (percentage >= 75) return "🥈";
    if (percentage >= 65) return "🥉";
    return "🎯";
  };

  const getTimeColor = () => {
    const percentage = (timeLeft / questions[currentQuestion]?.timeLimit || 30) * 100;
    if (percentage > 50) return 'text-green-500';
    if (percentage > 25) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getAnswerColor = (index: number) => {
    if (!showResult) {
      if (selectedAnswer === index) {
        return 'bg-blue-500 text-white border-blue-600 scale-105';
      }
      if (selectedAnswers.includes(index)) {
        return 'bg-blue-100 border-blue-400 text-blue-800';
      }
      return 'bg-white hover:bg-blue-50 border-gray-300 hover:border-blue-400';
    }
    
    const question = questions[currentQuestion];
    if (index === question.correctAnswer || question.correctAnswers?.includes(index)) {
      return 'bg-green-500 text-white border-green-600';
    }
    
    if (selectedAnswer === index || selectedAnswers.includes(index)) {
      return 'bg-red-500 text-white border-red-600';
    }
    
    return 'bg-gray-100 text-gray-600 border-gray-300';
  };

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  // Game Start Screen
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600">
        <div className="flex items-center justify-between p-4 bg-black bg-opacity-20 backdrop-blur-sm">
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-all"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-all"
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center min-h-screen p-8">
          <div className="text-center max-w-2xl">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full mb-6">
                <Trophy className="w-10 h-10 text-yellow-300" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                ¡Trivia Time!
              </h1>
              <p className="text-xl text-white text-opacity-90 mb-2">
                {questions.length} preguntas te esperan
              </p>
              <p className="text-lg text-white text-opacity-75">
                Demuestra tu conocimiento y gana puntos
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6 text-white">
                <Zap className="w-8 h-8 mx-auto mb-3 text-yellow-300" />
                <h3 className="font-bold text-lg mb-2">Velocidad</h3>
                <p className="text-sm text-opacity-90">Responde rápido para ganar puntos extra</p>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6 text-white">
                <Target className="w-8 h-8 mx-auto mb-3 text-green-300" />
                <h3 className="font-bold text-lg mb-2">Precisión</h3>
                <p className="text-sm text-opacity-90">Las respuestas correctas dan más puntos</p>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6 text-white">
                <Star className="w-8 h-8 mx-auto mb-3 text-pink-300" />
                <h3 className="font-bold text-lg mb-2">Racha</h3>
                <p className="text-sm text-opacity-90">Mantén una racha para multiplicar puntos</p>
              </div>
            </div>

            <button
              onClick={startGame}
              className="bg-white text-purple-600 px-8 py-4 rounded-full text-xl font-bold hover:bg-opacity-90 transform hover:scale-105 transition-all duration-200 shadow-2xl"
            >
              <Play className="w-6 h-6 inline mr-2" />
              ¡Comenzar Trivia!
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Game Completed Screen
  if (gameCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600">
        <div className="flex items-center justify-between p-4 bg-black bg-opacity-20 backdrop-blur-sm">
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center justify-center min-h-screen p-8">
          <div className="text-center max-w-4xl">
            <div className="mb-8">
              <div className="text-8xl mb-4">{getRankEmoji()}</div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                ¡Trivia Completada!
              </h1>
              <p className="text-xl text-white text-opacity-90">
                {getScorePercentage()}% de precisión
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6 text-white">
                <Trophy className="w-8 h-8 mx-auto mb-3 text-yellow-300" />
                <div className="text-2xl font-bold">{score}</div>
                <div className="text-sm text-opacity-90">Puntos Totales</div>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6 text-white">
                <Target className="w-8 h-8 mx-auto mb-3 text-green-300" />
                <div className="text-2xl font-bold">{answerResults.filter(r => r.correct).length}/{questions.length}</div>
                <div className="text-sm text-opacity-90">Correctas</div>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6 text-white">
                <Zap className="w-8 h-8 mx-auto mb-3 text-blue-300" />
                <div className="text-2xl font-bold">{maxStreak}</div>
                <div className="text-sm text-opacity-90">Mejor Racha</div>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6 text-white">
                <TrendingUp className="w-8 h-8 mx-auto mb-3 text-pink-300" />
                <div className="text-2xl font-bold">{answerResults.reduce((sum, r) => sum + r.timeBonus, 0)}</div>
                <div className="text-sm text-opacity-90">Bonus Velocidad</div>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={restartGame}
                className="bg-white bg-opacity-20 backdrop-blur-sm text-white px-6 py-3 rounded-full font-bold hover:bg-opacity-30 transition-all"
              >
                <RotateCcw className="w-5 h-5 inline mr-2" />
                Repetir
              </button>
              <button
                onClick={onClose}
                className="bg-white text-purple-600 px-6 py-3 rounded-full font-bold hover:bg-opacity-90 transition-all"
              >
                Continuar Curso
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Game Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black bg-opacity-20 backdrop-blur-sm">
        <button
          onClick={onClose}
          className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-all"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="flex items-center space-x-6">
          <div className="text-white text-center">
            <div className="text-sm opacity-75">Pregunta</div>
            <div className="font-bold">{currentQuestion + 1}/{questions.length}</div>
          </div>
          
          <div className="text-white text-center">
            <div className="text-sm opacity-75">Puntos</div>
            <div className="font-bold text-yellow-300">{score}</div>
          </div>
          
          <div className="text-white text-center">
            <div className="text-sm opacity-75">Racha</div>
            <div className="font-bold text-orange-300">{streak}</div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-4 pb-4">
        <div className="w-full bg-black bg-opacity-20 rounded-full h-2">
          <div
            className="bg-white h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="max-w-4xl w-full">
          {/* Timer */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full mb-4 ${getTimeColor()}`}>
              <Clock className="w-8 h-8" />
            </div>
            <div className={`text-6xl font-bold ${getTimeColor()}`}>
              {timeLeft}
            </div>
            <div className="text-white text-opacity-75">segundos</div>
          </div>

          {/* Question */}
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-8 mb-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white bg-opacity-20 rounded-full mb-4">
                <HelpCircle className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                {question.question}
              </h2>
              <div className="flex items-center justify-center space-x-4 text-white text-opacity-75">
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                  {question.difficulty === 'easy' ? 'Fácil' : question.difficulty === 'medium' ? 'Medio' : 'Difícil'}
                </span>
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                  {question.points} puntos
                </span>
              </div>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={isAnswered}
                  className={`
                    p-6 rounded-xl border-2 transition-all duration-300 text-left font-medium
                    ${getAnswerColor(index)}
                    ${!isAnswered ? 'hover:scale-105 cursor-pointer transform' : 'cursor-default'}
                  `}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-current bg-opacity-20 flex items-center justify-center mr-4">
                      <span className="font-bold text-lg">{String.fromCharCode(65 + index)}</span>
                    </div>
                    <span className="flex-1 text-lg">{option}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Multiple Select Submit Button */}
            {question.type === 'multiple-select' && !isAnswered && (
              <div className="text-center mt-6">
                <button
                  onClick={handleMultipleSelectSubmit}
                  disabled={selectedAnswers.length === 0}
                  className="bg-white text-purple-600 px-8 py-3 rounded-full font-bold hover:bg-opacity-90 disabled:opacity-50 transition-all"
                >
                  Confirmar Respuestas ({selectedAnswers.length})
                </button>
              </div>
            )}

            {/* Text Answer Input */}
            {question.type === 'type-answer' && (
              <div className="mt-6">
                <div className="relative">
                  <input
                    type="text"
                    value={textAnswer}
                    onChange={(e) => setTextAnswer(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleTextSubmit()}
                    disabled={isAnswered}
                    placeholder="Escribe tu respuesta aquí..."
                    className="w-full p-4 text-xl border-2 border-white border-opacity-30 rounded-xl bg-white bg-opacity-10 text-white placeholder-white placeholder-opacity-60 focus:border-white focus:outline-none disabled:opacity-50"
                  />
                  <button
                    onClick={handleTextSubmit}
                    disabled={isAnswered || !textAnswer.trim()}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-purple-600 px-6 py-2 rounded-lg font-bold hover:bg-opacity-90 disabled:opacity-50 transition-all"
                  >
                    Enviar
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Results */}
          {showResult && (
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-8 text-center">
              <div className="mb-4">
                {answerResults[answerResults.length - 1]?.correct ? (
                  <div className="text-green-400">
                    <CheckCircle className="w-16 h-16 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold">¡Correcto!</h3>
                    <p className="text-lg">+{answerResults[answerResults.length - 1]?.points} puntos</p>
                    {answerResults[answerResults.length - 1]?.timeBonus > 0 && (
                      <p className="text-yellow-300">Bonus de velocidad: +{answerResults[answerResults.length - 1]?.timeBonus}</p>
                    )}
                  </div>
                ) : (
                  <div className="text-red-400">
                    <X className="w-16 h-16 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold">Incorrecto</h3>
                    <p className="text-lg">La respuesta correcta era: {question.options[question.correctAnswer]}</p>
                  </div>
                )}
              </div>
              
              {question.explanation && (
                <div className="bg-white bg-opacity-20 rounded-xl p-4 mt-4">
                  <p className="text-white text-opacity-90">{question.explanation}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
