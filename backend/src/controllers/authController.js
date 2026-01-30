import User from '../models/User.js';
import { generateToken, generateOTP, verifyOTP } from '../config/auth.js';

/**
 * In-memory OTP storage (for mock implementation).
 * In production, use Redis or database with TTL.
 * @type {Map<string, {otp: string, expiry: Date}>}
 */
const otpStore = new Map();

/**
 * Sends OTP to phone number for authentication.
 * This is a mock implementation - integrate with SMS gateway in production.
 * 
 * @async
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 * 
 * @example
 * // POST /api/auth/send-otp
 * // Body: { "phone": "+919876543210" }
 */
const sendOTP = async (req, res) => {
    try {
        const { phone } = req.body;

        if (!phone) {
            return res.status(400).json({
                success: false,
                message: 'Phone number is required',
            });
        }

        // Validate phone format
        const phoneRegex = /^\+?[1-9]\d{9,14}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid phone number format',
            });
        }

        // Generate OTP
        const otp = generateOTP();
        const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes validity

        // Store OTP (in production, store in Redis/DB with TTL)
        otpStore.set(phone, { otp, expiry });

        // Find or create user
        let user = await User.findOne({ phone });
        if (!user) {
            user = await User.create({ phone });
        }

        // Update OTP in user document (optional, for DB-based verification)
        await User.findByIdAndUpdate(user._id, {
            otp,
            otpExpiry: expiry,
        });

        // In production, send OTP via SMS gateway:
        // await smsGateway.send(phone, `Your OTP is: ${otp}`);

        console.log(`📱 OTP sent to ${phone}: ${otp} (Mock - visible for testing)`);

        res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
            // Only include for development/testing
            ...(process.env.NODE_ENV === 'development' && { otp }),
        });

    } catch (error) {
        console.error(`❌ Send OTP error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to send OTP',
            error: error.message,
        });
    }
};

/**
 * Verifies OTP and returns JWT token on success.
 * 
 * @async
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 * 
 * @example
 * // POST /api/auth/verify-otp
 * // Body: { "phone": "+919876543210", "otp": "123456" }
 */
const verifyOTPAndLogin = async (req, res) => {
    try {
        const { phone, otp } = req.body;

        if (!phone || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Phone number and OTP are required',
            });
        }

        // Get stored OTP
        const stored = otpStore.get(phone);

        if (!stored) {
            return res.status(400).json({
                success: false,
                message: 'OTP not found. Please request a new OTP.',
            });
        }

        // Check expiry
        if (new Date() > stored.expiry) {
            otpStore.delete(phone);
            return res.status(400).json({
                success: false,
                message: 'OTP has expired. Please request a new OTP.',
            });
        }

        // Verify OTP
        if (!verifyOTP(otp, stored.otp)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP',
            });
        }

        // Clear OTP after successful verification
        otpStore.delete(phone);

        // Get user and update verification status
        const user = await User.findOneAndUpdate(
            { phone },
            { isVerified: true, otp: null, otpExpiry: null },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Generate JWT token
        const token = generateToken({
            userId: user._id,
            phone: user.phone,
        });

        console.log(`✅ User verified and logged in: ${phone}`);

        res.status(200).json({
            success: true,
            message: 'OTP verified successfully',
            token,
            user: {
                id: user._id,
                phone: user.phone,
                name: user.name,
                isVerified: user.isVerified,
                cropType: user.cropType,
                preferredLanguage: user.preferredLanguage,
            },
        });

    } catch (error) {
        console.error(`❌ Verify OTP error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to verify OTP',
            error: error.message,
        });
    }
};

/**
 * Updates user profile information.
 * 
 * @async
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 * 
 * @example
 * // PUT /api/auth/profile
 * // Body: { "name": "Farmer Name", "cropType": "rice", "location": { "coordinates": [72.87, 19.07] } }
 */
const updateProfile = async (req, res) => {
    try {
        const { userId } = req.user;
        const { name, cropType, preferredLanguage, location } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (cropType) updateData.cropType = cropType;
        if (preferredLanguage) updateData.preferredLanguage = preferredLanguage;
        if (location?.coordinates) {
            updateData.location = {
                type: 'Point',
                coordinates: location.coordinates,
            };
        }

        const user = await User.findByIdAndUpdate(userId, updateData, {
            new: true,
            runValidators: true,
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                phone: user.phone,
                name: user.name,
                cropType: user.cropType,
                preferredLanguage: user.preferredLanguage,
                location: user.location,
            },
        });

    } catch (error) {
        console.error(`❌ Update profile error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile',
            error: error.message,
        });
    }
};

/**
 * Gets the current user's profile.
 * 
 * @async
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
const getProfile = async (req, res) => {
    try {
        const { userId } = req.user;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                phone: user.phone,
                name: user.name,
                cropType: user.cropType,
                preferredLanguage: user.preferredLanguage,
                location: user.location,
                isVerified: user.isVerified,
                createdAt: user.createdAt,
            },
        });

    } catch (error) {
        console.error(`❌ Get profile error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to get profile',
            error: error.message,
        });
    }
};

export {
    sendOTP,
    verifyOTPAndLogin,
    updateProfile,
    getProfile,
};
