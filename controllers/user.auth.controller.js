const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

exports.signup = async (req, res) => {
  try {
    const { fullName, dateOfBirth, nationality, phoneNumber, gender, email, companyName, address, city, country, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      fullName,
      dateOfBirth,
      nationality,
      phoneNumber,
      gender,
      email,
      companyName,
      address,
      city,
      country,
      password: hashedPassword,
      role,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
    try {
      const { id } = req.params;

      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      await User.findByIdAndDelete(id);
      res.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  };

exports.logout = (req, res) => {
  try {
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.updateUserProfile = async (req, res) => {
    try {
      const { name, dateOfBirth, nationality, phone, gender, companyName, address, city, country } = req.body;

      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      user.name = name || user.name;
      user.dateOfBirth = dateOfBirth || user.dateOfBirth;
      user.nationality = nationality || user.nationality;
      user.phone = phone || user.phone;
      user.gender = gender || user.gender;
      user.companyName = companyName || user.companyName;
      user.address = address || user.address;
      user.city = city || user.city;
      user.country = country || user.country;

      await user.save();

      res.json({ success: true, message: "Profile updated successfully", user });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  };