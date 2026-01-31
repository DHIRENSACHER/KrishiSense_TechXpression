import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * User Schema for farmers in the Smart Agriculture Advisory System.
 * Uses phone number as the primary identifier for OTP-based authentication.
 */
const userSchema = new mongoose.Schema(
    {
        /** Phone number - unique identifier for each user */
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            unique: true,
            trim: true,
            match: [/^\+?[1-9]\d{9,14}$/, 'Please provide a valid phone number'],
        },

        /** User's full name */
        name: {
            type: String,
            trim: true,
            maxlength: [100, 'Name cannot exceed 100 characters'],
        },

        /** Password (hashed) */
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false,
        },

        /** User's location as GeoJSON Point for geo-queries */
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

        /** Resolved location name (city/village) */
        locationName: {
            type: String,
            trim: true,
        },

        /** State/Province of the location */
        state: {
            type: String,
            trim: true,
        },

        /** Country code */
        country: {
            type: String,
            trim: true,
        },

        /** Crop inventory of User */
        cropInventory: {
            type: [{
                name: { type: String, required: true },
                area: { type: Number, required: true },
                season: {
                    type: String,
                    enum: ['kharif', 'rabi', 'zaid'], // Correct enum syntax
                    required: true
                },
                note: String
            }],
            default: [] // Default for the entire array
        },

        /** Preferred language for advisories and notifications */
        preferredLanguage: {
            type: String,
            trim: true,
            enum: ['en', 'hi', 'mr', 'gu', 'ta', 'te', 'kn', 'pa', 'bn'],
            default: 'en',
        },

        /** Stored OTP for verification (temporary) */
        otp: { type: String, select: false },

        /** OTP expiration timestamp */
        otpExpiry: { type: Date, select: false },

        /** Whether the user's phone is verified */
        isVerified: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Create 2dsphere index for geo-queries
userSchema.index({ location: '2dsphere' });

export default mongoose.model('User', userSchema);