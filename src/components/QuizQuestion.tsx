import React, { useState, useEffect, useRef } from 'react';
import { Question } from '../types/quiz';
import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/solid';

interface QuizQuestionProps {
  question: Question;
  onAnswer: (answer: string | number, timeTaken: number) => void;
  timeLimit: number;
  onTimeUp: () => void;
  userAnswer?: string | number;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  onAnswer,
  timeLimit,
  onTimeUp,
  userAnswer
}) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [answer, setAnswer] = useState<string | number>(userAnswer || '');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isAnswerLocked, setIsAnswerLocked] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();
  const hasTimedUpRef = useRef(false);

  useEffect(() => {
    setAnswer(userAnswer || '');
    setShowFeedback(false);
    setIsAnswerLocked(false);
  }, [userAnswer, question.id]);

  useEffect(() => {
    setTimeLeft(timeLimit);
    hasTimedUpRef.current = false;

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1 && !hasTimedUpRef.current) {
          hasTimedUpRef.current = true;
          clearInterval(timerRef.current);
          setTimeout(onTimeUp, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timeLimit, question.id, onTimeUp]);

  const handleAnswerChange = (value: string | number) => {
    if (isAnswerLocked) return;
    
    setAnswer(value);
    setShowFeedback(true);
    setIsAnswerLocked(true);
    const timeTaken = timeLimit - timeLeft;
    onAnswer(value, timeTaken);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const isCorrect = answer === question.correctAnswer;

  if (!timerRef.current) {
    return (
      <div className="p-6 bg-base-200 rounded-lg shadow-lg animate-pulse">
        <div className="h-6 bg-base-300 rounded w-32 mb-4"></div>
        <div className="h-4 bg-base-300 rounded w-full mb-6"></div>
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-base-300 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-base-200 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl animate-fade-in">
      <div className="relative mb-8">
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold ${
            timeLeft < 10 
              ? 'bg-error text-white animate-pulse' 
              : 'bg-primary text-white'
          }`}>
            <div className="flex items-center gap-1">
              <ClockIcon className="w-6 h-6" />
              {timeLeft}s
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Question {question.id}</h2>
          <p className="text-xl text-base-content/80">{question.question}</p>
        </div>

        {question.type === 'multiple-choice' && question.options && (
          <div className="space-y-3 mt-8">
            {question.options.map((option, index) => (
              <label
                key={index}
                className={`flex items-center p-4 border-2 rounded-lg transition-all duration-300 ${
                  !isAnswerLocked 
                    ? 'hover:bg-primary/10 hover:border-primary cursor-pointer transform hover:scale-102 hover:shadow-glow' 
                    : 'cursor-not-allowed'
                } ${
                  showFeedback && answer === option
                    ? isCorrect
                      ? 'bg-success/20 border-success shadow-glow-success'
                      : 'bg-error/20 border-error shadow-glow-error'
                    : showFeedback && option === question.correctAnswer
                      ? 'bg-success/20 border-success shadow-glow-success'
                      : 'border-base-300'
                }`}
              >
                <input
                  type="radio"
                  name="answer"
                  value={option}
                  checked={answer === option}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  disabled={isAnswerLocked}
                  className={`radio mr-4 ${
                    showFeedback && answer === option
                      ? isCorrect
                        ? 'radio-success'
                        : 'radio-error'
                      : showFeedback && option === question.correctAnswer
                        ? 'radio-success'
                        : 'radio-primary'
                  }`}
                />
                <span className="flex items-center gap-3 text-lg">
                  {option}
                  {showFeedback && answer === option && (
                    <span className="transform scale-110 transition-transform duration-300">
                      {isCorrect ? (
                        <CheckCircleIcon className="w-6 h-6 text-success animate-bounce-slow" />
                      ) : (
                        <XCircleIcon className="w-6 h-6 text-error animate-pulse-slow" />
                      )}
                    </span>
                  )}
                  {showFeedback && !isCorrect && option === question.correctAnswer && (
                    <CheckCircleIcon className="w-6 h-6 text-success animate-bounce-slow" />
                  )}
                </span>
              </label>
            ))}
          </div>
        )}

        {question.type === 'integer' && (
          <div className="space-y-4 mt-8">
            <div className="flex justify-center">
              <input
                type="number"
                value={answer}
                onChange={(e) => handleAnswerChange(parseInt(e.target.value) || '')}
                disabled={isAnswerLocked}
                className={`input input-bordered w-full max-w-xs text-center text-xl ${
                  showFeedback
                    ? isCorrect
                      ? 'input-success shadow-glow-success'
                      : 'input-error shadow-glow-error'
                    : 'focus:shadow-glow'
                } ${isAnswerLocked ? 'cursor-not-allowed' : ''}`}
                placeholder="Enter your answer"
              />
            </div>
            {showFeedback && (
              <div className={`flex justify-center items-center gap-2 text-lg font-medium animate-slide-in ${
                isCorrect ? 'text-success' : 'text-error'
              }`}>
                {isCorrect ? (
                  <>
                    <CheckCircleIcon className="w-6 h-6 animate-bounce-slow" />
                    <span>Correct!</span>
                  </>
                ) : (
                  <>
                    <XCircleIcon className="w-6 h-6 animate-pulse-slow" />
                    <span>Incorrect. The correct answer is {question.correctAnswer}</span>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        <div className="mt-8">
          <div className="w-full bg-base-300 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                timeLeft < 10 
                  ? 'bg-error animate-pulse' 
                  : 'bg-primary'
              }`}
              style={{ 
                width: `${(timeLeft / timeLimit) * 100}%`,
                boxShadow: timeLeft < 10 ? '0 0 10px rgba(239, 68, 68, 0.5)' : '0 0 10px rgba(14, 165, 233, 0.5)'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizQuestion;