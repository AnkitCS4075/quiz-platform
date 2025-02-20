# Interactive Quiz Platform

A modern quiz application built with Next.js, TypeScript, and TailwindCSS that allows users to take timed quizzes and track their progress.

## Features

- **Interactive Quiz Interface**
  - Multiple choice and integer-based questions
  - Timer-based questions (30 seconds per question)
  - Instant feedback on answers
  - Progress tracking during quiz

- **Quiz History**
  - View past quiz attempts
  - Detailed score breakdown
  - Time taken per question
  - Multiple attempts supported

- **Modern UI/UX**
  - Responsive design
  - Clean and intuitive interface
  - Progress indicators
  - Beautiful animations

- **Data Persistence**
  - Quiz attempts saved using IndexedDB
  - Works offline
  - No server required

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd quiz-platform
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to start the quiz.

## Usage

1. Start the quiz by clicking on any question option or entering a number
2. You have 30 seconds to answer each question
3. Click "Next Question" to proceed or wait for the timer to expire
4. View your score and detailed feedback at the end
5. Access your quiz history through the "View History" button
6. Retry the quiz as many times as you want

## Technologies Used

- Next.js 14
- TypeScript
- TailwindCSS
- DaisyUI
- IndexedDB (via idb)

## Deployment

This app can be easily deployed to Vercel:

1. Push your code to GitHub
2. Visit [Vercel](https://vercel.com)
3. Import your repository
4. Deploy

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
