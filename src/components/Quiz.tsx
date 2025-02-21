import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Question, QuizState, QuizAttempt } from '../types/quiz';
import { quizData } from '../data/quizData';
import QuizQuestion from './QuizQuestion';
import QuizResults from './QuizResults';
import QuizHistory from './QuizHistory';
import { saveQuizAttempt, getQuizAttempts } from '../services/db';
import { TrophyIcon, ClockIcon, DocumentTextIcon, ArrowPathIcon } from '@heroicons/react/24/solid';

const SECONDS_PER_QUESTION = 30;

const Quiz: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    answers: {},
    timePerQuestion: {},
    isComplete: false,
    startTime: '',
  });

  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [selectedAttempt, setSelectedAttempt] = useState<QuizAttempt | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      loadAttempts();
    }
  }, []);

  const loadAttempts = async () => {
    try {
      const loadedAttempts = await getQuizAttempts();
      setAttempts(loadedAttempts);
    } catch (error) {
      console.error('Failed to load attempts:', error);
    }
  };

  const handleStartQuiz = useCallback(() => {
    setIsStarted(true);
    setQuizState(prev => ({
      ...prev,
      startTime: new Date().toISOString()
    }));
  }, []);

  const handleAnswer = useCallback((answer: string | number, timeTaken: number) => {
    const currentQuestion = quizData[quizState.currentQuestionIndex];
    setQuizState((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [currentQuestion.id]: answer,
      },
      timePerQuestion: {
        ...prev.timePerQuestion,
        [currentQuestion.id]: timeTaken,
      },
    }));
  }, [quizState.currentQuestionIndex]);

  const handleTimeUp = useCallback(() => {
    const currentQuestion = quizData[quizState.currentQuestionIndex];
    setQuizState((prev) => ({
      ...prev,
      timePerQuestion: {
        ...prev.timePerQuestion,
        [currentQuestion.id]: SECONDS_PER_QUESTION,
      },
    }));
    handleNextQuestion();
  }, [quizState.currentQuestionIndex]);

  const handleNextQuestion = useCallback(async () => {
    const nextIndex = quizState.currentQuestionIndex + 1;
    
    if (nextIndex >= quizData.length) {
      const score = calculateScore();
      const attempt: QuizAttempt = {
        id: uuidv4(),
        date: quizState.startTime,
        score,
        totalQuestions: quizData.length,
        answers: quizState.answers,
        timePerQuestion: quizState.timePerQuestion,
      };

      try {
        await saveQuizAttempt(attempt);
        setAttempts((prev) => [...prev, attempt]);
      } catch (error) {
        console.error('Failed to save attempt:', error);
      }

      setQuizState((prev) => ({
        ...prev,
        isComplete: true,
      }));
    } else {
      setQuizState((prev) => ({
        ...prev,
        currentQuestionIndex: nextIndex,
      }));
    }
  }, [quizState.currentQuestionIndex, quizState.answers, quizState.timePerQuestion, quizState.startTime]);

  const calculateScore = useCallback(() => {
    return Object.entries(quizState.answers).reduce((score, [questionId, answer]) => {
      const question = quizData.find((q) => q.id === parseInt(questionId));
      return question?.correctAnswer === answer ? score + 1 : score;
    }, 0);
  }, [quizState.answers]);

  const handleRetry = useCallback(() => {
    setQuizState({
      currentQuestionIndex: 0,
      answers: {},
      timePerQuestion: {},
      isComplete: false,
      startTime: '',
    });
    setSelectedAttempt(null);
    setIsStarted(false);
  }, []);

  const handleViewAttempt = useCallback((attempt: QuizAttempt) => {
    setSelectedAttempt(attempt);
    setShowHistory(false);
  }, []);

  const currentQuestion = quizData[quizState.currentQuestionIndex];

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="animate-pulse">
          <div className="h-8 bg-base-300 rounded w-48 mb-6"></div>
          <div className="h-64 bg-base-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!isStarted) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center space-y-8 animate-fade-in">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Welcome to the Quiz!
          </h1>
          
          <div className="bg-base-200 p-8 rounded-xl shadow-xl mb-8 transform hover:scale-102 transition-all duration-300">
            <h2 className="text-3xl font-semibold mb-6 text-primary">Quiz Instructions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="p-4 bg-base-100 rounded-lg shadow-md">
                <ClockIcon className="w-8 h-8 text-primary mb-2" />
                <h3 className="text-lg font-semibold mb-2">Time Limit</h3>
                <p>{SECONDS_PER_QUESTION} seconds per question</p>
              </div>
              
              <div className="p-4 bg-base-100 rounded-lg shadow-md">
                <DocumentTextIcon className="w-8 h-8 text-primary mb-2" />
                <h3 className="text-lg font-semibold mb-2">Questions</h3>
                <p>{quizData.length} questions in total</p>
              </div>
              
              <div className="p-4 bg-base-100 rounded-lg shadow-md">
                <TrophyIcon className="w-8 h-8 text-primary mb-2" />
                <h3 className="text-lg font-semibold mb-2">Scoring</h3>
                <p>Instant feedback on answers</p>
              </div>
              
              <div className="p-4 bg-base-100 rounded-lg shadow-md">
                <ArrowPathIcon className="w-8 h-8 text-primary mb-2" />
                <h3 className="text-lg font-semibold mb-2">Multiple Attempts</h3>
                <p>Try again to improve your score</p>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleStartQuiz}
                className="btn btn-primary btn-lg font-bold text-lg px-12 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Start Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showHistory) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl animate-fade-in">
        <QuizHistory attempts={attempts} onViewAttempt={handleViewAttempt} />
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => {
              setShowHistory(false);
              setIsStarted(false);
            }}
            className="btn btn-primary shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Back to Start
          </button>
          {attempts.length > 0 && (
            <button
              onClick={() => setShowHistory(false)}
              className="btn btn-ghost hover:bg-base-300 transition-colors duration-300"
            >
              Take New Quiz
            </button>
          )}
        </div>
      </div>
    );
  }

  if (selectedAttempt) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl animate-fade-in">
        <QuizResults
          questions={quizData}
          attempt={selectedAttempt}
          onRetry={handleRetry}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary">Interactive Quiz</h1>
        {attempts.length > 0 && (
          <button
            onClick={() => setShowHistory(true)}
            className="btn btn-ghost hover:bg-base-300 transition-colors duration-300"
          >
            View History
          </button>
        )}
      </div>

      {quizState.isComplete ? (
        <div className="animate-fade-in">
          <QuizResults
            questions={quizData}
            attempt={{
              id: uuidv4(),
              date: quizState.startTime,
              score: calculateScore(),
              totalQuestions: quizData.length,
              answers: quizState.answers,
              timePerQuestion: quizState.timePerQuestion,
            }}
            onRetry={handleRetry}
          />
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <div className="text-lg font-medium text-base-content/70">
              Question {currentQuestion.id} of {quizData.length}
            </div>
          </div>

          <div className="relative pt-8">
            <QuizQuestion
              question={currentQuestion}
              onAnswer={handleAnswer}
              timeLimit={SECONDS_PER_QUESTION}
              onTimeUp={handleTimeUp}
              userAnswer={quizState.answers[currentQuestion.id]}
            />

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleNextQuestion}
                className="btn btn-primary shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                {quizState.currentQuestionIndex === quizData.length - 1
                  ? 'Finish Quiz'
                  : 'Next Question'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz; 