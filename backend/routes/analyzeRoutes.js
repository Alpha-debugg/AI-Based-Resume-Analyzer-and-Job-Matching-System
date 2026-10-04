// routes/analyzeRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { analyzeMatch, getAnalysisById } = require('../controllers/jobController');

router.post('/', protect, analyzeMatch);
router.get('/:id', protect, getAnalysisById);

module.exports = router;
