import swaggerJsdoc from 'swagger-jsdoc';

/**
 * Swagger API documentation configuration
 */
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'KrushiSense API',
            version: '1.0.0',
            description: 'Smart Agriculture Advisory System API Documentation',
            contact: {
                name: 'API Support',
            },
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        phone: { type: 'string', example: '+919876543210' },
                        name: { type: 'string', example: 'Ramesh Kumar' },
                        cropType: {
                            type: 'string',
                            enum: ['rice', 'wheat', 'maize', 'cotton', 'sugarcane', 'soybean', 'groundnut', 'vegetables', 'fruits', 'pulses', 'other'],
                            example: 'rice'
                        },
                        preferredLanguage: {
                            type: 'string',
                            enum: ['en', 'hi', 'mr', 'gu', 'ta', 'te', 'kn', 'pa', 'bn'],
                            example: 'en'
                        },
                        location: {
                            type: 'object',
                            properties: {
                                type: { type: 'string', example: 'Point' },
                                coordinates: { type: 'array', items: { type: 'number' }, example: [72.8777, 19.076] },
                            },
                        },
                    },
                },
                Advisory: {
                    type: 'object',
                    properties: {
                        userId: { type: 'string' },
                        type: { type: 'string', enum: ['weather', 'pest', 'irrigation', 'fertilizer', 'harvest', 'market', 'scheme', 'general'] },
                        message: { type: 'string' },
                        severity: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
                        isRead: { type: 'boolean' },
                    },
                },
                Scheme: {
                    type: 'object',
                    properties: {
                        title: { type: 'string' },
                        description: { type: 'string' },
                        link: { type: 'string' },
                        cropCategory: { type: 'string' },
                    },
                },
            },
        },
        tags: [
            { name: 'Health', description: 'API health check' },
            { name: 'Authentication', description: 'OTP-based authentication endpoints' },
            { name: 'Advisories', description: 'Weather and crop advisories' },
            { name: 'Sync', description: 'Offline-first data synchronization' },
            { name: 'Market', description: 'Market forecasting and price data' },
            { name: 'Schemes', description: 'Government agricultural schemes' },
        ],
    },
    apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec;
