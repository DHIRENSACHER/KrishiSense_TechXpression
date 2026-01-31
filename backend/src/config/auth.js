import jwt from 'jsonwebtoken';

/**
 * Generates a JWT token for a user.
 * @param {Object} payload - The payload to encode
 * @param {string} payload.userId - The user's MongoDB ObjectId
 * @param {string} payload.phone - The user's phone number
 * @returns {string} The signed JWT token
 */
const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
};

/**
 * Verifies a JWT token and returns the decoded payload.
 * @param {string} token - The JWT token to verify
 * @returns {Object|null} The decoded payload or null if invalid
 */
const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        console.error(`❌ Token verification failed: ${error.message}`);
        return null;
    }
};

/**
 * Express middleware to authenticate requests using JWT.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Access token required' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }

    req.user = decoded;
    next();
};

export { generateToken, verifyToken, authenticateToken };
