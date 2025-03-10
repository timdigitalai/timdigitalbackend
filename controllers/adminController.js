const Business = require('../models/Business');
const multer = require('multer');
const path = require('path');

// Setup multer for image uploading
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/business_images');
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    cb(null, `${Date.now()}${fileExtension}`);
  },
});

const upload = multer({ storage: storage }).array('images', 5); 

// Get all businesses awaiting approval
exports.getPendingBusinesses = async (req, res) => {
  try {
    const pendingBusinesses = await Business.find({ status: 'pending' });
    res.status(200).json(pendingBusinesses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending businesses', error: error.message });
  }
};

// Approve a business registration
exports.approveBusiness = async (req, res) => {
  try {
    const business = await Business.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
    res.status(200).json({ message: 'Business approved successfully', business });
  } catch (error) {
    res.status(500).json({ message: 'Error approving business', error: error.message });
  }
};

// Reject a business registration
exports.rejectBusiness = async (req, res) => {
  try {
    const business = await Business.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true });
    res.status(200).json({ message: 'Business rejected successfully', business });
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting business', error: error.message });
  }
};

// Remove a business listing
exports.removeBusiness = async (req, res) => {
  try {
    await Business.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Business removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing business', error: error.message });
  }
};

// Add images to the business profile
exports.uploadBusinessImages = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error uploading images', error: err.message });
    }

    try {
      const business = await Business.findById(req.params.id);
      if (!business) return res.status(404).json({ message: 'Business not found' });

      const images = req.files.map(file => file.path); 
      business.images.push(...images);
      await business.save();

      res.status(200).json({ message: 'Images uploaded successfully', images: business.images });
    } catch (error) {
      res.status(500).json({ message: 'Error saving images', error: error.message });
    }
  });
};

// Add contact details (phone, website, social links)
exports.addContactDetails = async (req, res) => {
  const { phone, website, socialLinks } = req.body;
  
  try {
    const business = await Business.findById(req.params.id);
    if (!business) return res.status(404).json({ message: 'Business not found' });

    // Add or update contact details
    business.contact = { phone, website, socialLinks };
    await business.save();

    res.status(200).json({ message: 'Contact details added successfully', contact: business.contact });
  } catch (error) {
    res.status(500).json({ message: 'Error adding contact details', error: error.message });
  }
};

// Register a new business
exports.registerBusiness = async (req, res) => {
  const { name, category, location, description } = req.body;

  try {
    const business = new Business({
      owner: req.user.id,
      name,
      category,
      location,
      description,
      status: 'pending',
    });

    await business.save();
    res.status(201).json({ message: 'Business registered successfully', business });
  } catch (error) {
    res.status(500).json({ message: 'Error registering business', error: error.message });
  }
};
