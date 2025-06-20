const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 5000;

// ✅ Add this BEFORE any routes
app.use(cors({
  origin: 'http://localhost:5173', // React client
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// ✅ Optional: Parse incoming JSON
app.use(express.json());

// ✅ Ping route
app.get('/api/ping', (req, res) => {
  res.send('Pong 🏓 Server is working!');
});

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));
