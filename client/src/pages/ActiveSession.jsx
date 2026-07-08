// client/src/pages/ActiveSession.jsx
import React, { useState } from 'react';

function ActiveSession({ questions, onInterviewComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [userAnswers, setUserAnswers] = useState([]);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleNext = () => {
    if (!currentAnswer.trim()) return;

    // Save the current answer mapped to the question
    const updatedAnswers = [
      ...userAnswers,
      {
        question: currentQuestion.question,
        topic: currentQuestion.topic,
        answer: currentAnswer
      }
    ];

    setUserAnswers(updatedAnswers);
    setCurrentAnswer(''); // Clear textarea for the next question

    if (isLastQuestion) {
      // Pass all collected answers back to App.js to trigger the evaluation phase
      onInterviewComplete(updatedAnswers);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  return (
    <div className="max-w-2xl w-full bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700">
      {/* Progress Header */}
      <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
        <span className="text-indigo-400 font-bold text-sm tracking-wider uppercase">
          {currentQuestion.topic}
        </span>
        <span className="text-slate-400 text-sm font-medium bg-slate-900 px-3 py-1 rounded-full border border-slate-700">
          Question {currentIndex + 1} of {questions.length}
        </span>
      </div>

      {/* Question Display */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white leading-relaxed">
          {currentQuestion.question}
        </h2>
      </div>

      {/* Answer Input Area */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-300 mb-2">
          Your Answer
        </label>
        <textarea
          rows="6"
          className="w-full bg-slate-900 text-slate-200 border border-slate-600 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
          placeholder="Explain your thought process clearly..."
          value={currentAnswer}
          onChange={(e) => setCurrentAnswer(e.target.value)}
        ></textarea>
      </div>

      {/* Action Button */}
      <div className="flex justify-end">
        <button
          onClick={handleNext}
          disabled={!currentAnswer.trim()}
          className={`px-8 py-3 rounded-xl font-bold transition-all shadow-lg ${
            !currentAnswer.trim()
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-indigo-500/25 active:scale-95'
          }`}
        >
          {isLastQuestion ? 'Submit Final Answer' : 'Next Question'}
        </button>
      </div>
    </div>
  );
}

export default ActiveSession;