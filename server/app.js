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
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin (e.g. Postman)
      if (!origin) return callback(null, true);

      // Allow any Vercel deployment
      if (origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }

      // Allow configured origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

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

