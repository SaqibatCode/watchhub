// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // User model
const router = express.Router();
const nodemailer = require('nodemailer');

// Configure nodemailer for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail', // Or any email provider you use
    auth: {
        user: '', // Replace with your email
        pass: '', // Replace with your email password
    },
});
// Register route
router.post('/register', async (req, res) => {
    const {
        name,
        email,
        password,
        address,
        phone,
      
    } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({
            where: {
                email
            }
        });
        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            address,
            phone,
           
        });

        res.status(201).json({
            message: 'User created successfully',
            user: newUser
        });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({
            message: 'Server error'
        });
    }
});


// routes/auth.js (continued)
router.post('/login', async (req, res) => {
    const {
        email,
        password
    } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({
            where: {
                email
            }
        });
        if (!user) {
            return res.status(400).json({
                message: 'Invalid credentials'
            });
        }

        // Compare hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                message: 'Invalid credentials'
            });
        }

        // Generate JWT token
        const token = jwt.sign({
            userId: user.id
        }, 'your_jwt_secret_key', {
            expiresIn: '1h', // Token expiration time
        });

        res.status(200).json({
            message: 'Login successful',
            token
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({
            message: 'Server error'
        });
    }
});

// Password reset request
router.post('/password-reset-request', async (req, res) => {
    const {
        email
    } = req.body;

    const user = await User.findOne({
        where: {
            email
        }
    });
    if (!user) {
        return res.status(404).json({
            message: 'User not found'
        });
    }

    // Create a reset token
    const resetToken = jwt.sign({
        userId: user.id
    }, 'reset_secret_key', {
        expiresIn: '1h'
    });

    // Send reset token to user's email
    const resetLink = `http://localhost:3000/api/auth/password-reset/${resetToken}`;

    try {
        await transporter.sendMail({
            from: 'your-email@gmail.com',
            to: email,
            subject: 'Password Reset Request',
            text: `To reset your password, click the following link: ${resetLink}`,
        });
        res.status(200).json({
            message: 'Password reset link sent to email'
        });
    } catch (error) {
        console.error('Error sending reset email:', error);
        res.status(500).json({
            message: 'Error sending reset email'
        });
    }
});

// Password reset (update password)
router.post('/password-reset/:token', async (req, res) => {
    const {
        token
    } = req.params;
    const {
        newPassword
    } = req.body;

    try {
        const decoded = jwt.verify(token, 'reset_secret_key');
        const user = await User.findByPk(decoded.userId);

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({
            message: 'Password successfully updated'
        });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(400).json({
            message: 'Invalid or expired reset token'
        });
    }
});



module.exports = router;