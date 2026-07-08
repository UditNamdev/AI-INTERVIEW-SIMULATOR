import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  throw new Error(
    'CRITICAL CONFIG ERROR: GEMINI_API_KEY is missing from environment variables.'
  );
}

// Initialize Gemini client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/**
 * Generates interview questions using Gemini.
 * @param {string} role
 * @param {string} difficulty
 */
export const generateQuestionsFromAI = async (role, difficulty) => {
  const responseSchema = {
    type: 'object',
    properties: {
      questions: {
        type: 'array',
        description: 'An array containing exactly 5 interview questions.',
        items: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Sequential question number starting from 1',
            },
            question: {
              type: 'string',
              description: 'Interview question',
            },
            topic: {
              type: 'string',
              description: 'Topic being evaluated',
            },
          },
          required: ['id', 'question', 'topic'],
        },
      },
    },
    required: ['questions'],
  };

  const systemPrompt = `
You are an expert technical interviewer assessing a fresher applying for a ${role} position.

Generate exactly 5 distinct technical interview questions.

Difficulty: ${difficulty}

Focus on:
- Core concepts
- Fundamentals
- Engineering principles
- Architecture
- APIs
- Databases
- JavaScript/React/Node depending on the role

Return ONLY valid JSON matching the supplied schema.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: systemPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema,
        temperature: 0.6,
      },
    });

    if (!response.text) {
      throw new Error('AI Engine returned an empty payload.');
    }

    return JSON.parse(response.text);
  } catch (error) {
    console.error(`[Gemini Question Generation Error]: ${error.message}`);
    throw new Error(`AI Question Generation Failed: ${error.message}`);
  }
};

/**
 * Evaluates an array of user answers using Gemini.
 * @param {string} role
 * @param {string} difficulty
 * @param {Array} answers
 */
export const evaluateAnswersWithAI = async (
  role,
  difficulty,
  answers
) => {
  const responseSchema = {
    type: 'object',
    properties: {
      evaluations: {
        type: 'array',
        description:
          'An array of evaluations corresponding to each question answered.',
        items: {
          type: 'object',
          properties: {
            question: {
              type: 'string',
            },
            technicalScore: {
              type: 'integer',
              description:
                'Score from 0 to 10 based on technical accuracy.',
            },
            communicationScore: {
              type: 'integer',
              description:
                'Score from 0 to 10 based on clarity and structure.',
            },
            strengths: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
            missingPoints: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
            improvedAnswer: {
              type: 'string',
            },
          },
          required: [
            'question',
            'technicalScore',
            'communicationScore',
            'strengths',
            'missingPoints',
            'improvedAnswer',
          ],
        },
      },
    },
    required: ['evaluations'],
  };

  const systemPrompt = `
You are an expert technical interviewer evaluating a ${role} candidate at ${difficulty} difficulty.

You will receive a JSON array containing interview questions and the candidate's answers.

Evaluate each answer objectively.

Return ONLY valid JSON matching the supplied schema.

Candidate Answers:
${JSON.stringify(answers)}
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: systemPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema,
        temperature: 0.3,
      },
    });

    if (!response.text) {
      throw new Error(
        'AI Engine returned an empty payload during evaluation.'
      );
    }

    return JSON.parse(response.text);
  } catch (error) {
    console.error(`[Gemini Evaluation Error]: ${error.message}`);
    throw new Error(`AI Evaluation Failed: ${error.message}`);
  }
};