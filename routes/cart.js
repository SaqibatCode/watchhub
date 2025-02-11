// routes/cart.js
const express = require('express');
const authenticateJWT = require('../middleware/auth'); // JWT authentication middleware
const router = express.Router();

// Dummy products data (replace with real product data in a real app)
const products = [{
        id: 1,
        name: 'Watch A',
        price: 100
    },
    {
        id: 2,
        name: 'Watch B',
        price: 200
    },
    {
        id: 3,
        name: 'Watch C',
        price: 150
    },
];

// Dummy cart data (in-memory, replace with DB in a real app)
let carts = {};

// Helper function to get cart for a user
const getCart = (userId) => {
    if (!carts[userId]) {
        carts[userId] = []; // Initialize empty cart if none exists
    }
    return carts[userId];
};

// Get current user's cart
router.get('/', authenticateJWT, (req, res) => {
    const userId = req.user.userId;
    const cart = getCart(userId);
    res.status(200).json(cart);
});

// Add a product to the cart
router.post('/add', authenticateJWT, (req, res) => {
    const userId = req.user.userId;
    const {
        productId,
        quantity
    } = req.body;

    const product = products.find(p => p.id === productId);
    if (!product) {
        return res.status(404).json({
            message: 'Product not found'
        });
    }

    const cart = getCart(userId);
    const existingItem = cart.find(item => item.productId === productId);

    if (existingItem) {
        existingItem.quantity += quantity; // Update quantity
    } else {
        cart.push({
            productId,
            quantity,
            price: product.price
        });
    }

    res.status(200).json({
        message: 'Product added to cart',
        cart
    });
});

// Update quantity of a product in the cart
router.put('/update', authenticateJWT, (req, res) => {
    const userId = req.user.userId;
    const {
        productId,
        quantity
    } = req.body;

    const cart = getCart(userId);
    const item = cart.find(item => item.productId === productId);

    if (!item) {
        return res.status(404).json({
            message: 'Product not in cart'
        });
    }

    item.quantity = quantity;
    res.status(200).json({
        message: 'Cart updated',
        cart
    });
});

// Remove a product from the cart
router.delete('/remove', authenticateJWT, (req, res) => {
    const userId = req.user.userId;
    const {
        productId
    } = req.body;

    const cart = getCart(userId);
    const index = cart.findIndex(item => item.productId === productId);

    if (index === -1) {
        return res.status(404).json({
            message: 'Product not found in cart'
        });
    }

    cart.splice(index, 1); // Remove product
    res.status(200).json({
        message: 'Product removed from cart',
        cart
    });
});

// Get total price of the cart
router.get('/total', authenticateJWT, (req, res) => {
    const userId = req.user.userId;
    const cart = getCart(userId);

    const total = cart.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    res.status(200).json({
        total
    });
});

module.exports = router;