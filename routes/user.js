// routes/user.js
const express = require('express');
const User = require('../models/user'); // User model
const authenticateJWT = require('../middleware/auth'); // JWT authentication middleware
const router = express.Router();

// Get user profile
router.get('/profile', authenticateJWT, async (req, res) => {
    try {
        const userId = req.user.userId; // Get user ID from JWT
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.status(200).json({
            name: user.name,
            email: user.email,
            phone: user.phone,
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({
            message: 'Server error'
        });
    }
});

// Update user profile
router.put('/profile', authenticateJWT, async (req, res) => {
    const {
        name,
        email,
        phone
    } = req.body;
    try {
        const userId = req.user.userId; // Get user ID from JWT
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        // Update user profile
        user.name = name || user.name;
        user.email = email || user.email;
        user.phone = phone || user.phone;
        await user.save();

        res.status(200).json({
            message: 'Profile updated successfully'
        });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({
            message: 'Server error'
        });
    }
});

module.exports = router;