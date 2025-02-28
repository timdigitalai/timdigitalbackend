const Business = require('../models/Business');

// Create a new business
exports.createBusiness = async (req, res) => {
  const { name, category, location, description, images, contact } = req.body;
  try {
    const business = new Business({ name, category, location, description, images, contact, owner: req.user.id });
    await business.save();
    res.status(201).json(business);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all businesses
exports.getAllBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find();
    res.json(businesses);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};