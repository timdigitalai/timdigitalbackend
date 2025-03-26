const Business = require("../models/model.business");

// ✅ Register a new business
exports.registerBusiness = async (req, res) => {
  try {
    const { companyName, address, city, country, category } = req.body;
    const ownerId = req.user.id;

    const newBusiness = new Business({
      companyName,
      address,
      city,
      country,
      category,
      owner: ownerId,
    });

    await newBusiness.save();

    res.status(201).json({ success: true, message: "Business registered successfully", business: newBusiness });
  } catch (error) {
    console.error("Business Registration Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ✅ Get all businesses with filters
exports.getAllBusinesses = async (req, res) => {
  try {
    const { category, location, rating } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (location) filter.city = location;
    if (rating) filter.rating = { $gte: rating };

    const businesses = await Business.find(filter);
    res.status(200).json({ success: true, businesses });
  } catch (error) {
    console.error("Get Businesses Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ✅ Get a single business by ID
exports.getBusinessById = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) return res.status(404).json({ success: false, message: "Business not found" });

    res.status(200).json({ success: true, business });
  } catch (error) {
    console.error("Get Business Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ✅ Update business details
exports.updateBusiness = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) return res.status(404).json({ success: false, message: "Business not found" });

    if (business.owner.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: "Unauthorized" });

    Object.assign(business, req.body);
    await business.save();

    res.status(200).json({ success: true, message: "Business updated successfully", business });
  } catch (error) {
    console.error("Update Business Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ✅ Delete a business
exports.deleteBusiness = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) return res.status(404).json({ success: false, message: "Business not found" });

    if (business.owner.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: "Unauthorized" });

    await business.remove();
    res.status(200).json({ success: true, message: "Business deleted successfully" });
  } catch (error) {
    console.error("Delete Business Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ✅ Upload business images
exports.uploadBusinessImages = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) return res.status(404).json({ success: false, message: "Business not found" });

    const images = req.files.map((file) => file.path);
    business.images.push(...images);
    await business.save();

    res.status(200).json({ success: true, message: "Images uploaded successfully", images });
  } catch (error) {
    console.error("Upload Images Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ✅ Add contact details
exports.addBusinessContact = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) return res.status(404).json({ success: false, message: "Business not found" });

    const { phoneNumber, website, socialLinks } = req.body;
    business.contact = { phoneNumber, website, socialLinks };
    await business.save();

    res.status(200).json({ success: true, message: "Contact details added successfully", business });
  } catch (error) {
    console.error("Add Contact Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
