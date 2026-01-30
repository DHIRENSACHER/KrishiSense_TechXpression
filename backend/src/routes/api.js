import { Router } from 'express';
import { authenticateToken } from '../config/auth.js';

// Auth Controllers
import { sendOTP, verifyOTPAndLogin, updateProfile, getProfile } from '../controllers/authController.js';

// Advisory Controllers
import { getAdvisories, getAdvisoriesByLocation, getWeatherAdvisory, markAsRead, markAllAsRead, createAdvisory } from '../controllers/advisoryController.js';

// Sync Controllers
import { syncBatch, pullChanges, getSyncStatus, resolveConflict } from '../controllers/syncController.js';

// Market Controllers
import { getMarketForecast, getPriceHistory, getSchemes, getSchemeById } from '../controllers/marketController.js';

const router = Router();

// ============================================================
// Health Check
// ============================================================

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: API health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 message: { type: string }
 *                 timestamp: { type: string }
 *                 version: { type: string }
 */
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'KrushiSense API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
    });
});

// ============================================================
// Authentication Routes
// ============================================================

/**
 * @swagger
 * /api/auth/send-otp:
 *   post:
 *     summary: Send OTP to phone number
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "+919876543210"
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 message: { type: string }
 *                 otp: { type: string, description: "Only in development mode" }
 *       400:
 *         description: Invalid phone number
 */
router.post('/auth/send-otp', sendOTP);

/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     summary: Verify OTP and get JWT token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - otp
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "+919876543210"
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP verified, JWT token returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 token: { type: string }
 *                 user: { $ref: '#/components/schemas/User' }
 *       400:
 *         description: Invalid or expired OTP
 */
router.post('/auth/verify-otp', verifyOTPAndLogin);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get current user's profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 user: { $ref: '#/components/schemas/User' }
 *       401:
 *         description: Unauthorized
 */
router.get('/auth/profile', authenticateToken, getProfile);

/**
 * @swagger
 * /api/auth/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Ramesh Kumar"
 *               cropType:
 *                 type: string
 *                 enum: [rice, wheat, maize, cotton, sugarcane, vegetables, fruits, other]
 *                 example: "rice"
 *               preferredLanguage:
 *                 type: string
 *                 enum: [en, hi, mr, gu, ta, te, kn, pa, bn]
 *                 example: "hi"
 *               location:
 *                 type: object
 *                 properties:
 *                   coordinates:
 *                     type: array
 *                     items: { type: number }
 *                     example: [72.8777, 19.076]
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 */
router.put('/auth/profile', authenticateToken, updateProfile);

// ============================================================
// Advisory Routes
// ============================================================

/**
 * @swagger
 * /api/advisories:
 *   get:
 *     summary: Get all advisories for the authenticated user
 *     tags: [Advisories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [weather, pest, irrigation, fertilizer, harvest, market, scheme, general]
 *         description: Filter by advisory type
 *       - in: query
 *         name: severity
 *         schema:
 *           type: string
 *           enum: [low, medium, high, critical]
 *         description: Filter by severity
 *       - in: query
 *         name: isRead
 *         schema:
 *           type: boolean
 *         description: Filter by read status
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: List of advisories
 *       401:
 *         description: Unauthorized
 */
router.get('/advisories', authenticateToken, getAdvisories);

/**
 * @swagger
 * /api/advisories/nearby:
 *   get:
 *     summary: Get advisories filtered by user's location
 *     tags: [Advisories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: maxDistance
 *         schema:
 *           type: integer
 *           default: 50000
 *         description: Maximum distance in meters
 *     responses:
 *       200:
 *         description: Location-based advisories
 *       401:
 *         description: Unauthorized
 */
router.get('/advisories/nearby', authenticateToken, getAdvisoriesByLocation);

/**
 * @swagger
 * /api/advisories/weather:
 *   get:
 *     summary: Get weather data and generate advisories
 *     tags: [Advisories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Weather data and generated advisories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     weather: { type: object }
 *                     forecast: { type: array }
 *                     advisories: { type: array }
 *       401:
 *         description: Unauthorized
 */
router.get('/advisories/weather', authenticateToken, getWeatherAdvisory);

/**
 * @swagger
 * /api/advisories/read-all:
 *   patch:
 *     summary: Mark all advisories as read
 *     tags: [Advisories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All advisories marked as read
 *       401:
 *         description: Unauthorized
 */
router.patch('/advisories/read-all', authenticateToken, markAllAsRead);

/**
 * @swagger
 * /api/advisories/{id}/read:
 *   patch:
 *     summary: Mark a single advisory as read
 *     tags: [Advisories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Advisory ID
 *     responses:
 *       200:
 *         description: Advisory marked as read
 *       404:
 *         description: Advisory not found
 */
router.patch('/advisories/:id/read', authenticateToken, markAsRead);

/**
 * @swagger
 * /api/advisories:
 *   post:
 *     summary: Create a new advisory (admin use)
 *     tags: [Advisories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - type
 *               - message
 *             properties:
 *               userId:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [weather, pest, irrigation, fertilizer, harvest, market, scheme, general]
 *               message:
 *                 type: string
 *               severity:
 *                 type: string
 *                 enum: [low, medium, high, critical]
 *     responses:
 *       201:
 *         description: Advisory created
 *       401:
 *         description: Unauthorized
 */
router.post('/advisories', authenticateToken, createAdvisory);

// ============================================================
// Sync Routes (Offline-First)
// ============================================================

/**
 * @swagger
 * /api/sync:
 *   post:
 *     summary: Batch sync documents from offline client (PouchDB)
 *     tags: [Sync]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - collection
 *               - documents
 *             properties:
 *               collection:
 *                 type: string
 *                 enum: [users, advisories, schemes]
 *                 example: "advisories"
 *               documents:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Sync completed
 *       401:
 *         description: Unauthorized
 */
router.post('/sync', authenticateToken, syncBatch);

/**
 * @swagger
 * /api/sync/pull:
 *   get:
 *     summary: Pull changes since a given timestamp
 *     tags: [Sync]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: collection
 *         required: true
 *         schema:
 *           type: string
 *           enum: [users, advisories, schemes]
 *       - in: query
 *         name: since
 *         schema:
 *           type: string
 *           format: date-time
 *         description: ISO timestamp to fetch changes since
 *     responses:
 *       200:
 *         description: Documents changed since timestamp
 *       401:
 *         description: Unauthorized
 */
router.get('/sync/pull', authenticateToken, pullChanges);

/**
 * @swagger
 * /api/sync/status:
 *   get:
 *     summary: Get sync status for collections
 *     tags: [Sync]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: collection
 *         schema:
 *           type: string
 *         description: Optional collection name
 *     responses:
 *       200:
 *         description: Sync status returned
 *       401:
 *         description: Unauthorized
 */
router.get('/sync/status', authenticateToken, getSyncStatus);

/**
 * @swagger
 * /api/sync/resolve:
 *   post:
 *     summary: Resolve sync conflicts
 *     tags: [Sync]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - collection
 *               - documentId
 *               - resolution
 *             properties:
 *               collection:
 *                 type: string
 *               documentId:
 *                 type: string
 *               resolution:
 *                 type: string
 *                 enum: [server, client]
 *               clientData:
 *                 type: object
 *     responses:
 *       200:
 *         description: Conflict resolved
 *       401:
 *         description: Unauthorized
 */
router.post('/sync/resolve', authenticateToken, resolveConflict);

// ============================================================
// Market & Schemes Routes
// ============================================================

/**
 * @swagger
 * /api/market/forecast:
 *   post:
 *     summary: Get market price forecast (proxies to ML service)
 *     tags: [Market]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               crop:
 *                 type: string
 *                 example: "rice"
 *               region:
 *                 type: string
 *                 example: "maharashtra"
 *               timeframe:
 *                 type: string
 *                 example: "4weeks"
 *     responses:
 *       200:
 *         description: Market forecast data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 source: { type: string }
 *                 data:
 *                   type: object
 *                   properties:
 *                     predictions: { type: array }
 *                     marketInsights: { type: object }
 *       401:
 *         description: Unauthorized
 */
router.post('/market/forecast', authenticateToken, getMarketForecast);

/**
 * @swagger
 * /api/market/history:
 *   get:
 *     summary: Get historical price data
 *     tags: [Market]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: crop
 *         schema:
 *           type: string
 *         example: "rice"
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *         example: "30days"
 *     responses:
 *       200:
 *         description: Historical price data
 *       401:
 *         description: Unauthorized
 */
router.get('/market/history', authenticateToken, getPriceHistory);

/**
 * @swagger
 * /api/schemes:
 *   get:
 *     summary: Get government agricultural schemes
 *     tags: [Schemes]
 *     parameters:
 *       - in: query
 *         name: cropCategory
 *         schema:
 *           type: string
 *           enum: [all, cereals, pulses, oilseeds, cash_crops, horticulture, vegetables, fruits, organic, dairy, fisheries]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in title and description
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: List of government schemes
 */
router.get('/schemes', getSchemes);

/**
 * @swagger
 * /api/schemes/{id}:
 *   get:
 *     summary: Get a single scheme by ID
 *     tags: [Schemes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Scheme details
 *       404:
 *         description: Scheme not found
 */
router.get('/schemes/:id', getSchemeById);

export default router;
