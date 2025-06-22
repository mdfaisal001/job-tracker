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
  round: {
    type: String,
    enum: ['HR', 'Technical', 'Managerial', 'Final', 'Other'],
    default: 'HR',
  },
  notes: {
    type: String,
    default: '',
  }
}, { timestamps: true });

module.exports = mongoose.model('Interview', interviewSchema);
