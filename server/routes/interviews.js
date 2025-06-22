const router = require('express').Router();
const Interview = require('../models/Interview');
const auth = require('../middleware/authMiddleware');

// ✅ Create Interview with plain jobTitle
router.post('/', auth, async (req, res) => {
  try {
    const { jobTitle, date, time, round, location, company, notes } = req.body;

    const interview = new Interview({
      jobTitle,
      user: req.user.userId,
      date,
      time,         // ✅ capture time
      round,
      location,     // ✅ capture location
      company,      // ✅ capture company (optional)
      notes,
    });

    await interview.save();
    res.status(201).json(interview);
  } catch (err) {
    console.error('❌ Interview Create Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Get All Interviews for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const interviews = await Interview.find({ user: req.user.userId }).sort({
      date: 1,
    });

    res.json(interviews);
  } catch (err) {
    console.error('❌ Fetch Interviews Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
// PUT /api/interviews/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const updated = await Interview.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
// DELETE /api/interviews/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    await Interview.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
    res.json({ message: 'Interview deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
