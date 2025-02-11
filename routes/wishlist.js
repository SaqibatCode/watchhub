// routes/wishlist.js
const express = require('express');
const authenticateJWT = require('../middleware/auth'); // JWT authentication middleware
const Product = require('../models/product'); // Product model
const router = express.Router();

// Dummy wishlist data (in-memory, replace with DB in real app)
let wishlists = {};

// Helper function to get wishlist for a user
const getWishlist = (userId) => {
  if (!wishlists[userId]) {
    wishlists[userId] = []; // Initialize empty wishlist if none exists
  }
  return wishlists[userId];
};

// Get current user's wishlist
router.get('/', authenticateJWT, (req, res) => {
  const userId = req.user.userId;
  const wishlist = getWishlist(userId);
  res.status(200).json(wishlist);
});

// Add a product to the wishlist
router.post('/add', authenticateJWT, async (req, res) => {
  const userId = req.user.userId;
  const { productId } = req.body;

  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const wishlist = getWishlist(userId);
    if (wishlist.find(item => item.productId === productId)) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    wishlist.push({ productId, name: product.name, price: product.price });
    res.status(200).json({ message: 'Product added to wishlist', wishlist });
  } catch (error) {
    console.error('Error adding product to wishlist:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove a product from the wishlist
router.delete('/remove', authenticateJWT, (req, res) => {
  const userId = req.user.userId;
  const { productId } = req.body;

  const wishlist = getWishlist(userId);
  const index = wishlist.findIndex(item => item.productId === productId);

  if (index === -1) {
    return res.status(404).json({ message: 'Product not found in wishlist' });
  }

  wishlist.splice(index, 1); // Remove product from wishlist
  res.status(200).json({ message: 'Product removed from wishlist', wishlist });
});

// Move product from wishlist to cart (using cart API)
router.post('/move-to-cart', authenticateJWT, async (req, res) => {
  const userId = req.user.userId;
  const { productId, quantity } = req.body;

  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const wishlist = getWishlist(userId);
    const productIndex = wishlist.findIndex(item => item.productId === productId);
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not in wishlist' });
    }

    // Add product to the cart (handle cart logic here)
    // After adding to cart, remove from wishlist
    wishlist.splice(productIndex, 1);
    res.status(200).json({ message: 'Product moved to cart', wishlist });
  } catch (error) {
    console.error('Error moving product to cart:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
