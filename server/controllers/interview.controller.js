// server/controllers/interview.controller.js
import { generateQuestionsFromAI, evaluateAnswersWithAI } from '../services/gemini.service.js';
import Interview from '../models/Interview.model.js'; // <-- IMPORT MODEL

// ... (keep handleGenerateQuestions exact same) ...
/**
 * @desc    Generate interview questions
 * @route   POST /api/interview/generate-questions
 */
export const handleGenerateQuestions = async (req, res, next) => {
  try {
    const { role, difficulty } = req.body;

    // Validation
    if (!role || !difficulty) {
      const error = new Error(
        'Validation Error: "role" and "difficulty" are required.'
      );
      error.statusCode = 400;
      throw error;
    }

    const validRoles = [
      'Frontend Developer',
      'Backend Developer',
      'Full Stack Developer'
    ];

    const validDifficulties = [
      'Easy',
      'Medium',
      'Hard'
    ];

    if (
      !validRoles.includes(role) ||
      !validDifficulties.includes(difficulty)
    ) {
      const error = new Error(
        'Validation Error: Invalid role or difficulty.'
      );
      error.statusCode = 400;
      throw error;
    }

    // Generate questions using Gemini
    const aiData = await generateQuestionsFromAI(role, difficulty);

    return res.status(200).json({
      success: true,
      data: aiData.questions,
    });
  } catch (error) {
    next(error);
  }
};
export const handleEvaluateAnswers = async (req, res, next) => {
  try {
    const { role, difficulty, answers } = req.body;

    if (!role || !difficulty || !Array.isArray(answers) || answers.length === 0) {
      const error = new Error('Validation Error: Missing parameters or payload structures.');
      error.statusCode = 400;
      throw error;
    }

    // 1. Fetch AI evaluation array
    const evaluationData = await evaluateAnswersWithAI(role, difficulty, answers);
    const evaluationsArray = evaluationData.evaluations;

    // 2. Compute overall performance scores mathematically 
    const overallTech = evaluationsArray.reduce((sum, item) => sum + item.technicalScore, 0) / evaluationsArray.length;
    const overallComm = evaluationsArray.reduce((sum, item) => sum + item.communicationScore, 0) / evaluationsArray.length;

    // 3. Re-map answers alongside evaluation updates to match DB schema
    const combinedEvaluations = evaluationsArray.map((evalItem, index) => ({
      question: evalItem.question,
      topic: answers[index].topic,
      userAnswer: answers[index].answer,
      technicalScore: evalItem.technicalScore,
      communicationScore: evalItem.communicationScore,
      strengths: evalItem.strengths,
      missingPoints: evalItem.missingPoints,
      improvedAnswer: evalItem.improvedAnswer
    }));

    // 4. Save seamlessly to MongoDB Atlas/Local instance
    const savedSession = await Interview.create({
      role,
      difficulty,
      evaluations: combinedEvaluations,
      overallTechnicalScore: Number(overallTech.toFixed(1)),
      overallCommunicationScore: Number(overallComm.toFixed(1))
    });

    // 5. Send payload back including the newly minted MongoDB database record ID
    return res.status(200).json({
      success: true,
      interviewId: savedSession._id,
      data: evaluationsArray,
    });
  } catch (error) {
    next(error);
  }
};
/**
 * @desc    Fetch all past interview sessions from the database
 * @route   GET /api/interview/history
 */
export const handleGetHistory = async (req, res, next) => {
  try {
    // Fetch all records, sorted by newest first
    const history = await Interview.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (error) {
    next(error);
  }
};