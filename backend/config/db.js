// config/db.js
// Handles the MongoDB connection using Mongoose

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/resume-analyzer';
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    // Exit process with failure so the issue is obvious during development
    process.exit(1);
  }
};

module.exports = connectDB;
