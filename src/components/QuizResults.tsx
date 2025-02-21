import React from 'react';
import { Question, QuizAttempt } from '../types/quiz';
import { CheckCircleIcon, XCircleIcon, TrophyIcon, ClockIcon, DocumentTextIcon } from '@heroicons/react/24/solid';

interface QuizResultsProps {
  questions: Question[];
  attempt: QuizAttempt;
  onRetry: () => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({ questions, attempt, onRetry }) => {
  const percentage = Math.round((attempt.score / questions.length) * 100);
  const totalTime = Object.values(attempt.timePerQuestion).reduce((a, b) => a + b, 0);
  const averageTime = Math.round(totalTime / questions.length);

  const formatTime = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'text-success';
    if (percentage >= 70) return 'text-primary';
    if (percentage >= 50) return 'text-warning';
    return 'text-error';
  };

  const getGradeText = (percentage: number) => {
    if (percentage >= 90) return 'Excellent!';
    if (percentage >= 70) return 'Good Job!';
    if (percentage >= 50) return 'Keep Practicing!';
    return 'Need Improvement';
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-2">Quiz Complete!</h2>
        <p className="text-xl text-base-content/70">Here's how you did</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-base-200 p-6 rounded-xl shadow-lg transform hover:scale-102 transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <TrophyIcon className="w-8 h-8 text-primary" />
            <h3 className="text-xl font-semibold">Score</h3>
          </div>
          <div className={`text-4xl font-bold ${getGradeColor(percentage)}`}>
            {percentage}%
          </div>
          <div className="text-base-content/70 mt-2">
            {attempt.score} / {questions.length} correct
          </div>
          <div className={`text-lg font-medium mt-2 ${getGradeColor(percentage)}`}>
            {getGradeText(percentage)}
          </div>
        </div>

        <div className="bg-base-200 p-6 rounded-xl shadow-lg transform hover:scale-102 transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <ClockIcon className="w-8 h-8 text-primary" />
            <h3 className="text-xl font-semibold">Time</h3>
          </div>
          <div className="text-4xl font-bold text-primary">
            {formatTime(totalTime)}
          </div>
          <div className="text-base-content/70 mt-2">
            Average: {formatTime(averageTime)} per question
          </div>
        </div>

        <div className="bg-base-200 p-6 rounded-xl shadow-lg transform hover:scale-102 transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <DocumentTextIcon className="w-8 h-8 text-primary" />
            <h3 className="text-xl font-semibold">Details</h3>
          </div>
          <div className="text-4xl font-bold text-primary">
            {questions.length}
          </div>
          <div className="text-base-content/70 mt-2">
            Questions Attempted
          </div>
          <div className="text-base-content/70 mt-2">
            {new Date(attempt.date).toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="bg-base-200 rounded-xl shadow-lg p-6 divide-y divide-base-300">
        <h3 className="text-2xl font-bold mb-6">Question Details</h3>
        
        <div className="space-y-6 pt-6">
          {questions.map((question, index) => {
            const userAnswer = attempt.answers[question.id];
            const isCorrect = userAnswer === question.correctAnswer;
            const questionTime = attempt.timePerQuestion[question.id] || 0;
            
            return (
              <div 
                key={question.id}
                className={`p-6 bg-base-100 rounded-xl shadow-md transform hover:scale-102 transition-all duration-300 ${
                  isCorrect ? 'hover:shadow-glow-success' : 'hover:shadow-glow-error'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`rounded-full p-2 ${
                    isCorrect ? 'bg-success/20' : 'bg-error/20'
                  }`}>
                    {isCorrect ? (
                      <CheckCircleIcon className="w-6 h-6 text-success" />
                    ) : (
                      <XCircleIcon className="w-6 h-6 text-error" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="text-lg font-medium mb-2">
                        Question {question.id}
                      </h4>
                      <span className="text-sm text-base-content/70">
                        {formatTime(questionTime)}
                      </span>
                    </div>
                    
                    <p className="mb-4">{question.question}</p>
                    
                    <div className="space-y-2">
                      <div className={`font-medium ${isCorrect ? 'text-success' : 'text-error'}`}>
                        Your answer: {userAnswer}
                      </div>
                      {!isCorrect && (
                        <div className="text-success font-medium">
                          Correct answer: {question.correctAnswer}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={onRetry}
          className="btn btn-primary btn-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default QuizResults; 