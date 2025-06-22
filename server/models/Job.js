const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    company: { type: String, required: true },
    position: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Interview', 'Declined'], default: 'Pending' },
    link: String,
    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
