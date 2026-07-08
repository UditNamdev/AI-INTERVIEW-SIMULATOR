// client/src/pages/SetupScreen.jsx
import React, { useState } from 'react';

const ROLES = ['Frontend Developer', 'Backend Developer', 'Full Stack Developer'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

function SetupScreen({ onStartInterview, isLoading }) {
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);
  const [selectedDifficulty, setSelectedDifficulty] = useState(DIFFICULTIES[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onStartInterview(selectedRole, selectedDifficulty);
  };

  return (
    <div className="max-w-xl w-full bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 transition-all">
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Configure Your Session
        </h2>
        <p className="text-slate-400 mt-2 text-sm">
          Select your target parameters. Gemini AI will generate tailored technical interview questions.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Role Picker */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Target Role
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {ROLES.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setSelectedRole(role)}
                disabled={isLoading}
                className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  selectedRole === role
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-900/50 text-slate-400 border-slate-700 hover:bg-slate-700/50 hover:text-slate-200'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Picker */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Experience Tier
          </label>
          <div className="grid grid-cols-3 gap-3">
            {DIFFICULTIES.map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setSelectedDifficulty(level)}
                disabled={isLoading}
                className={`py-3 px-4 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                  selectedDifficulty === level
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg shadow-emerald-600/30'
                    : 'bg-slate-900/50 text-slate-400 border-slate-700 hover:bg-slate-700/50 hover:text-slate-200'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Action Trigger */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 rounded-xl font-bold tracking-wide transition-all duration-200 cursor-pointer text-sm shadow-xl flex items-center justify-center ${
            isLoading
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90 active:scale-[0.99] shadow-indigo-500/20'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <svg className="animate-spin h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Generating Core Material...</span>
            </div>
          ) : (
            'Initialize Simulation'
          )}
        </button>
      </form>
    </div>
  );
}

export default SetupScreen;