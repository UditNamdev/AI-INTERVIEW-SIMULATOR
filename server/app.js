import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import interviewRoutes from './routes/interview.routes.js';

// load environment variables immediately upon startup

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Configured CORS to accept connections from local development AND your future live production site
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// build-in global request body parser
app.use(express.json());

// operational Baseline and health check route
app.get('/health',(req,res)=>{
    res.status(200).json({
        status: 'server is operationally healthy',
        message: 'GateWay operational'
    });
});

app.use('/api/interview', interviewRoutes);

app.use(errorHandler);

// establish server listener
app.listen(PORT, () => {
    console.log(`gateway established. server active listening on port ${PORT}`);
});

