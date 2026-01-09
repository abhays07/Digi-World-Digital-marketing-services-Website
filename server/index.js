require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Lead = require('./models/Lead');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// POST /api/leads
app.post('/api/leads', async (req, res) => {
  try {
    const { name, mobileNumber, email, place } = req.body;

    // Simple validation
    if (!name || !mobileNumber || !email || !place) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newLead = new Lead({
      name,
      mobileNumber,
      email,
      place
    });

    const savedLead = await newLead.save();
    res.status(201).json({ message: 'Lead saved successfully', lead: savedLead });
  } catch (error) {
    console.error('Error saving lead:', error);
    res.status(500).json({ message: 'Server error saving lead' });
  }
});

// GET /api/packages (Mock endpoint)
app.get('/api/packages', (req, res) => {
  const packages = [
    { name: 'Silver', price: 'Starter', features: ['Social Media', 'Graphics'] },
    { name: 'Gold', price: 'Popular', features: ['Video Editing', 'Ads'] },
    { name: 'Diamond', price: 'Premium', features: ['Campaign Management', 'War Room'] }
  ];
  res.json(packages);
});

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/digiworld_db';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
