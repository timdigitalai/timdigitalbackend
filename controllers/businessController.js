const Business = require('../models/Business');

// Register a new business
const registerBusiness = async (req, res) => {
  const { name, description, location, category } = req.body;
  const owner = req.user._id;

  try {
    const business = new Business({ name, description, location, category, owner });
    await business.save();
    res.status(201).json({ message: 'Business registered successfully', business });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all businesses
const getBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find().populate('owner', 'name email');
    res.status(200).json({ businesses });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get business details
const getBusinessDetails = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id).populate('owner', 'name email');
    if (!business) return res.status(404).json({ message: 'Business not found' });
    res.status(200).json({ business });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update business details
const updateBusiness = async (req, res) => {
  try {
    const business = await Business.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!business) return res.status(404).json({ message: 'Business not found' });
    res.status(200).json({ business });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete business
const deleteBusiness = async (req, res) => {
  try {
    const business = await Business.findByIdAndDelete(req.params.id);
    if (!business) return res.status(404).json({ message: 'Business not found' });
    res.status(200).json({ message: 'Business deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Upload images for business (Dummy Implementation)
const uploadBusinessImages = async (req, res) => {
  res.status(200).json({ message: 'Images uploaded successfully' });
};

// Add contact details to a business (Dummy Implementation)
const addContactDetails = async (req, res) => {
  res.status(200).json({ message: 'Contact details added successfully' });
};



module.exports = { 
  registerBusiness, 
  uploadBusinessImages,    
  addContactDetails, 
  getBusinesses, 
  getBusinessDetails, 
  updateBusiness, 
  deleteBusiness 
};

