import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onTimeUp]);

  const handleAnswerChange = (value: string | number) => {
    setAnswer(value);
    onAnswer(value);
  };

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