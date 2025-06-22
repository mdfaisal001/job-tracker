// models/Interview.js
const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String, // Optional: "10:00 AM", "2:30 PM"
    default: '',
  },
  round: {
    type: String,
    enum: ['HR', 'Technical', 'Managerial', 'Final', 'Other'],
    default: 'HR',
  },
  location: {
    type: String, // Optional: "Video Call", "Office Visit"
    default: 'Online',
  },
  company: {
    type: String, // Optional: Used in your calendar display
    default: 'Unknown',
  },
  notes: {
    type: String,
    default: '',
  }
}, { timestamps: true });

module.exports = mongoose.model('Interview', interviewSchema);
