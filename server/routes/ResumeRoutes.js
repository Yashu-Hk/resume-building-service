const express = require('express');
const router = express.Router();
const { getAllResumes, getResumeById, createResume, updateResumeById, deleteResumeById } = require('../controllers/resumeController');

// GET all resumes
router.get('/', getAllResumes);

// GET a single resume by ID
router.get('/:id', getResumeById);

// POST create a new resume
router.post('/', createResume);

// PUT update a resume by ID
router.put('/:id', updateResumeById);

// DELETE delete a resume by ID
router.delete('/:id', deleteResumeById);

module.exports = router;