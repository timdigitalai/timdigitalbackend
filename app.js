var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const db = require('./config/db.js')
const authRoutes = require('./routes/authRoutes');
const businessRoutes = require('./routes/businessRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const userRoutes = require('./routes/userRoutes');
const travellerRouter = require('./routes/route.traveller')
require("dotenv").config();

// Connect to the database
db()

var app = express();

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Routes
app.use('/auth', authRoutes);
app.use('/businesses', businessRoutes);
app.use("/reviews", reviewRoutes);
app.use('/recommendations', recommendationRoutes);
app.use('/admin', adminRoutes);
app.use('/wishlist', wishlistRoutes);
app.use('/user', userRoutes);
app.use('/traveller', travellerRouter);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.status || 500;
  const message = req.app.get('env') === 'development' ? err.message : 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message: message,
    ...(req.app.get('env') === 'development' && { stack: err.stack })
  });
});

module.exports = app;
