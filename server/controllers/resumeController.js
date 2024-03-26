const mongoose = require('mongoose')
const Resume = require("../models/Resume");

exports.getAllResumes = async (req, res) => {
  try {
    const resumes = await Resume.find();
    res.status(200).json(resumes);
  } catch (error) {
    console.error("Error getting all resumes:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }
    res.status(200).json(resume);
  } catch (error) {
    console.error("Error getting resume by ID:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.createResume = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    const { userId, ...resumeData } = req.body;

    // Check if userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId format" });
    }

    const userIdObject = new mongoose.Types.ObjectId(userId); // Correct usage of new keyword

    const newResume = new Resume({
      userId: userIdObject,
      ...resumeData,
    });

    await newResume.save();

    res.status(201).json(newResume);
  } catch (error) {
    console.error("Error creating resume:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.updateResumeById = async (req, res) => {
  try {
    const updatedResume = await Resume.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedResume) {
      return res.status(404).json({ error: "Resume not found" });
    }
    res.status(200).json(updatedResume);
  } catch (error) {
    console.error("Error updating resume by ID:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.deleteResumeById = async (req, res) => {
  try {
    const deletedResume = await Resume.findByIdAndDelete(req.params.id);
    if (!deletedResume) {
      return res.status(404).json({ error: "Resume not found" });
    }
    res.status(200).json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.error("Error deleting resume by ID:", error);
    res.status(500).json({ error: "Server Error" });
  }
};