import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cron from 'node-cron';
import swaggerUi from 'swagger-ui-express';

import { connectDB } from './config/db.js';
import apiRoutes from './routes/api.js';
import { updateSchemesInDB } from './services/scraperService.js';
import swaggerSpec from './config/swagger.js';

// Load environment variables
dotenv.config();

const app = express();

// ============================================================
// Middleware Configuration
// ============================================================

/** Security headers using Helmet */
app.use(helmet());

/** CORS configuration */
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

/** HTTP request logging using Morgan */
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

/** Parse JSON request bodies */
app.use(express.json({ limit: '10mb' }));

/** Parse URL-encoded request bodies */
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================================
// Routes
// ============================================================

/** Root endpoint */
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to KrushiSense API',
        version: '1.0.0',
        documentation: '/api-docs',
    });
});

/** Swagger API Documentation */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'KrushiSense API Docs',
}));

/** API routes */
app.use('/api', apiRoutes);

// ============================================================
// Error Handling Middleware
// ============================================================

/** 404 Not Found handler */
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
    });
});

/**
 * Global error handler
 * @param {Error} err - Error object
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
app.use((err, req, res, next) => {
    console.error(`❌ Error: ${err.message}`);
    console.error(err.stack);

    // Mongoose validation errors
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({ success: false, message: 'Validation Error', errors: messages });
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(400).json({ success: false, message: `Duplicate value for field: ${field}` });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, message: 'Token expired' });
    }

    // Default error response
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
});

// ============================================================
// Cron Jobs
// ============================================================

/**
 * Initialize scheduled tasks
 */
const initCronJobs = () => {
    /** Scheme scraper - runs daily at 6 AM IST */
    cron.schedule('0 6 * * *', async () => {
        console.log('🔄 Running daily scheme scraper...');
        try {
            await updateSchemesInDB();
            console.log('✅ Scheme scraper completed');
        } catch (error) {
            console.error(`❌ Scheme scraper failed: ${error.message}`);
        }
    }, { scheduled: true, timezone: 'Asia/Kolkata' });

    /** Weather advisory check - runs every 6 hours */
    cron.schedule('0 */6 * * *', async () => {
        console.log('🌤️ Running weather advisory check...');
        // Placeholder for weather advisory generation
        console.log('✅ Weather advisory check completed');
    }, { scheduled: true, timezone: 'Asia/Kolkata' });

    console.log('⏰ Cron jobs initialized');
};

// ============================================================
// Server Startup
// ============================================================

const PORT = process.env.PORT || 3000;

/**
 * Start the server
 */
const startServer = async () => {
    try {
        await connectDB();
        initCronJobs();

        app.listen(PORT, () => {
            console.log(`
╔════════════════════════════════════════════════════════════╗
║   🌾 KrushiSense Backend Server                           ║
║   Environment: ${(process.env.NODE_ENV || 'development').padEnd(40)}║
║   Port: ${PORT.toString().padEnd(47)}║
║   API: http://localhost:${PORT}/api                           ║
║   Docs: http://localhost:${PORT}/api-docs                      ║
╚════════════════════════════════════════════════════════════╝
      `);
        });
    } catch (error) {
        console.error(`❌ Failed to start server: ${error.message}`);
        process.exit(1);
    }
};

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
    console.error(`❌ Unhandled Rejection: ${err.message}`);
    if (process.env.NODE_ENV === 'production') process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error(`❌ Uncaught Exception: ${err.message}`);
    process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('📴 SIGTERM received. Shutting down gracefully...');
    const { disconnectDB } = await import('./config/db.js');
    await disconnectDB();
    process.exit(0);
});

startServer();

export default app;
