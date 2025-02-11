// server.js
const express = require('express');
const sequelize = require('./models');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const cartRoutes = require('./routes/cart'); // Cart routes
const productRoutes = require('./routes/product'); // Product routes
const wishlistRoutes = require('./routes/wishlist'); // Wishlist routes
const orderRoutes = require('./routes/order'); // Order routes
const reviewRoutes = require('./routes/review'); // Review routes
const supportRoutes = require('./routes/support'); // Support routes
const faqRoutes = require('./routes/faq'); // FAQ routes
const adminRoutes = require('./routes/admin'); // Admin routes
const app = express();

// Middleware
app.use(express.json());

// Authentication routes
app.use('/api/auth', authRoutes);

// User profile routes
app.use('/api/user', userRoutes);

// Shopping cart routes
app.use('/api/cart', cartRoutes);

// Product routes
app.use('/api/products', productRoutes);

// Wishlist routes
app.use('/api/wishlist', wishlistRoutes); // Add wishlist routes


app.use('/api/orders', orderRoutes); // Add order routes

app.use('/api/reviews', reviewRoutes); // Add review routes

app.use('/api/support', supportRoutes); // Add support routes


app.use('/api/faqs', faqRoutes); // Add FAQ routes

app.use('/api/admin', adminRoutes); // Add admin routes


// Start the server and connect to the database
app.listen(3000, async () => {
    try {
        await sequelize.authenticate(); // Ensure DB connection is working
        await sequelize.sync({ force: false });
        console.log('Database connected and server is running on http://localhost:3000');
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
});