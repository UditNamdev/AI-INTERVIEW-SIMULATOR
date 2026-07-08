// client/src/services/api.js

// Dynamically uses production variables if available, otherwise falls back to local development URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Fetches generated interview questions from the AI backend.
 * @param {string} role - e.g., 'Frontend Developer'
 * @param {string} difficulty - e.g., 'Medium'
 * @returns {Promise<Array>} List of technical questions
 */
export const fetchInterviewQuestions = async (role, difficulty) => {
  try {
    const response = await fetch(`${BASE_URL}/interview/generate-questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role, difficulty }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to initialize interview questions.');
    }

    return result.data; 
  } catch (error) {
    console.error('[API Service Error - fetchInterviewQuestions]:', error.message);
    throw error;
  }
};

/**
 * Sends the user's collected answers to the backend for AI evaluation and database storage.
 * @param {string} role 
 * @param {string} difficulty 
 * @param {Array} answers - Array of objects containing { question, topic, answer }
 * @returns {Promise<Array>} List of detailed evaluations per question
 */
export const evaluateAnswers = async (role, difficulty, answers) => {
  try {
    const response = await fetch(`${BASE_URL}/interview/evaluate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role, difficulty, answers }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to generate evaluation report.');
    }

    return result.data; 
  } catch (error) {
    console.error('[API Service Error - evaluateAnswers]:', error.message);
    throw error;
  }
};

/**
 * Fetches the user's past interview session history log directly from MongoDB.
 * @returns {Promise<Array>} List of past interview session history documents
 */
export const fetchInterviewHistory = async () => {
  try {
    const response = await fetch(`${BASE_URL}/interview/history`);
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to retrieve history logs.');
    }

    return result.data; 
  } catch (error) {
    console.error('[API Service Error - fetchInterviewHistory]:', error.message);
    throw error;
  }
};