const mongoose = require("mongoose");

const BusinessSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  category: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  images: [{ type: String }],
  contact: {
    phoneNumber: { type: String },
    website: { type: String },
    socialLinks: [{ type: String }],
  },
  rating: { type: Number, default: 0 },
});

module.exports = mongoose.model("Business", BusinessSchema);
