// controllers/jobController.js
const Job = require('../models/Job');
const Resume = require('../models/Resume');
const AnalysisResult = require('../models/AnalysisResult');

// A small predefined skill list used to pull "required skills" out of a
// pasted job description. Kept simple on purpose for Review 2 -- this is
// the piece that gets swapped for TF-IDF / cosine similarity / a
// transformer-based model in a later phase.
const KNOWN_SKILLS = [
  'Python', 'JavaScript', 'C', 'C++', 'HTML', 'CSS',
  'React.js', 'React', 'Node.js', 'Express.js', 'MongoDB', 'MySQL', 'SQL',
  'Git', 'GitHub', 'REST API', 'Machine Learning', 'NLP', 'Docker', 'AWS',
];

// Escapes regex special characters in a skill name before building a pattern
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const extractSkillsFromText = (text) => {
  const lower = text.toLowerCase();
  return KNOWN_SKILLS.filter((skill) => {
    const skillLower = skill.toLowerCase();
    const escaped = escapeRegex(skillLower);
    // Alphanumeric-only skills (e.g. "sql") use \b word boundaries so they
    // don't match inside unrelated words (e.g. "SQL" inside "SQLite").
    // Skills with symbols (e.g. "node.js") use a boundary based on
    // surrounding non-alphanumeric characters instead, since \b doesn't
    // behave usefully around '.' or '+'.
    const pattern = /^[a-z0-9]+$/.test(skillLower)
      ? new RegExp(`\\b${escaped}\\b`)
      : new RegExp(`(?<![a-z0-9])${escaped}(?![a-z0-9])`);
    return pattern.test(lower);
  });
};

// @route  POST /api/jobs
const createJob = async (req, res) => {
  try {
    const { title, company, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Job title and description are required' });
    }

    const requiredSkills = extractSkillsFromText(description);

    const job = await Job.create({
      title,
      company,
      description,
      requiredSkills,
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create job', error: error.message });
  }
};

// @route  GET /api/jobs
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch jobs', error: error.message });
  }
};

// @route  POST /api/analyze
// Body: { resumeId, jobId }  OR  { resumeId, jobDescription }
// Compares the resume's extracted skills against the job's required skills.
const analyzeMatch = async (req, res) => {
  try {
    const { resumeId, jobId, jobDescription } = req.body;

    if (!resumeId) {
      return res.status(400).json({ message: 'resumeId is required' });
    }

    const resume = await Resume.findOne({ _id: resumeId, userId: req.user.id });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    let requiredSkills = [];

    if (jobId) {
      const job = await Job.findById(jobId);
      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }
      requiredSkills = job.requiredSkills;
    } else if (jobDescription) {
      requiredSkills = extractSkillsFromText(jobDescription);
    } else {
      return res.status(400).json({ message: 'Either jobId or jobDescription is required' });
    }

    const resumeSkillsLower = resume.skills.map((s) => s.toLowerCase());
    const matchedSkills = requiredSkills.filter((skill) =>
      resumeSkillsLower.includes(skill.toLowerCase())
    );
    const missingSkills = requiredSkills.filter(
      (skill) => !resumeSkillsLower.includes(skill.toLowerCase())
    );

    const matchScore = requiredSkills.length
      ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
      : 0;

    const analysis = await AnalysisResult.create({
      resumeId: resume._id,
      atsScore: 78, // demo placeholder, replaceable later
      matchedSkills,
      missingSkills,
      matchScore,
    });

    res.status(201).json(analysis);
  } catch (error) {
    res.status(500).json({ message: 'Analysis failed', error: error.message });
  }
};

// @route  GET /api/analyze/:id
const getAnalysisById = async (req, res) => {
  try {
    const analysis = await AnalysisResult.findById(req.params.id);
    if (!analysis) {
      return res.status(404).json({ message: 'Analysis result not found' });
    }
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch analysis', error: error.message });
  }
};

module.exports = { createJob, getJobs, analyzeMatch, getAnalysisById };
