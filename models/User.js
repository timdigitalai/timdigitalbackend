const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  nationality: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  email: { type: String, required: true, unique: true },
  companyName: { type: String },
  address: { type: String },
  city: { type: String },
  country: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['tourist', 'business', 'admin'], default: 'tourist' },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Business' }],
  socialMediaId: { type: String }, // For social login
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
