const express = require('express');
const sequelize = require('./models');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const cartRoutes = require('./routes/cart');
const productRoutes = require('./routes/product');
const wishlistRoutes = require('./routes/wishlist');
const orderRoutes = require('./routes/order');
const reviewRoutes = require('./routes/review');
const supportRoutes = require('./routes/support');
const faqRoutes = require('./routes/faq');
const adminRoutes = require('./routes/admin');

const app = express();

// Middleware
app.use(express.json());

// Define routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/products', productRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/admin', adminRoutes);

// Export the app as a handler for Vercel
module.exports = app;

// Connect to the database when the app is initialized
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
})();
