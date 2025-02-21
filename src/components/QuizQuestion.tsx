import React, { useState, useEffect, useRef } from 'react';
import { Question } from '../types/quiz';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

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
    <div className="p-6 bg-base-200 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Question {question.id}</h2>
        <div className="text-lg font-semibold">
          Time left: {timeLeft}s
        </div>
      </div>
      
      <p className="text-lg mb-4">{question.question}</p>

      {question.type === 'multiple-choice' && question.options && (
        <div className="space-y-2">
          {question.options.map((option, index) => (
            <label
              key={index}
              className={`flex items-center p-3 border rounded-lg ${
                !isAnswerLocked ? 'hover:bg-base-300 cursor-pointer' : 'cursor-not-allowed'
              } ${
                showFeedback && answer === option
                  ? isCorrect
                    ? 'bg-success/20 border-success'
                    : 'bg-error/20 border-error'
                  : showFeedback && option === question.correctAnswer
                    ? 'bg-success/20 border-success'
                    : ''
              }`}
            >
              <input
                type="radio"
                name="answer"
                value={option}
                checked={answer === option}
                onChange={(e) => handleAnswerChange(e.target.value)}
                disabled={isAnswerLocked}
                className={`radio mr-3 ${
                  showFeedback && answer === option
                    ? isCorrect
                      ? 'radio-success'
                      : 'radio-error'
                    : showFeedback && option === question.correctAnswer
                      ? 'radio-success'
                      : 'radio-primary'
                }`}
              />
              <span className="flex items-center gap-2">
                {option}
                {showFeedback && answer === option && (
                  isCorrect ? (
                    <CheckCircleIcon className="w-5 h-5 text-success" />
                  ) : (
                    <XCircleIcon className="w-5 h-5 text-error" />
                  )
                )}
                {showFeedback && !isCorrect && option === question.correctAnswer && (
                  <CheckCircleIcon className="w-5 h-5 text-success" />
                )}
              </span>
            </label>
          ))}
        </div>
      )}

      {question.type === 'integer' && (
        <div>
          <input
            type="number"
            value={answer}
            onChange={(e) => handleAnswerChange(parseInt(e.target.value) || '')}
            disabled={isAnswerLocked}
            className={`input input-bordered w-full max-w-xs ${
              showFeedback
                ? isCorrect
                  ? 'input-success'
                  : 'input-error'
                : ''
            } ${isAnswerLocked ? 'cursor-not-allowed' : ''}`}
            placeholder="Enter your answer"
          />
          {showFeedback && (
            <div className={`mt-2 flex items-center gap-2 ${
              isCorrect ? 'text-success' : 'text-error'
            }`}>
              {isCorrect ? (
                <>
                  <CheckCircleIcon className="w-5 h-5" />
                  <span>Correct!</span>
                </>
              ) : (
                <>
                  <XCircleIcon className="w-5 h-5" />
                  <span>Incorrect. The correct answer is {question.correctAnswer}</span>
                </>
              )}
            </div>
          )}
        </div>
      )}

      <div className="mt-4 w-full bg-base-300 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-1000 ${
            timeLeft < 10 ? 'bg-error' : 'bg-primary'
          }`}
          style={{ width: `${(timeLeft / timeLimit) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default QuizQuestion;