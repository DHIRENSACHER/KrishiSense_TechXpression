import mongoose from 'mongoose';

/**
 * Advisory Schema for storing personalized notifications/alerts for farmers.
 */
const advisorySchema = new mongoose.Schema(
    {
        /** Reference to the user who should receive this advisory */
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required'],
            index: true,
        },

        /** Type/category of the advisory */
        type: {
            type: String,
            required: [true, 'Advisory type is required'],
            enum: ['weather', 'pest', 'irrigation', 'fertilizer', 'harvest', 'market', 'scheme', 'general'],
        },

        /** Advisory message content */
        message: {
            type: String,
            required: [true, 'Advisory message is required'],
            trim: true,
            maxlength: [1000, 'Message cannot exceed 1000 characters'],
        },

        /** Severity level of the advisory */
        severity: {
            type: String,
            enum: ['low', 'medium', 'high', 'critical'],
            default: 'low',
        },

        /** Whether the user has read this advisory */
        isRead: { type: Boolean, default: false },

        /** Additional metadata for the advisory */
        metadata: { type: mongoose.Schema.Types.Mixed, default: {} },

        /** Expiry date after which the advisory is no longer relevant */
        expiresAt: { type: Date },

        /** Source of the advisory */
        source: { type: String, trim: true, default: 'system' },

        /** Location for geo-targeted advisories */
        location: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point',
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                default: [0, 0],
            },
        },
    },
    { timestamps: true }
);

advisorySchema.index({ location: '2dsphere' });
advisorySchema.index({ userId: 1, createdAt: -1 });
advisorySchema.index({ userId: 1, isRead: 1 });

/**
 * Static method to get unread count for a user
 * @param {ObjectId} userId - The user's ID
 * @returns {Promise<number>}
 */
advisorySchema.statics.getUnreadCount = async function (userId) {
    return this.countDocuments({ userId, isRead: false });
};

/**
 * Static method to mark all advisories as read for a user
 * @param {ObjectId} userId - The user's ID
 * @returns {Promise<Object>}
 */
advisorySchema.statics.markAllAsRead = async function (userId) {
    return this.updateMany({ userId, isRead: false }, { isRead: true });
};

export default mongoose.model('Advisory', advisorySchema);