import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Question, QuizState, QuizAttempt } from '../types/quiz';
import { quizData } from '../data/quizData';
import QuizQuestion from './QuizQuestion';
import QuizResults from './QuizResults';
import QuizHistory from './QuizHistory';
import { saveQuizAttempt, getQuizAttempts } from '../services/db';

const SECONDS_PER_QUESTION = 30;

const Quiz: React.FC = () => {
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    answers: {},
    timePerQuestion: {},
    isComplete: false,
    startTime: new Date().toISOString(), // Initialize with current time
  });

  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [selectedAttempt, setSelectedAttempt] = useState<QuizAttempt | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    loadAttempts();
  }, []);

  const loadAttempts = async () => {
    try {
      const loadedAttempts = await getQuizAttempts();
      setAttempts(loadedAttempts);
    } catch (error) {
      console.error('Failed to load attempts:', error);
    }
  };

  const handleAnswer = (answer: string | number) => {
    setQuizState((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [quizData[prev.currentQuestionIndex].id]: answer,
      },
    }));
  };

  const handleTimeUp = () => {
    const currentQuestion = quizData[quizState.currentQuestionIndex];
    setQuizState((prev) => ({
      ...prev,
      timePerQuestion: {
        ...prev.timePerQuestion,
        [currentQuestion.id]: SECONDS_PER_QUESTION,
      },
    }));
    handleNextQuestion();
  };

  const handleNextQuestion = async () => {
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
  };

  const calculateScore = () => {
    return Object.entries(quizState.answers).reduce((score, [questionId, answer]) => {
      const question = quizData.find((q) => q.id === parseInt(questionId));
      return question?.correctAnswer === answer ? score + 1 : score;
    }, 0);
  };

  const handleRetry = () => {
    setQuizState({
      currentQuestionIndex: 0,
      answers: {},
      timePerQuestion: {},
      isComplete: false,
      startTime: '',
    });
    setSelectedAttempt(null);
  };

  const handleViewAttempt = (attempt: QuizAttempt) => {
    setSelectedAttempt(attempt);
    setShowHistory(false);
  };

  const currentQuestion = quizData[quizState.currentQuestionIndex];

  if (showHistory) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <QuizHistory attempts={attempts} onViewAttempt={handleViewAttempt} />
        <button
          onClick={() => setShowHistory(false)}
          className="btn btn-primary mt-4"
        >
          Back to Quiz
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