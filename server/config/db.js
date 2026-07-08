// server/config/db.js
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`🍃 MongoDB Pipeline Active: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Database Connection Failure: ${error.message}`);
    process.exit(1); // Crash gracefully if connection is unviable
  }
};

export default connectDB;