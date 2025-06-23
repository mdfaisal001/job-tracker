const router = require('express').Router();
const Interview = require('../models/Interview');
const auth = require('../middleware/authMiddleware');
const sendEmail = require('../utils/sendEmail');
const User = require('../models/User'); // ✅ Add this line
router.post('/', auth, async (req, res) => {
  try {
    const { jobTitle, date, time, round, location, company, notes } = req.body;

    // Combine date and time into one Date object (UTC)
    const dateTime = new Date(`${date}T${time}:00.000Z`);

    const interview = new Interview({
      jobTitle,
      user: req.user.userId,
      date: dateTime,
      time,
      round,
      location,
      company,
      notes,
    });

    await interview.save();

    // ✅ Fetch user details using userId from token
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // ✅ Send confirmation email
    await sendEmail({
      to: user.email,
      subject: `📅 Interview Scheduled: ${round} at ${company}`,
      html: `
        <p>Hi ${user.name || 'User'},</p>

        <p>🎉 Great news! Your <strong>${round}</strong> interview for the role of <strong>${jobTitle}</strong> at <strong>${company}</strong> has been successfully scheduled.</p>

        <p>Here are the details:</p>
        <ul>
          <li>🗓️ <strong>Date:</strong> ${date}</li>
          <li>🕒 <strong>Time:</strong> ${time}</li>
          <li>📍 <strong>Location:</strong> ${location}</li>
          <li>💬 <strong>Notes:</strong> ${notes || 'None'}</li>
        </ul>

        <p>🚀 Wishing you all the very best! Be confident, stay calm, and give it your best shot. You've got this! 💪</p>

        <hr/>
        <p>Good luck!<br/>— <strong>Job Pilot Team</strong></p>
      `,
    });

    res.status(201).json(interview);
  } catch (err) {
    console.error('❌ Interview Create Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Get All Interviews
router.get('/', auth, async (req, res) => {
  try {
    const interviews = await Interview.find({ user: req.user.userId }).sort({ date: 1 });
    res.json(interviews);
  } catch (err) {
    console.error('❌ Fetch Interviews Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Update Interview
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

// ✅ Delete Interview
router.delete('/:id', auth, async (req, res) => {
  try {
    await Interview.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
    res.json({ message: 'Interview deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
