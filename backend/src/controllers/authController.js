import User from '../models/User.js';
import { generateToken, generateOTP, verifyOTP } from '../config/auth.js';
import { findBestMatch, reverseGeocode, isValidCoordinates } from '../services/geolocationService.js';
import { sendOTP as sendNotificationOTP, sendTwilioVerifyOTP, checkTwilioVerifyOTP } from '../services/notificationService.js';

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

        // Find user
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found. Please sign up first.',
            });
        }

        // Generate OTP
        const otp = generateOTP();
        const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes validity

        // Store OTP (in production, store in Redis/DB with TTL)
        otpStore.set(phone, { otp, expiry });

        // Update OTP in user document (for DB-based verification)
        await User.findByIdAndUpdate(user._id, {
            otp,
            otpExpiry: expiry,
        });

        // Send OTP via Notification Service
        try {
            await sendNotificationOTP(phone, otp);
            console.log(`📱 OTP dispatched via SMS to ${phone}`);
        } catch (smsError) {
            console.error(`❌ SMS Dispatch Failed: ${smsError.message}`);
            if (process.env.NODE_ENV === 'development') {
                console.log('\n' + '='.repeat(40));
                console.log(`🛠️  DEVELOPMENT FALLBACK`);
                console.log(`📱 OTP for ${phone}: ${otp}`);
                console.log('='.repeat(40) + '\n');
            } else {
                throw smsError; // Re-throw in production
            }
        }

        res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
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
 * Registers a new user and sends OTP.
 */
const register = async (req, res) => {
    try {
        const { name, phone } = req.body;

        if (!phone || !name) {
            return res.status(400).json({
                success: false,
                message: 'Name and phone number are required',
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

        // Check if user already exists
        let user = await User.findOne({ phone });
        if (user) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this phone number. Please login instead.',
            });
        }

        // Create new user
        user = await User.create({ name, phone, isVerified: false });

        // Generate OTP
        const otp = generateOTP();
        const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes validity

        // Store OTP
        otpStore.set(phone, { otp, expiry });

        // Update user with OTP
        await User.findByIdAndUpdate(user._id, {
            otp,
            otpExpiry: expiry,
        });

        // Send OTP via Notification Service
        try {
            if (process.env.TWILIO_VERIFY_SERVICE_SID) {
                await sendTwilioVerifyOTP(phone);
                console.log(`📱 OTP dispatched via Twilio Verify to ${phone} (Register)`);
            } else {
                await sendNotificationOTP(phone, otp);
                console.log(`📱 OTP dispatched via SMS to ${phone} (Register)`);
            }
        } catch (smsError) {
            console.error(`❌ SMS Dispatch Failed: ${smsError.message}`);
            if (process.env.NODE_ENV === 'development') {
                console.log('\n' + '='.repeat(40));
                console.log(`🛠️  DEVELOPMENT FALLBACK (Signup)`);
                console.log(`📱 OTP for ${phone}: ${otp}`);
                console.log('='.repeat(40) + '\n');
            } else {
                throw smsError;
            }
        }

        res.status(200).json({
            success: true,
            message: 'Registration successful. OTP sent.',
        });

    } catch (error) {
        console.error(`❌ Register error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to register and send OTP',
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

        // Check if using Twilio Verify
        if (process.env.TWILIO_VERIFY_SERVICE_SID) {
            try {
                const check = await checkTwilioVerifyOTP(phone, otp);
                if (check.status !== 'approved') {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid or expired OTP',
                    });
                }
            } catch (err) {
                console.error(`❌ Twilio Verify Check Error: ${err.message}`);
                // Fallback to manual check if configured (optional)
            }
        } else {
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
        }

        // Get user and update verification status

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
 * // OR: { "address": "Pune, Maharashtra" }
 */
const updateProfile = async (req, res) => {
    try {
        const { userId } = req.user;
        const { name, cropType, preferredLanguage, location, address } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (cropType) updateData.cropType = cropType;
        if (preferredLanguage) updateData.preferredLanguage = preferredLanguage;

        // Handle location update - either by address or coordinates
        if (address) {
            // Geocode the address to get coordinates
            console.log(`📍 Geocoding address for profile: "${address}"`);
            const geoResult = await findBestMatch(address);

            if (!geoResult) {
                return res.status(400).json({
                    success: false,
                    message: `Could not find location for: "${address}". Try a different city or village name.`,
                });
            }

            updateData.location = {
                type: 'Point',
                coordinates: [geoResult.lon, geoResult.lat], // GeoJSON: [lon, lat]
            };
            updateData.locationName = geoResult.name;
            updateData.state = geoResult.state;
            updateData.country = geoResult.country;

        } else if (location?.coordinates) {
            // User provided raw coordinates - reverse geocode to get name
            const [lon, lat] = location.coordinates;
            updateData.location = {
                type: 'Point',
                coordinates: location.coordinates,
            };

            // Try to get location name via reverse geocoding
            if (isValidCoordinates(lat, lon)) {
                try {
                    const geoResult = await reverseGeocode(lat, lon);
                    if (geoResult) {
                        updateData.locationName = geoResult.name;
                        updateData.state = geoResult.state;
                        updateData.country = geoResult.country;
                    }
                } catch (err) {
                    console.warn(`⚠️ Reverse geocoding failed: ${err.message}`);
                    // Continue without location name
                }
            }
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
                locationName: user.locationName,
                state: user.state,
                country: user.country,
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
                locationName: user.locationName,
                state: user.state,
                country: user.country,
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

/**
 * Adds a new crop to the user's inventory.
 */
const addCrop = async (req, res) => {
    try {
        const { userId } = req.user;
        const { name, area, season, note } = req.body;

        if (!name || !area || !season) {
            return res.status(400).json({
                success: false,
                message: 'Name, area, and season are required',
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.cropInventory.push({ name, area, season, note });
        await user.save();

        res.status(201).json({
            success: true,
            message: 'Crop added successfully',
            cropInventory: user.cropInventory,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Updates an existing crop in the inventory.
 */
const updateCrop = async (req, res) => {
    try {
        const { userId } = req.user;
        const { cropId } = req.params;
        const { name, area, season, note } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const crop = user.cropInventory.id(cropId);
        if (!crop) {
            return res.status(404).json({ success: false, message: 'Crop not found' });
        }

        if (name) crop.name = name;
        if (area) crop.area = area;
        if (season) crop.season = season;
        if (note !== undefined) crop.note = note;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Crop updated successfully',
            cropInventory: user.cropInventory,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Deletes a crop from the inventory.
 */
const deleteCrop = async (req, res) => {
    try {
        const { userId } = req.user;
        const { cropId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.cropInventory.pull(cropId);
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Crop deleted successfully',
            cropInventory: user.cropInventory,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export {
    sendOTP,
    verifyOTPAndLogin,
    updateProfile,
    getProfile,
    addCrop,
    updateCrop,
    deleteCrop,
};
