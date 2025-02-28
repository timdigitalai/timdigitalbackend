const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], required: true }
  },
  description: { type: String },
  images: [{ type: String }],
  contact: {
    phone: { type: String },
    website: { type: String },
    socialMedia: [{ type: String }]
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

businessSchema.index({ location: '2dsphere' }); // For geospatial queries

module.exports = mongoose.model('Business', businessSchema);