// client/src/App.jsx
import React, { useState } from 'react';
import SetupScreen from './pages/SetupScreen';
import ActiveSession from './pages/ActiveSession';
import ResultsScreen from './pages/ResultsScreen';
import HistoryScreen from './pages/HistoryScreen';
import { fetchInterviewQuestions, evaluateAnswers } from './services/api';

function App() {
  const [interviewState, setInterviewState] = useState('SETUP'); // SETUP | RUNNING | EVALUATING | RESULTS | HISTORY
  const [sessionConfig, setSessionConfig] = useState({ role: '', difficulty: '' });
  const [questions, setQuestions] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleStartInterview = async (role, difficulty) => {
    setLoading(true);
    setErrorMessage('');
    try {
      const generatedQuestions = await fetchInterviewQuestions(role, difficulty);
      setQuestions(generatedQuestions);
      setSessionConfig({ role, difficulty });
      setInterviewState('RUNNING'); 
    } catch (err) {
      setErrorMessage(err.message || 'Failed to initialize session.');
    } finally {
      setLoading(false);
    }
  };

  const handleInterviewComplete = async (finalAnswers) => {
    setInterviewState('EVALUATING'); 
    setErrorMessage('');
    try {
      const results = await evaluateAnswers(
        sessionConfig.role, 
        sessionConfig.difficulty, 
        finalAnswers
      );
      setEvaluations(results);
      setInterviewState('RESULTS');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to grade answers. Please try again.');
      setInterviewState('RUNNING'); 
    }
  };

  const handleRestart = () => {
    setQuestions([]);
    setEvaluations([]);
    setSessionConfig({ role: '', difficulty: '' });
    setInterviewState('SETUP');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center text-white p-4">
      
      {/* Top Navigation Bar */}
      <div className="w-full max-w-4xl flex justify-between items-center py-4 mb-4">
        <h1 className="text-xl font-bold text-indigo-400 tracking-wider">AI INTERVIEW PRO</h1>
        {interviewState === 'SETUP' && (
          <button 
            onClick={() => setInterviewState('HISTORY')}
            className="px-4 py-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 rounded-lg text-sm font-semibold transition-all"
          >
            View History
          </button>
        )}
      </div>

      {errorMessage && (
        <div className="mb-6 max-w-xl w-full p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-sm font-medium text-center shadow-lg">
          ⚠️ {errorMessage}
        </div>
      )}

      {interviewState === 'SETUP' && (
        <SetupScreen onStartInterview={handleStartInterview} isLoading={loading} />
      )}

      {interviewState === 'HISTORY' && (
        <HistoryScreen onBack={() => setInterviewState('SETUP')} />
      )}

      {interviewState === 'RUNNING' && (
        <ActiveSession 
          questions={questions} 
          onInterviewComplete={handleInterviewComplete} 
        />
      )}

      {interviewState === 'EVALUATING' && (
        <div className="max-w-xl w-full bg-slate-800 p-12 rounded-2xl text-center border border-slate-700 shadow-2xl flex flex-col items-center">
          <svg className="animate-spin h-10 w-10 text-indigo-500 mb-6" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <h2 className="text-2xl font-bold text-white mb-2">Analyzing Responses...</h2>
          <p className="text-slate-400 text-sm">Gemini AI is currently grading your technical accuracy and communication structure.</p>
        </div>
      )}

      {interviewState === 'RESULTS' && (
        <ResultsScreen evaluations={evaluations} onRestart={handleRestart} />
      )}
    </div>
  );
}

export default App;