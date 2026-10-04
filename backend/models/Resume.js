// models/Resume.js
const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  extractedText: {
    type: String,
    default: '',
  },
  skills: {
    type: [String],
    default: [],
  },
});

module.exports = mongoose.model('Resume', ResumeSchema);
