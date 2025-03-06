const mongoose = require("mongoose");

const travellerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    companyName: { type: String },
    address1: { type: String },
    address2: { type: String },
    address3: { type: String },
    city: { type: String },
    country: { type: String, required: true },
    dateOfBirth: { type: Date },
    nationality: { type: String },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    mobile: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Traveller", travellerSchema);
