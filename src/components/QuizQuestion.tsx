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
  const inputRef = useRef<HTMLInputElement>(null);

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
    setAnswer(value);
    setShowFeedback(true);
    const timeTaken = timeLimit - timeLeft;
    onAnswer(value, timeTaken);
  };

  const handleIntegerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer !== '') {
      handleAnswerChange(Number(answer));
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  };

  const handleIntegerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^-?\d+$/.test(value)) {
      setAnswer(value);
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
                    : ''
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
            <form onSubmit={handleIntegerSubmit} className="flex justify-center">
              <div className="w-full max-w-xs">
                <input
                  ref={inputRef}
                  type="text"
                  pattern="-?[0-9]*"
                  value={answer}
                  onChange={handleIntegerChange}
                  onBlur={() => {
                    if (answer !== '') {
                      handleAnswerChange(Number(answer));
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && answer !== '') {
                      e.preventDefault();
                      handleAnswerChange(Number(answer));
                      inputRef.current?.blur();
                    }
                  }}
                  className={`input input-bordered w-full text-center text-xl ${
                    showFeedback
                      ? isCorrect
                        ? 'input-success shadow-glow-success'
                        : 'input-error shadow-glow-error'
                      : 'focus:shadow-glow'
                  }`}
                  placeholder="Enter your answer"
                />
              </div>
            </form>
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
          <div className="w-full bg-base-300 rounded-full h-4 overflow-hidden shadow-inner">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                timeLeft < 10 
                  ? 'bg-gradient-to-r from-error-600 via-error to-error-400 animate-pulse' 
                  : timeLeft < 20
                    ? 'bg-gradient-to-r from-warning-600 via-warning to-warning-400'
                    : 'bg-gradient-to-r from-primary-600 via-primary to-primary-400'
              }`}
              style={{ 
                width: `${(timeLeft / timeLimit) * 100}%`,
                boxShadow: timeLeft < 10 
                  ? '0 0 20px rgba(239, 68, 68, 0.6), 0 0 10px rgba(239, 68, 68, 0.4) inset' 
                  : timeLeft < 20
                    ? '0 0 20px rgba(251, 189, 35, 0.6), 0 0 10px rgba(251, 189, 35, 0.4) inset'
                    : '0 0 20px rgba(14, 165, 233, 0.6), 0 0 10px rgba(14, 165, 233, 0.4) inset',
                transition: 'all 0.3s ease-in-out'
              }}
            />
          </div>
          <div className="flex justify-between mt-2 text-sm text-base-content/60">
            <span>Time remaining</span>
            <span className={`font-medium ${
              timeLeft < 10 
                ? 'text-error animate-pulse'
                : timeLeft < 20
                  ? 'text-warning'
                  : 'text-primary'
            }`}>
              {timeLeft} seconds
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizQuestion;