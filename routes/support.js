// routes/support.js
const express = require('express');
const authenticateJWT = require('../middleware/auth'); // JWT authentication middleware
const Ticket = require('../models/ticket'); // Ticket model
const router = express.Router();

// Submit a support ticket
router.post('/submit', authenticateJWT, async (req, res) => {
    const userId = req.user.userId;
    const {
        subject,
        message
    } = req.body;

    try {
        const ticket = await Ticket.create({
            userId,
            subject,
            message,
        });

        res.status(201).json({
            message: 'Ticket submitted successfully',
            ticket
        });
    } catch (error) {
        console.error('Error submitting ticket:', error);
        res.status(500).json({
            message: 'Server error'
        });
    }
});

// Get all tickets for a user
router.get('/', authenticateJWT, async (req, res) => {
    const userId = req.user.userId;

    try {
        const tickets = await Ticket.findAll({
            where: {
                userId
            }
        });
        res.status(200).json(tickets);
    } catch (error) {
        console.error('Error fetching tickets:', error);
        res.status(500).json({
            message: 'Server error'
        });
    }
});

module.exports = router;