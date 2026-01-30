import mongoose from 'mongoose';

/**
 * Scheme Schema for storing government agricultural subsidy information.
 */
const schemeSchema = new mongoose.Schema(
    {
        /** Title of the government scheme */
        title: {
            type: String,
            required: [true, 'Scheme title is required'],
            trim: true,
            maxlength: [200, 'Title cannot exceed 200 characters'],
        },

        /** Detailed description of the scheme */
        description: {
            type: String,
            trim: true,
            maxlength: [2000, 'Description cannot exceed 2000 characters'],
        },

        /** Official link to the scheme details */
        link: {
            type: String,
            trim: true,
        },

        /** Category of crops this scheme applies to */
        cropCategory: {
            type: String,
            trim: true,
            enum: ['all', 'cereals', 'pulses', 'oilseeds', 'cash_crops', 'horticulture', 'vegetables', 'fruits', 'organic', 'dairy', 'fisheries'],
            default: 'all',
        },

        /** Whether the scheme is currently active */
        isActive: { type: Boolean, default: true },

        /** Source URL where the scheme was scraped from */
        sourceUrl: { type: String, trim: true },

        /** Hash of content to detect duplicates */
        contentHash: { type: String, unique: true, sparse: true },
    },
    { timestamps: true }
);

schemeSchema.index({ title: 'text', description: 'text' });
schemeSchema.index({ cropCategory: 1, isActive: 1 });

export default mongoose.model('Scheme', schemeSchema);
