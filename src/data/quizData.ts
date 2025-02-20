import { Question } from '../types/quiz';

export const quizData: Question[] = [
  {
    id: 1,
    type: 'multiple-choice',
    question: 'Which planet is closest to the Sun?',
    options: ['Venus', 'Mercury', 'Earth', 'Mars'],
    correctAnswer: 'Mercury'
  },
  {
    id: 2,
    type: 'multiple-choice',
    question: 'Which data structure organizes items in a First-In, First-Out (FIFO) manner?',
    options: ['Stack', 'Queue', 'Tree', 'Graph'],
    correctAnswer: 'Queue'
  },
  {
    id: 3,
    type: 'multiple-choice',
    question: 'Which of the following is primarily used for structuring web pages?',
    options: ['Python', 'Java', 'HTML', 'C++'],
    correctAnswer: 'HTML'
  },
  {
    id: 4,
    type: 'multiple-choice',
    question: 'Which chemical symbol stands for Gold?',
    options: ['Au', 'Gd', 'Ag', 'Pt'],
    correctAnswer: 'Au'
  },
  {
    id: 5,
    type: 'multiple-choice',
    question: 'Which of these processes is not typically involved in refining petroleum?',
    options: ['Fractional distillation', 'Cracking', 'Polymerization', 'Filtration'],
    correctAnswer: 'Filtration'
  },
  {
    id: 6,
    type: 'integer',
    question: 'What is the value of 12 + 28?',
    correctAnswer: 40
  },
  {
    id: 7,
    type: 'integer',
    question: 'How many states are there in the United States?',
    correctAnswer: 50
  },
  {
    id: 8,
    type: 'integer',
    question: 'In which year was the Declaration of Independence signed?',
    correctAnswer: 1776
  },
  {
    id: 9,
    type: 'integer',
    question: 'What is the value of pi rounded to the nearest integer?',
    correctAnswer: 3
  },
  {
    id: 10,
    type: 'integer',
    question: 'If a car travels at 60 mph for 2 hours, how many miles does it travel?',
    correctAnswer: 120
  }
]; 