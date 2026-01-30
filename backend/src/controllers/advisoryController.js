import mongoose from 'mongoose';
import Advisory from '../models/Advisory.js';
import User from '../models/User.js';
import {
    getCurrentWeather,
    getForecast,
    generateWeatherAdvisories,
} from '../services/weatherService.js';
import { getLocationDetails, isValidCoordinates } from '../services/geolocationService.js';
import { sendIrrigationAlert, sendSchemeAlert } from '../services/notificationService.js';

/**
 * Fetches all advisories for the authenticated user.
 * Supports filtering by type, severity, and read status.
 * 
 * @async
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 * 
 * @example
 * // GET /api/advisories?type=weather&severity=high&isRead=false
 */
const getAdvisories = async (req, res) => {
    try {
        const { userId } = req.user;
        const { type, severity, isRead, limit = 20, page = 1 } = req.query;

        // Build filter query
        const filter = { userId };
        if (type) filter.type = type;
        if (severity) filter.severity = severity;
        if (isRead !== undefined) filter.isRead = isRead === 'true';

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [advisories, total] = await Promise.all([
            Advisory.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit))
                .lean(),
            Advisory.countDocuments(filter),
        ]);

        const unreadCount = await Advisory.getUnreadCount(userId);

        res.status(200).json({
            success: true,
            data: {
                advisories,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(total / parseInt(limit)),
                },
                unreadCount,
            },
        });

    } catch (error) {
        console.error(`❌ Get advisories error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch advisories',
            error: error.message,
        });
    }
};

/**
 * Gets advisories filtered by user's location.
 * Uses geospatial queries to find nearby advisories.
 * 
 * @async
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 * 
 * @example
 * // GET /api/advisories/nearby?maxDistance=50000
 */
const getAdvisoriesByLocation = async (req, res) => {
    try {
        const { userId } = req.user;
        const { maxDistance = 50000 } = req.query; // Default 50km in meters

        // Get user location
        const user = await User.findById(userId);

        if (!user?.location?.coordinates ||
            (user.location.coordinates[0] === 0 && user.location.coordinates[1] === 0)) {
            return res.status(400).json({
                success: false,
                message: 'User location not set. Please update your profile with location.',
            });
        }

        // Find advisories near user's location
        const advisories = await Advisory.find({
            userId,
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: user.location.coordinates,
                    },
                    $maxDistance: parseInt(maxDistance),
                },
            },
        }).sort({ createdAt: -1 }).limit(50);

        res.status(200).json({
            success: true,
            data: {
                advisories,
                userLocation: user.location,
                searchRadius: parseInt(maxDistance),
            },
        });

    } catch (error) {
        console.error(`❌ Get advisories by location error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch location-based advisories',
            error: error.message,
        });
    }
};

/**
 * Fetches current weather and generates advisories for the user.
 * Saves new advisories to the database.
 * 
 * @async
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 * 
 * @example
 * // GET /api/advisories/weather
 */
const getWeatherAdvisory = async (req, res) => {
    try {
        const { userId } = req.user;

        // Get user profile
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        const [lon, lat] = user.location?.coordinates || [0, 0];

        // Validate coordinates
        if (!isValidCoordinates(lat, lon)) {
            return res.status(400).json({
                success: false,
                message: 'Location not set. Please enable location or search for your city in the dashboard.',
            });
        }

        // Get location name (use stored or fetch via reverse geocoding)
        let locationInfo = {
            name: user.locationName || null,
            state: user.state || null,
            country: user.country || null,
        };

        if (!locationInfo.name) {
            try {
                const geoDetails = await getLocationDetails(lat, lon);
                locationInfo = {
                    name: geoDetails.name,
                    state: geoDetails.state,
                    country: geoDetails.country,
                };
            } catch (err) {
                console.warn(`⚠️ Could not get location name: ${err.message}`);
            }
        }

        // Fetch weather data
        const [currentWeather, forecast] = await Promise.all([
            getCurrentWeather(lat, lon),
            getForecast(lat, lon),
        ]);

        // Generate advisories based on weather
        const advisories = generateWeatherAdvisories(
            currentWeather,
            forecast,
            user.cropType
        );

        // Save advisories to database and trigger notifications for critical ones
        const savedAdvisories = await Promise.all(
            advisories.map(async (advisory) => {
                const doc = await Advisory.create({
                    ...advisory,
                    userId,
                    source: 'weather_service',
                    location: {
                        type: 'Point',
                        coordinates: [lon, lat],
                    },
                });

                // Trigger: Send notification if it's a high-severity irrigation advisory
                if (advisory.type === 'irrigation' && advisory.severity === 'high') {
                    try {
                        await sendIrrigationAlert(user.phone, {
                            crop: user.cropType || 'crops',
                            status: advisory.message
                        });
                    } catch (err) {
                        console.warn(`⚠️ Failed to send irrigation alert notification: ${err.message}`);
                    }
                }

                return doc;
            })
        );

        console.log(`🌤️ Generated ${savedAdvisories.length} weather advisories for user ${userId}`);

        res.status(200).json({
            success: true,
            data: {
                weather: currentWeather,
                forecast,
                advisories: savedAdvisories,
                location: {
                    coordinates: { lat, lon },
                    ...locationInfo,
                },
            },
        });

    } catch (error) {
        console.error(`❌ Get weather advisory error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch weather advisory',
            error: error.message,
        });
    }
};

/**
 * Marks a single advisory as read.
 * 
 * @async
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 * 
 * @example
 * // PATCH /api/advisories/:id/read
 */
const markAsRead = async (req, res) => {
    try {
        const { userId } = req.user;
        const { id } = req.params;

        const advisory = await Advisory.findOneAndUpdate(
            { _id: id, userId },
            { isRead: true },
            { new: true }
        );

        if (!advisory) {
            return res.status(404).json({
                success: false,
                message: 'Advisory not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Advisory marked as read',
            data: advisory,
        });

    } catch (error) {
        console.error(`❌ Mark as read error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to mark advisory as read',
            error: error.message,
        });
    }
};

/**
 * Marks all advisories as read for the user.
 * 
 * @async
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 * 
 * @example
 * // PATCH /api/advisories/read-all
 */
const markAllAsRead = async (req, res) => {
    try {
        const { userId } = req.user;

        const result = await Advisory.markAllAsRead(userId);

        res.status(200).json({
            success: true,
            message: `Marked ${result.modifiedCount} advisories as read`,
        });

    } catch (error) {
        console.error(`❌ Mark all as read error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to mark all advisories as read',
            error: error.message,
        });
    }
};

/**
 * Creates a new advisory (admin/system use).
 * 
 * @async
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
const createAdvisory = async (req, res) => {
    try {
        const { userId, type, message, severity, cropType, metadata, expiresAt } = req.body;

        // Validate required fields
        if (!userId || !type || !message) {
            return res.status(400).json({
                success: false,
                message: 'userId, type, and message are required',
            });
        }

        // Validate userId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid userId format. Must be a valid MongoDB ObjectId.',
            });
        }

        const advisory = await Advisory.create({
            userId,
            type,
            message,
            severity: severity || 'low',
            cropType,
            metadata,
            expiresAt,
            source: 'manual',
        });

        res.status(201).json({
            success: true,
            message: 'Advisory created successfully',
            data: advisory,
        });

    } catch (error) {
        console.error(`❌ Create advisory error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to create advisory',
            error: error.message,
        });
    }
};

/**
 * Manually triggers a government scheme alert via SMS for the user.
 * 
 * @async
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
const triggerSchemeAlert = async (req, res) => {
    try {
        const { userId } = req.user;
        const { schemeTitle } = req.body;

        if (!schemeTitle) {
            return res.status(400).json({
                success: false,
                message: 'schemeTitle is required',
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        const result = await sendSchemeAlert(user.phone, { title: schemeTitle });

        if (result.status === 'success') {
            res.status(200).json({
                success: true,
                message: `Scheme alert for "${schemeTitle}" sent to ${user.phone}`,
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to send scheme alert notification',
                details: result
            });
        }

    } catch (error) {
        console.error(`❌ Trigger scheme alert error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to trigger scheme alert',
            error: error.message,
        });
    }
};

export {
    getAdvisories,
    getAdvisoriesByLocation,
    getWeatherAdvisory,
    markAsRead,
    markAllAsRead,
    createAdvisory,
    triggerSchemeAlert,
};
