import React from 'react';
import { QuizAttempt } from '../types/quiz';
import { ClockIcon, TrophyIcon, CalendarIcon } from '@heroicons/react/24/solid';

interface QuizHistoryProps {
  attempts: QuizAttempt[];
  onViewAttempt: (attempt: QuizAttempt) => void;
}

const QuizHistory: React.FC<QuizHistoryProps> = ({ attempts, onViewAttempt }) => {
  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-2">Quiz History</h2>
        <p className="text-xl text-base-content/70">
          {attempts.length === 0 
            ? "You haven't taken any quizzes yet" 
            : `You've taken ${attempts.length} quiz${attempts.length === 1 ? '' : 'zes'}`
          }
        </p>
      </div>
      
      {attempts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-base-content/70">Take a quiz to see your results here!</p>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1">
          {attempts
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((attempt) => {
              const totalTime = Object.values(attempt.timePerQuestion).reduce((a, b) => a + b, 0);
              const percentage = Math.round((attempt.score / attempt.totalQuestions) * 100);
              
              return (
                <div
                  key={attempt.id}
                  className="bg-base-200 rounded-xl shadow-lg p-6 transform hover:scale-102 transition-all duration-300 hover:shadow-xl"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="flex items-center gap-3">
                      <CalendarIcon className="w-6 h-6 text-primary" />
                      <div>
                        <div className="text-sm text-base-content/70">Date</div>
                        <div className="font-medium">
                          {new Date(attempt.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <TrophyIcon className="w-6 h-6 text-primary" />
                      <div>
                        <div className="text-sm text-base-content/70">Score</div>
                        <div className="font-medium">
                          <span className={getGradeColor(percentage)}>
                            {percentage}%
                          </span>
                          <span className="text-base-content/70 text-sm ml-2">
                            ({attempt.score}/{attempt.totalQuestions})
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <ClockIcon className="w-6 h-6 text-primary" />
                      <div>
                        <div className="text-sm text-base-content/70">Time</div>
                        <div className="font-medium">{formatTime(totalTime)}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end">
                      <button
                        onClick={() => onViewAttempt(attempt)}
                        className="btn btn-primary btn-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default QuizHistory; 