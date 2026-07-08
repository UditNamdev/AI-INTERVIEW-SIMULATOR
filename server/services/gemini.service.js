/**
 * Evaluates an array of user answers using Gemini.
 * @param {string} role 
 * @param {string} difficulty 
 * @param {Array} answers - Array of { question, topic, answer }
 */
export const evaluateAnswersWithAI = async (role, difficulty, answers) => {
  const responseSchema = {
    type: "object",
    properties: {
      evaluations: {
        type: "array",
        description: "An array of evaluations corresponding to each question answered.",
        items: {
          type: "object",
          properties: {
            question: { type: "string" },
            technicalScore: { type: "integer", description: "Score from 0 to 10 based on technical accuracy." },
            communicationScore: { type: "integer", description: "Score from 0 to 10 based on clarity and structure." },
            strengths: { 
              type: "array", 
              items: { type: "string" },
              description: "Brief bullet points of what the candidate did well."
            },
            missingPoints: { 
              type: "array", 
              items: { type: "string" },
              description: "Brief bullet points of critical concepts missed."
            },
            improvedAnswer: { type: "string", description: "An ideal, professional response to the question." }
          },
          required: ["question", "technicalScore", "communicationScore", "strengths", "missingPoints", "improvedAnswer"]
        }
      }
    },
    required: ["evaluations"]
  };

  const systemPrompt = `
    You are an expert technical interviewer evaluating a ${role} candidate at a ${difficulty} level.
    You will be provided with a JSON array of questions and the candidate's answers.
    Evaluate each answer strictly and objectively. Return ONLY valid JSON matching the specified schema.
    Data to evaluate: ${JSON.stringify(answers)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: systemPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.3, // Lower temperature for more objective grading
      }
    });

    if (!response.text) throw new Error('AI Engine returned an empty payload during evaluation.');
    return JSON.parse(response.text);
  } catch (error) {
    console.error(`[Gemini Evaluation Error]: ${error.message}`);
    throw new Error(`AI Evaluation Failed: ${error.message}`);
  }
};