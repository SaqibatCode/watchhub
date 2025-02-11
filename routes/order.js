// routes/order.js
const express = require('express');
const authenticateJWT = require('../middleware/auth'); // JWT authentication middleware
const Order = require('../models/order'); // Order model
const Product = require('../models/product'); // Product model
const router = express.Router();

// Middleware to check if the user is an admin
const checkAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            message: 'Permission denied. Admins only.'
        });
    }
    next(); // Proceed if user is admin
};


router.post('/place', authenticateJWT, async (req, res) => {
    const userId = req.user.userId;
    const {
        cart,
        address
    } = req.body;

    if (!cart || cart.length === 0) {
        return res.status(400).json({
            message: 'Cart is empty'
        });
    }
    if (!address) {
        return res.status(400).json({
            message: 'Address is required'
        });
    }

    let total = 0;
    try {
        for (const item of cart) {
            const product = await Product.findByPk(item.productId);
            if (product) {
                total += product.price * item.quantity;
            }
        }

        const order = await Order.create({
            userId,
            total,
            address,
        });

        res.status(201).json({
            message: 'Order placed successfully',
            orderId: order.id,
        });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({
            message: 'Server error'
        });
    }
});

// Get order history for user
router.get('/', authenticateJWT, async (req, res) => {
    const userId = req.user.userId;
    try {
        const orders = await Order.findAll({
            where: {
                userId
            },
        });
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            message: 'Server error'
        });
    }
});

// Admin view all orders
router.get('/admin', authenticateJWT, checkAdmin, async (req, res) => {
    try {
        const orders = await Order.findAll();
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            message: 'Server error'
        });
    }
});

// Update order status (Admin only)
router.put('/admin/:id', authenticateJWT, checkAdmin, async (req, res) => {
    const {
        status
    } = req.body;
    const orderId = req.params.id;

    try {
        const order = await Order.findByPk(orderId);
        if (order) {
            order.status = status;
            await order.save();
            res.status(200).json({
                message: 'Order status updated',
                order,
            });
        } else {
            res.status(404).json({
                message: 'Order not found',
            });
        }
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({
            message: 'Server error'
        });
    }
});

router.get('/status/:orderId', authenticateJWT, async (req, res) => {
    const userId = req.user.userId;
    const orderId = req.params.orderId;

    try {
        const order = await Order.findOne({
            where: {
                userId,
                id: orderId
            }
        });
        if (!order) {
            return res.status(404).json({
                message: 'Order not found'
            });
        }

        res.status(200).json({
            status: order.status
        });
    } catch (error) {
        console.error('Error fetching order status:', error);
        res.status(500).json({
            message: 'Server error'
        });
    }
});
module.exports = router;