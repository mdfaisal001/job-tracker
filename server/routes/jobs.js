const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const auth = require('../middleware/authMiddleware');

// 📥 Create Job
router.post('/', auth, async (req, res) => {
  try {
    const job = new Job({ ...req.body, userId: req.user.userId });
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: 'Error creating job' });
  }
});

// 📄 Get All Jobs
router.get('/', auth, async (req, res) => {
  try {
    const jobs = await Job.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching jobs' });
  }
});
// PUT /api/jobs/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const updated = await Job.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Job not found or unauthorized' });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/jobs/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!job)
      return res.status(404).json({ message: 'Job not found or unauthorized' });

    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    console.error('❌ Delete job error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;
