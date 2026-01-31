import User from '../models/User.js';
import { generateToken } from '../config/auth.js';
import { findBestMatch, reverseGeocode, isValidCoordinates } from '../services/geolocationService.js';



/**
 * Registers a new user and sends OTP.
 */
/**
 * Registers a new user with password.
 */
const register = async (req, res) => {
    try {
        const { name, phone, password } = req.body;

        if (!phone || !name || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, phone, and password are required',
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

        // Create new user (password will be hashed by pre-save hook)
        user = await User.create({ name, phone, password, isVerified: true });

        // Generate JWT token
        const token = generateToken({
            userId: user._id,
            phone: user.phone,
        });

        res.status(200).json({
            success: true,
            message: 'Registration successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                phone: user.phone,
                role: 'farmer'
            }
        });

    } catch (error) {
        console.error(`❌ Register error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to register',
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
/**
 * Logs in a user with phone and password.
 */
const login = async (req, res) => {
    try {
        const { phone, password } = req.body;

        if (!phone || !password) {
            return res.status(400).json({
                success: false,
                message: 'Phone and password are required',
            });
        }

        // Check for user (select password explicitly)
        const user = await User.findOne({ phone }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        // Check password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        // Generate Token
        const token = generateToken({
            userId: user._id,
            phone: user.phone,
        });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                phone: user.phone,
                role: 'farmer',
                cropType: user.cropType,
                location: user.location,
            }
        });

    } catch (error) {
        console.error(`❌ Login error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Login failed',
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
    register,
    login,
    updateProfile,
    getProfile,
    addCrop,
    updateCrop,
    deleteCrop,
};
