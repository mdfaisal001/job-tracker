const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // adjust if needed


// 🔐 Middleware to protect routes
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ message: 'Unauthorized' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// ✅ REGISTER
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'Registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("🔐 Email:", email);
    console.log("🔐 Password entered:", password);

    const user = await User.findOne({ email });
    console.log("📁 User from DB:", user);

    if (!user)
      return res.status(400).json({ message: 'Invalid credentials - user not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("✅ Password Match:", isMatch);

    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials - password mismatch' });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log("🎫 Token issued:", token);
    res.json({ token });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: 'Server error' });
  }
});


// 🔐 GET USER PROFILE (Protected)
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    console.error('❌ Profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;
