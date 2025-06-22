const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const Job = require('../models/Job');
const Interview = require('../models/Interview');

router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    const jobs = await Job.find({ userId });
    const interviews = await Interview.find({ user: userId });

    // Status count
    const statusCounts = jobs.reduce((acc, job) => {
      acc[job.status] = (acc[job.status] || 0) + 1;
      return acc;
    }, {});

    // Round count
    const roundCounts = interviews.reduce((acc, iv) => {
      acc[iv.round] = (acc[iv.round] || 0) + 1;
      return acc;
    }, {});

    // Job applications by month
    const jobAppsByMonth = {};
    jobs.forEach(job => {
      const month = new Date(job.createdAt).toLocaleString('default', {
        month: 'short',
        year: 'numeric',
      });
      jobAppsByMonth[month] = (jobAppsByMonth[month] || 0) + 1;
    });

    // Upcoming interviews (sorted by date)
    const upcomingInterviews = await Interview.find({
      user: userId,
      date: { $gte: new Date() },
    })
      .sort({ date: 1 })
      .limit(5);

    res.json({
      totalJobs: jobs.length,
      statusCounts,
      totalInterviews: interviews.length,
      roundCounts,
      jobAppsByMonth,
      upcomingInterviews,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Analytics error' });
  }
});

module.exports = router;
