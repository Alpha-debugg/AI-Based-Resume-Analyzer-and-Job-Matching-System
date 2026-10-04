// routes/resumeRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');
const {
  uploadResume,
  getResumes,
  getResumeById,
} = require('../controllers/resumeController');

router.post('/upload', protect, upload.single('resume'), uploadResume);
router.get('/', protect, getResumes);
router.get('/:id', protect, getResumeById);

module.exports = router;
