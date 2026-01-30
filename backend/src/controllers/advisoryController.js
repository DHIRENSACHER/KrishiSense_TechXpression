import Advisory from '../models/Advisory.js';
import User from '../models/User.js';
import {
    getCurrentWeather,
    getForecast,
    generateWeatherAdvisories,
} from '../services/weatherService.js';

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

        const [lat, lon] = user.location?.coordinates || [0, 0];

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

        // Save advisories to database
        const savedAdvisories = await Promise.all(
            advisories.map(advisory =>
                Advisory.create({
                    ...advisory,
                    userId,
                    source: 'weather_service',
                    location: {
                        type: 'Point',
                        coordinates: [lon, lat],
                    },
                })
            )
        );

        console.log(`🌤️ Generated ${savedAdvisories.length} weather advisories for user ${userId}`);

        res.status(200).json({
            success: true,
            data: {
                weather: currentWeather,
                forecast,
                advisories: savedAdvisories,
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

export {
    getAdvisories,
    getAdvisoriesByLocation,
    getWeatherAdvisory,
    markAsRead,
    markAllAsRead,
    createAdvisory,
};
