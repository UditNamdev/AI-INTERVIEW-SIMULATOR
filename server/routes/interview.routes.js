// server/routes/interview.routes.js
import express from 'express';
import { 
  handleGenerateQuestions, 
  handleEvaluateAnswers,
  handleGetHistory
} from '../controllers/interview.controller.js';

const router = express.Router();

router.post('/generate-questions', handleGenerateQuestions);
router.post('/evaluate', handleEvaluateAnswers);
router.get('/history', handleGetHistory); // <-- ADD NEW ROUTE

export default router;