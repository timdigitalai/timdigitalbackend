const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

/**
 * Generate JWT token for user authentication
 * @param {Object} user - User object containing _id, email, and role
 * @returns {string} JWT token
 */
const generateToken = (user) => {
    return jwt.sign(
        { 
            id: user._id, 
            email: user.email,
            role: user.role 
        }, 
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

/**
 * User registration controller
 */
exports.signup = async (req, res) => {
    try {
        const { name, email, password, role = 'user' } = req.body;

        // Basic validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Create user
        const user = await User.create({
            name: name || email.split('@')[0],
            email: email.toLowerCase(),
            password: hashedPassword,
            role
        });

        // Generate token
        const token = generateToken(user);

        // Log the hashed password for debugging
        console.log('Created user with hashed password:', hashedPassword);

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * User login controller
 */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Basic validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });
        
        // Debug logs
        console.log('Login attempt for:', email);
        console.log('User found:', user ? 'Yes' : 'No');
        if (user) {
            console.log('Stored hashed password:', user.password);
        }

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Compare passwords
        try {
            const isMatch = await bcrypt.compare(password, user.password);
            console.log('Password comparison:', {
                provided: password,
                storedHash: user.password,
                isMatch: isMatch
            });

            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }
        } catch (err) {
            console.error('Password comparison error:', err);
            return res.status(500).json({
                success: false,
                message: 'Error during login'
            });
        }

        // Generate token
        const token = generateToken(user);

        // Success response
        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * User logout controller
 */
exports.logout = (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Logout successful'
    });
};

/**
 * Get current user profile controller
 */
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user profile',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Update user profile controller
 */
exports.updateProfile = async (req, res) => {
    try {
        const { name, email, profilePic } = req.body;
        const userId = req.user.id;

        // Prepare update data
        const updateData = {
            ...(name?.trim() && { name: name.trim() }),
            ...(email?.trim() && { email: email.toLowerCase().trim() }),
            ...(profilePic && { profilePic })
        };

        // Check if email is being updated and is already taken
        if (email) {
            const existingUser = await User.findOne({ 
                email: email.toLowerCase(),
                _id: { $ne: userId }
            });
            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: 'Email is already in use'
                });
            }
        }

        // Update user profile
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Change user password controller
 */
exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        // Validate required fields
        if (!oldPassword?.trim() || !newPassword?.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Old and new passwords are required'
            });
        }

        // Get user with password
        const user = await User.findById(req.user.id).select('+password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Verify old password
        const isValidPassword = await bcrypt.compare(oldPassword, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Update password
        user.password = await bcrypt.hash(newPassword, 12);
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to change password',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
