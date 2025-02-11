// routes/product.js
const express = require('express');
const Product = require('../models/product'); // Product model
const authenticateJWT = require('../middleware/auth'); // JWT authentication middleware
const router = express.Router();

// Get all products with optional filters
router.get('/', async (req, res) => {
    const {
        category,
        minPrice,
        maxPrice
    } = req.query;

    try {
        const where = {};

        if (category) {
            where.category = category;
        }

        if (minPrice) {
            where.price = {
                [Op.gte]: parseFloat(minPrice)
            };
        }

        if (maxPrice) {
            where.price = {
                ...where.price,
                [Op.lte]: parseFloat(maxPrice)
            };
        }

        const products = await Product.findAll({
            where
        });
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            message: 'Server error'
        });
    }
});

// Get a single product by ID
router.get('/:id', async (req, res) => {
    const productId = req.params.id;

    try {
        const product = await Product.findByPk(productId);

        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({
            message: 'Server error'
        });
    }
});

// Add a new product (Admin only)
router.post('/', authenticateJWT, async (req, res) => {
    // Admin check can be added here (e.g. if req.user.role === 'admin')

    const {
        name,
        description,
        price,
        stock,
        image,
        category
    } = req.body;

    try {
        const newProduct = await Product.create({
            name,
            description,
            price,
            stock,
            image,
            category,
        });

        res.status(201).json({
            message: 'Product added successfully',
            product: newProduct,
        });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({
            message: 'Server error'
        });
    }
});

// Update a product (Admin only)
router.put('/:id', authenticateJWT, async (req, res) => {
    // Admin check can be added here (e.g. if req.user.role === 'admin')

    const productId = req.params.id;
    const {
        name,
        description,
        price,
        stock,
        image,
        category
    } = req.body;

    try {
        const product = await Product.findByPk(productId);

        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.stock = stock || product.stock;
        product.image = image || product.image;
        product.category = category || product.category;

        await product.save();

        res.status(200).json({
            message: 'Product updated successfully',
            product,
        });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({
            message: 'Server error'
        });
    }
});

// Delete a product (Admin only)
router.delete('/:id', authenticateJWT, async (req, res) => {
    // Admin check can be added here (e.g. if req.user.role === 'admin')

    const productId = req.params.id;

    try {
        const product = await Product.findByPk(productId);

        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }

        await product.destroy();

        res.status(200).json({
            message: 'Product deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({
            message: 'Server error'
        });
    }
});

module.exports = router;