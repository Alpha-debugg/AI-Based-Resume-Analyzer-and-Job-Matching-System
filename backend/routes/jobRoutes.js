// routes/jobRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createJob, getJobs } = require('../controllers/jobController');

router.post('/', protect, createJob);
router.get('/', protect, getJobs);

module.exports = router;
