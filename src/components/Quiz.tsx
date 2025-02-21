import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Question, QuizState, QuizAttempt } from '../types/quiz';
import { quizData } from '../data/quizData';
import QuizQuestion from './QuizQuestion';
import QuizResults from './QuizResults';
import QuizHistory from './QuizHistory';
import { saveQuizAttempt, getQuizAttempts } from '../services/db';

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

  const handleAnswer = useCallback((answer: string | number) => {
    setQuizState((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [quizData[prev.currentQuestionIndex].id]: answer,
      },
    }));
  }, []);

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
      const currentQuestion = quizData[quizState.currentQuestionIndex];
      const timeSpent = SECONDS_PER_QUESTION - (quizState.timePerQuestion[currentQuestion.id] || 0);
      
      setQuizState((prev) => ({
        ...prev,
        currentQuestionIndex: nextIndex,
        timePerQuestion: {
          ...prev.timePerQuestion,
          [currentQuestion.id]: timeSpent,
        },
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
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-6">Welcome to the Quiz!</h1>
          <div className="bg-base-200 p-8 rounded-lg shadow-lg mb-8">
            <h2 className="text-2xl font-semibold mb-4">Quiz Instructions</h2>
            <ul className="text-left space-y-2 mb-6">
              <li>• You will have {SECONDS_PER_QUESTION} seconds for each question</li>
              <li>• There are {quizData.length} questions in total</li>
              <li>• You can't go back to previous questions</li>
              <li>• Your score and time will be recorded</li>
              <li>• You can view your attempt history</li>
            </ul>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleStartQuiz}
                className="btn btn-primary btn-lg"
              >
                Start Quiz
              </button>
              <button
                onClick={() => setShowHistory(true)}
                className="btn btn-ghost btn-lg"
              >
                View History
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showHistory) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <QuizHistory attempts={attempts} onViewAttempt={handleViewAttempt} />
        <button
          onClick={() => {
            setShowHistory(false);
            setIsStarted(false);
          }}
          className="btn btn-primary mt-4"
        >
          Back to Start
        </button>
      </div>
    );
  }

  if (selectedAttempt) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <QuizResults
          questions={quizData}
          attempt={selectedAttempt}
          onRetry={handleRetry}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Interactive Quiz</h1>
        <button
          onClick={() => setShowHistory(true)}
          className="btn btn-ghost"
        >
          View History
        </button>
      </div>

      {quizState.isComplete ? (
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
      ) : (
        <div>
          <div className="mb-4">
            <div className="text-sm font-medium text-base-content/70">
              Question {currentQuestion.id} of {quizData.length}
            </div>
            <div className="w-full bg-base-300 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(quizState.currentQuestionIndex / quizData.length) * 100}%`,
                }}
              />
            </div>
          </div>

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
              className="btn btn-primary"
            >
              {quizState.currentQuestionIndex === quizData.length - 1
                ? 'Finish Quiz'
                : 'Next Question'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz; 