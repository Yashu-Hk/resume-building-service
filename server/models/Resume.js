const mongoose = require('mongoose');

const Resume = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user 
    personalInfo: {
        fullName: { type: String, required: true },
        email: { type: String, required: true },
        phone: String,
        address: String,
    },
    education: [{
        institute: { type: String, required: true },
        degree: { type: String, required: true },
        fieldOfStudy: { type: String, required: true },
        graduationYear: { type: Number,required: true },
        cgpa: {type: Number, min: 0, max: 10},
    }],
    workExperience: [{
        company: { type: String, required: true },
        position: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: Date,
    }],
    skills: [{ type: String, required: true }],
    projects: [{
        title: { type: String, required: true },
        description: String,
        startDate: { type: Date },
        endDate: { type: Date },
        technologies: {  type: [String] },
        repository: {  type: String },
        // Add more project details as needed
    }],
    certifications: [{
        title: { type: String, required: true },
        authority: String,
        dateIssued: { type: Date, required: true },
        dateExpires: { type: Date },
        // Add more certification details as needed
    }],
    languages: [{ type: String }],
    hobbies: [{ type: String }],
    clubs: [{ type: String }],
    references: [{
        name: String,
        reference: String,
       
    }],
    // Add more sections as needed
}, { timestamps: true });

// Ensure userId is converted to ObjectId before saving
Resume.pre('save', function(next) {
    if (this.userId && typeof this.userId === 'string') {
        this.userId = mongoose.Types.ObjectId(this.userId);
    }
    next();
});

module.exports = mongoose.model('Resume', Resume);