import React from 'react';
import { Question, QuizAttempt } from '../types/quiz';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

interface QuizResultsProps {
  questions: Question[];
  attempt: QuizAttempt;
  onRetry: () => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({ questions, attempt, onRetry }) => {
  const percentage = Math.round((attempt.score / questions.length) * 100);

  return (
    <div className="p-6 bg-base-200 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Quiz Results</h2>
      
      <div className="stats shadow mb-6 w-full">
        <div className="stat">
          <div className="stat-title">Score</div>
          <div className="stat-value">{attempt.score} / {questions.length}</div>
          <div className="stat-desc">{percentage}% correct</div>
        </div>
        
        <div className="stat">
          <div className="stat-title">Time Taken</div>
          <div className="stat-value">
            {Object.values(attempt.timePerQuestion).reduce((a, b) => a + b, 0)}s
          </div>
          <div className="stat-desc">Average: {Math.round(Object.values(attempt.timePerQuestion).reduce((a, b) => a + b, 0) / questions.length)}s per question</div>
        </div>
      </div>

      <div className="space-y-4">
        {questions.map((question) => {
          const userAnswer = attempt.answers[question.id];
          const isCorrect = userAnswer === question.correctAnswer;
          
          return (
            <div key={question.id} className="p-4 bg-base-100 rounded-lg">
              <div className="flex items-start gap-2">
                {isCorrect ? (
                  <CheckCircleIcon className="w-6 h-6 text-success flex-shrink-0" />
                ) : (
                  <XCircleIcon className="w-6 h-6 text-error flex-shrink-0" />
                )}
                <div>
                  <p className="font-medium">{question.question}</p>
                  <p className="text-sm mt-1">
                    Your answer: <span className={isCorrect ? 'text-success' : 'text-error'}>
                      {userAnswer}
                    </span>
                  </p>
                  {!isCorrect && (
                    <p className="text-sm mt-1">
                      Correct answer: <span className="text-success">{question.correctAnswer}</span>
                    </p>
                  )}
                  <p className="text-sm text-base-content/70 mt-1">
                    Time taken: {attempt.timePerQuestion[question.id]}s
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={onRetry}
          className="btn btn-primary"
        >
          Back to Start
        </button>
      </div>
    </div>
  );
};

export default QuizResults; 