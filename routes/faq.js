// routes/faq.js
const express = require('express');
const Faq = require('../models/faq'); // FAQ model
const router = express.Router();

// Get all FAQs
router.get('/', async (req, res) => {
  try {
    const faqs = await Faq.findAll();
    res.status(200).json(faqs);
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
