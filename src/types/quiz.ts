export type QuestionType = 'multiple-choice' | 'integer';

export interface Question {
  id: number;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string | number;
}

export interface QuizAttempt {
  id: string;
  date: string;
  score: number;
  totalQuestions: number;
  answers: Record<number, string | number>;
  timePerQuestion: Record<number, number>;
}

export interface QuizState {
  currentQuestionIndex: number;
  answers: Record<number, string | number>;
  timePerQuestion: Record<number, number>;
  isComplete: boolean;
  startTime: string;
} 