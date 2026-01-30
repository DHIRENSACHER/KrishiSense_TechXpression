import axios from 'axios';
import Scheme from '../models/Scheme.js';

/**
 * Market Forecasting Controller.
 * Acts as a proxy to forward requests to a Python/FastAPI ML service.
 */

/**
 * Mock ML service response for when the actual service is unavailable.
 */
const MOCK_FORECAST_DATA = {
    predictions: [
        {
            crop: 'rice',
            currentPrice: 2150,
            predictedPrice: 2280,
            priceChange: 6.04,
            trend: 'bullish',
            confidence: 0.85,
            forecast: [
                { week: 1, price: 2180 },
                { week: 2, price: 2210 },
                { week: 3, price: 2250 },
                { week: 4, price: 2280 },
            ],
            recommendation: 'Hold for 2-3 weeks for better prices',
        },
        {
            crop: 'wheat',
            currentPrice: 2400,
            predictedPrice: 2350,
            priceChange: -2.08,
            trend: 'bearish',
            confidence: 0.78,
            forecast: [
                { week: 1, price: 2380 },
                { week: 2, price: 2360 },
                { week: 3, price: 2350 },
                { week: 4, price: 2350 },
            ],
            recommendation: 'Consider selling soon if storage is a concern',
        },
    ],
    marketInsights: {
        season: 'rabi',
        demandTrend: 'stable',
        exportPotential: 'moderate',
    },
    generatedAt: new Date().toISOString(),
};

/**
 * Proxies forecast requests to the ML service.
 * Falls back to mock data if the ML service is unavailable.
 * 
 * @async
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 * 
 * @example
 * // POST /api/market/forecast
 * // Body: { "crop": "rice", "region": "maharashtra", "timeframe": "4weeks" }
 */
const getMarketForecast = async (req, res) => {
    try {
        const { crop, region, timeframe = '4weeks' } = req.body;

        const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:8000';

        try {
            // Attempt to call the actual ML service
            const response = await axios.post(
                `${mlServiceUrl}/predict`,
                { crop, region, timeframe },
                {
                    timeout: 10000, // 10 second timeout
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log(`📊 ML service response received for ${crop || 'all crops'}`);

            return res.status(200).json({
                success: true,
                source: 'ml_service',
                data: response.data,
            });

        } catch (mlError) {
            // ML service unavailable - use mock data
            console.warn(`⚠️ ML service unavailable: ${mlError.message}. Using mock data.`);

            let mockResponse = { ...MOCK_FORECAST_DATA };

            // Filter by crop if specified
            if (crop) {
                mockResponse.predictions = mockResponse.predictions.filter(
                    p => p.crop.toLowerCase() === crop.toLowerCase()
                );
            }

            return res.status(200).json({
                success: true,
                source: 'mock',
                message: 'ML service unavailable. Returning cached/mock forecast.',
                data: mockResponse,
            });
        }

    } catch (error) {
        console.error(`❌ Market forecast error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to get market forecast',
            error: error.message,
        });
    }
};

/**
 * Gets historical price data for a crop.
 * 
 * @async
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 * 
 * @example
 * // GET /api/market/history?crop=rice&period=30days
 */
const getPriceHistory = async (req, res) => {
    try {
        const { crop, period = '30days' } = req.query;

        // Mock historical data
        const mockHistory = {
            crop: crop || 'rice',
            period,
            data: Array.from({ length: 30 }, (_, i) => ({
                date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                price: 2000 + Math.floor(Math.random() * 400),
                volume: 10000 + Math.floor(Math.random() * 5000),
            })),
            statistics: {
                min: 2050,
                max: 2380,
                average: 2215,
                stdDev: 95,
            },
        };

        res.status(200).json({
            success: true,
            data: mockHistory,
        });

    } catch (error) {
        console.error(`❌ Price history error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to get price history',
            error: error.message,
        });
    }
};

/**
 * Gets all government schemes, optionally filtered by crop category.
 * 
 * @async
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 * 
 * @example
 * // GET /api/schemes?cropCategory=horticulture&limit=10
 */
const getSchemes = async (req, res) => {
    try {
        const { cropCategory, search, limit = 20, page = 1 } = req.query;

        const filter = { isActive: true };

        if (cropCategory) {
            filter.cropCategory = cropCategory;
        }

        let query = Scheme.find(filter);

        // Text search if keyword provided
        if (search) {
            query = Scheme.find({
                ...filter,
                $text: { $search: search },
            });
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [schemes, total] = await Promise.all([
            query
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit))
                .lean(),
            Scheme.countDocuments(filter),
        ]);

        res.status(200).json({
            success: true,
            data: {
                schemes,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(total / parseInt(limit)),
                },
            },
        });

    } catch (error) {
        console.error(`❌ Get schemes error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch schemes',
            error: error.message,
        });
    }
};

/**
 * Gets a single scheme by ID.
 * 
 * @async
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
const getSchemeById = async (req, res) => {
    try {
        const { id } = req.params;

        const scheme = await Scheme.findById(id);

        if (!scheme) {
            return res.status(404).json({
                success: false,
                message: 'Scheme not found',
            });
        }

        res.status(200).json({
            success: true,
            data: scheme,
        });

    } catch (error) {
        console.error(`❌ Get scheme by ID error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch scheme',
            error: error.message,
        });
    }
};

export {
    getMarketForecast,
    getPriceHistory,
    getSchemes,
    getSchemeById,
};
