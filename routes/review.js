// routes/review.js
const express = require('express');
const authenticateJWT = require('../middleware/auth');
const Review = require('../models/review');
const Product = require('../models/product');
const router = express.Router();

// Add a review
router.post('/', authenticateJWT, async (req, res) => {
    const {
        productId,
        rating,
        comment
    } = req.body;
    const userId = req.user.userId;

    const product = await Product.findByPk(productId);
    if (!product) {
        return res.status(404).json({
            message: 'Product not found'
        });
    }

    const review = await Review.create({
        productId,
        userId,
        rating,
        comment,
    });

    res.status(201).json({
        message: 'Review added successfully',
        review,
    });
});

// Get all reviews for a product
router.get('/:productId', async (req, res) => {
    const productId = req.params.productId;
    const reviews = await Review.findAll({
        where: {
            productId
        }
    });

    res.status(200).json(reviews);
});

module.exports = router;