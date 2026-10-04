// controllers/resumeController.js
const path = require('path');
const Resume = require('../models/Resume');
const AnalysisResult = require('../models/AnalysisResult');
const { runResumeParser } = require('../utils/pythonRunner');

// A simple demo ATS score generator for Review 2.
// Replace this with a real scoring algorithm in a later phase.
const calculateDemoAtsScore = (skillsCount) => {
  const base = 60;
  const bonus = Math.min(skillsCount * 3, 30);
  return Math.min(base + bonus, 98);
};

// @route  POST /api/resume/upload
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No PDF file was uploaded' });
    }

    const filePath = req.file.path;

    // Run the Python parser to extract text + skills
    const parsedData = await runResumeParser(filePath);

    const resume = await Resume.create({
      userId: req.user.id,
      fileName: req.file.originalname,
      filePath: req.file.path,
      extractedText: parsedData.text || '',
      skills: parsedData.skills || [],
    });

    const atsScore = calculateDemoAtsScore(resume.skills.length);

    const analysis = await AnalysisResult.create({
      resumeId: resume._id,
      atsScore,
      matchedSkills: [],
      missingSkills: [],
      matchScore: 0,
    });

    res.status(201).json({
      message: 'Resume uploaded and parsed successfully',
      resume: {
        id: resume._id,
        fileName: resume.fileName,
        skills: resume.skills,
        extractedText: resume.extractedText,
        uploadedAt: resume.uploadedAt,
      },
      analysis: {
        id: analysis._id,
        atsScore: analysis.atsScore,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Resume upload/parsing failed', error: error.message });
  }
};

// @route  GET /api/resume
const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user.id }).sort({ uploadedAt: -1 });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch resumes', error: error.message });
  }
};

// @route  GET /api/resume/:id
const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user.id });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch resume', error: error.message });
  }
};

module.exports = { uploadResume, getResumes, getResumeById };
