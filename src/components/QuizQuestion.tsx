import React, { useState, useEffect, useRef } from 'react';
import { Question } from '../types/quiz';

interface QuizQuestionProps {
  question: Question;
  onAnswer: (answer: string | number) => void;
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
  const timerRef = useRef<NodeJS.Timeout>();
  const hasTimedUpRef = useRef(false);

  useEffect(() => {
    setAnswer(userAnswer || '');
  }, [userAnswer]);

  useEffect(() => {
    // Reset timer state when question changes
    setTimeLeft(timeLimit);
    hasTimedUpRef.current = false;

    // Clear existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Start new timer
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1 && !hasTimedUpRef.current) {
          hasTimedUpRef.current = true;
          clearInterval(timerRef.current);
          // Schedule onTimeUp to run after render
          setTimeout(onTimeUp, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timeLimit, question.id, onTimeUp]);

  const handleAnswerChange = (value: string | number) => {
    setAnswer(value);
    onAnswer(value);
  };

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
              className="flex items-center p-3 border rounded-lg hover:bg-base-300 cursor-pointer"
            >
              <input
                type="radio"
                name="answer"
                value={option}
                checked={answer === option}
                onChange={(e) => handleAnswerChange(e.target.value)}
                className="radio radio-primary mr-3"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      )}

      {question.type === 'integer' && (
        <input
          type="number"
          value={answer}
          onChange={(e) => handleAnswerChange(parseInt(e.target.value) || '')}
          className="input input-bordered w-full max-w-xs"
          placeholder="Enter your answer"
        />
      )}

      <div className="mt-4 w-full bg-base-300 rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-1000"
          style={{ width: `${(timeLeft / timeLimit) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default QuizQuestion; 