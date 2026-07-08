// client/src/pages/ResultsScreen.jsx
import React from 'react';

function ResultsScreen({ evaluations, onRestart }) {
  // Calculate average scores
  const avgTechScore = (evaluations.reduce((sum, ev) => sum + ev.technicalScore, 0) / evaluations.length).toFixed(1);
  const avgCommScore = (evaluations.reduce((sum, ev) => sum + ev.communicationScore, 0) / evaluations.length).toFixed(1);

  return (
    <div className="max-w-4xl w-full bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 my-8">
      
      {/* Dashboard Header */}
      <div className="text-center mb-10 border-b border-slate-700 pb-8">
        <h2 className="text-4xl font-extrabold text-white mb-6 tracking-tight">Interview Performance Report</h2>
        <div className="flex justify-center gap-8">
          <div className="bg-slate-900 px-6 py-4 rounded-xl border border-indigo-500/30 shadow-lg shadow-indigo-500/10">
            <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">Avg Technical</p>
            <p className="text-3xl font-bold text-indigo-400">{avgTechScore} <span className="text-lg text-slate-500">/ 10</span></p>
          </div>
          <div className="bg-slate-900 px-6 py-4 rounded-xl border border-emerald-500/30 shadow-lg shadow-emerald-500/10">
            <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">Avg Communication</p>
            <p className="text-3xl font-bold text-emerald-400">{avgCommScore} <span className="text-lg text-slate-500">/ 10</span></p>
          </div>
        </div>
      </div>

      {/* Detailed Question Breakdown */}
      <div className="space-y-8 mb-10">
        {evaluations.map((item, index) => (
          <div key={index} className="bg-slate-900 p-6 rounded-xl border border-slate-700 relative overflow-hidden">
            {/* Question Header */}
            <div className="mb-4">
              <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block">
                Question {index + 1}
              </span>
              <h3 className="text-lg font-bold text-slate-200">{item.question}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {/* Feedback Section */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-emerald-400 flex items-center mb-2">
                    <span className="mr-2">✓</span> Strengths
                  </h4>
                  <ul className="list-disc list-inside text-sm text-slate-400 space-y-1">
                    {item.strengths.map((str, i) => <li key={i}>{str}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-rose-400 flex items-center mb-2">
                    <span className="mr-2">✗</span> Missing Points
                  </h4>
                  <ul className="list-disc list-inside text-sm text-slate-400 space-y-1">
                    {item.missingPoints.map((miss, i) => <li key={i}>{miss}</li>)}
                  </ul>
                </div>
              </div>

              {/* Improved Answer Section */}
              <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                <h4 className="text-sm font-bold text-indigo-300 mb-2">Ideal Response</h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {item.improvedAnswer}
                </p>
              </div>
            </div>
            
            {/* Individual Scores */}
            <div className="absolute top-6 right-6 text-right hidden sm:block">
              <p className="text-xs text-slate-400 font-medium">Tech: <span className="text-indigo-400 font-bold">{item.technicalScore}/10</span></p>
              <p className="text-xs text-slate-400 font-medium">Comm: <span className="text-emerald-400 font-bold">{item.communicationScore}/10</span></p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onRestart}
        className="w-full py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold tracking-wide transition-all duration-200 shadow-xl"
      >
        Start New Interview Session
      </button>
    </div>
  );
}

export default ResultsScreen;