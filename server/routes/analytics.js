const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Job = require('../models/Job');

router.get('/', auth, async (req, res) => {
  const statusCount = await Job.aggregate([
    { $match: { user: req.user.userId } },
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);

  const monthlyApps = await Job.aggregate([
    { $match: { user: req.user.userId } },
    {
      $group: {
        _id: { $month: '$createdAt' },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id': 1 } }
  ]);

  res.json({ statusCount, monthlyApps });
});

module.exports = router;
