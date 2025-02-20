import React from 'react';
import { QuizAttempt } from '../types/quiz';

interface QuizHistoryProps {
  attempts: QuizAttempt[];
  onViewAttempt: (attempt: QuizAttempt) => void;
}

const QuizHistory: React.FC<QuizHistoryProps> = ({ attempts, onViewAttempt }) => {
  return (
    <div className="p-6 bg-base-200 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Quiz History</h2>
      
      {attempts.length === 0 ? (
        <p className="text-center text-base-content/70">No attempts yet</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Date</th>
                <th>Score</th>
                <th>Time Taken</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {attempts
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((attempt) => {
                  const totalTime = Object.values(attempt.timePerQuestion).reduce((a, b) => a + b, 0);
                  const percentage = Math.round((attempt.score / attempt.totalQuestions) * 100);
                  
                  return (
                    <tr key={attempt.id}>
                      <td>{new Date(attempt.date).toLocaleString()}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{percentage}%</span>
                          <span className="text-sm text-base-content/70">
                            ({attempt.score}/{attempt.totalQuestions})
                          </span>
                        </div>
                      </td>
                      <td>{totalTime}s</td>
                      <td>
                        <button
                          onClick={() => onViewAttempt(attempt)}
                          className="btn btn-sm btn-ghost"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default QuizHistory; 