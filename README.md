# Interactive Quiz Platform

A modern, feature-rich quiz application built with Next.js, TypeScript, and TailwindCSS that allows users to take timed quizzes and track their progress.

## 🌟 Features

### Quiz Management
- **Multiple Question Types**
  - Multiple choice questions with instant feedback
  - Integer-based questions with numerical validation
- **Timer-based Questions**
  - 30 seconds per question
  - Visual timer with color transitions (blue → yellow → red)
  - Auto-submission when time expires
- **Multiple Attempts**
  - Unlimited quiz attempts
  - Complete attempt history tracking
  - View detailed results of past attempts

### User Interaction
- **Instant Feedback**
  - Real-time feedback on answer selection
  - Color-coded responses (green for correct, red for incorrect)
  - Visual indicators with animations
  - Display of correct answers for wrong responses
- **Progress Tracking**
  - Current question indicator
  - Time remaining visualization
  - Score calculation and percentage
  - Detailed performance analytics

### Results & History
- **Comprehensive Scoreboard**
  - Total score and percentage
  - Time taken per question
  - Question-by-question breakdown
  - Performance grade with feedback
- **History Tracking**
  - All attempts saved locally
  - Date and time of attempts
  - Score comparison across attempts
  - Detailed review of past answers

### Technical Features
- **Data Persistence**
  - IndexedDB implementation for offline storage
  - Automatic saving of quiz attempts
  - No server required
- **Responsive Design**
  - Mobile-friendly interface
  - Smooth animations and transitions
  - Accessible on all devices
- **Modern UI/UX**
  - Clean and intuitive interface
  - Visual feedback and animations
  - Progress indicators
  - Color-coded states

## 🚀 Getting Started

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

4. Open [http://localhost:3000](http://localhost:3000) in your browser to start the quiz.

## 🛠️ Technologies Used

- **Next.js 14** - React framework for production
- **TypeScript** - Static type checking
- **TailwindCSS** - Utility-first CSS framework
- **DaisyUI** - Component library for Tailwind
- **IndexedDB** - Browser-based storage
- **Heroicons** - Beautiful icons
- **UUID** - Unique identifier generation

## 📱 Deployment

The application is deployed on Vercel and can be accessed at: [Quiz Platform](your-deployment-url)

To deploy your own instance:

1. Fork this repository
2. Create a new project on Vercel
3. Connect your forked repository
4. Deploy with default settings

## 🎯 Assignment Requirements Met

1. **Quiz Creation & Management**
   - ✅ Display list of questions
   - ✅ Support multiple attempts
   - ✅ Show attempt history

2. **User Interaction**
   - ✅ Instant feedback on answers
   - ✅ Timer-based questions (30 seconds each)
   - ✅ Visual progress tracking

3. **Progress Tracking**
   - ✅ Detailed scoreboard
   - ✅ Time tracking per question
   - ✅ Performance analytics

4. **Bonus Features**
   - ✅ IndexedDB implementation
   - ✅ Responsive design
   - ✅ Modern UI/UX
   - ✅ Offline functionality

5. **Code Quality**
   - ✅ Modular component structure
   - ✅ Clean and maintainable code
   - ✅ TypeScript type safety
   - ✅ Proper error handling

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎨 Color Scheme

The application uses a carefully selected color palette:
- Primary (Blue): For main actions and UI elements
- Success (Green): For correct answers and positive feedback
- Error (Red): For incorrect answers and warnings
- Warning (Yellow): For time-sensitive notifications
- Neutral: For background and text

## 🔄 State Management

- Local state for quiz progress
- IndexedDB for attempt history
- Real-time timer management
- Answer validation and scoring

## 📊 Future Enhancements

- User authentication
- Custom quiz creation
- Social sharing
- Performance analytics
- Leaderboards
