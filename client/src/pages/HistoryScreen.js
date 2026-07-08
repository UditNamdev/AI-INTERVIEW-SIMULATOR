// client/src/pages/HistoryScreen.jsx
import React, { useEffect, useState } from 'react';
import { fetchInterviewHistory } from '../services/api';

function HistoryScreen({ onBack }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await fetchInterviewHistory();
        setHistory(data);
      } catch (err) {
        setError('Failed to load past sessions.');
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

  return (
    <div className="max-w-4xl w-full bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 my-8">
      <div className="flex justify-between items-center mb-8 border-b border-slate-700 pb-4">
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Session History</h2>
        <button 
          onClick={onBack}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-bold transition-all"
        >
          ← Back to Setup
        </button>
      </div>

      {loading ? (
        <div className="text-center text-slate-400 py-10">Loading records...</div>
      ) : error ? (
        <div className="text-center text-rose-400 py-10">{error}</div>
      ) : history.length === 0 ? (
        <div className="text-center text-slate-400 py-10">No past interviews found. Start one!</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {history.map((session) => (
            <div key={session._id} className="bg-slate-900 p-5 rounded-xl border border-slate-700 hover:border-indigo-500/50 transition-all">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-200">{session.role}</h3>
                  <span className="text-xs font-semibold px-2 py-1 bg-slate-800 text-slate-400 rounded-md mt-1 inline-block">
                    {session.difficulty} Level
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">
                    {new Date(session.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 mt-4 pt-4 border-t border-slate-800">
                <div>
                  <p className="text-xs text-slate-500 uppercase">Tech Score</p>
                  <p className="text-xl font-bold text-indigo-400">{session.overallTechnicalScore}/10</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase">Comm Score</p>
                  <p className="text-xl font-bold text-emerald-400">{session.overallCommunicationScore}/10</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HistoryScreen;