var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const db = require('./config/db.js')
const userAuthRoutes = require('./routes/user.auth.routes.js');
const businessRoutes = require('./routes/business.routes.js');
const reviewRoutes = require('./routes/review.routes.js');
const recommendationRoutes = require('./routes/recommendations.routes');
const adminRoutes = require('./routes/admin.auth.routes.js');
const wishlistRoutes = require('./routes/wishlist.routes.js');
const notificationRoutes = require('./routes/notification.routes.js');
const shareRoutes = require('./routes/share.routes.js');
const travellerRouter = require('./routes/traveller.routes.js')
require("dotenv").config();

db()

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use('/auth', userAuthRoutes);
app.use('/businesses', businessRoutes);
app.use('/reviews', reviewRoutes);
app.use('/recommendations', recommendationRoutes);
app.use('/admin', adminRoutes);
app.use('/wishlist', wishlistRoutes);
app.use('/notifications', notificationRoutes);
app.use('/share', shareRoutes);
app.use('/traveller', travellerRouter);

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

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
