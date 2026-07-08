// server/models/Interview.model.js
import mongoose from 'mongoose';

const EvaluationItemSchema = new mongoose.Schema({
  question: { type: String, required: true },
  topic: { type: String, required: true },
  userAnswer: { type: String, required: true },
  technicalScore: { type: Number, required: true },
  communicationScore: { type: Number, required: true },
  strengths: [{ type: String }],
  missingPoints: [{ type: String }],
  improvedAnswer: { type: String }
});

const InterviewSchema = new mongoose.Schema({
  role: { 
    type: String, 
    required: true,
    enum: ['Frontend Developer', 'Backend Developer', 'Full Stack Developer']
  },
  difficulty: { 
    type: String, 
    required: true,
    enum: ['Easy', 'Medium', 'Hard']
  },
  evaluations: [EvaluationItemSchema],
  overallTechnicalScore: { type: Number, required: true },
  overallCommunicationScore: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Interview', InterviewSchema);