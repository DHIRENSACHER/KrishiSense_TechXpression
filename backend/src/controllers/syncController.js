import mongoose from 'mongoose';
import User from '../models/User.js';
import Advisory from '../models/Advisory.js';
import Scheme from '../models/Scheme.js';

/**
 * Model mapping for sync operations.
 * Maps collection names to Mongoose models.
 */
const modelMap = {
    users: User,
    advisories: Advisory,
    schemes: Scheme,
};

/**
 * Handles batch sync from offline-first clients (PouchDB/CouchDB).
 * Accepts an array of documents and upserts them into MongoDB.
 * 
 * @async
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 * 
 * @example
 * // POST /api/sync
 * // Body: {
 * //   "collection": "advisories",
 * //   "documents": [{ "_id": "...", "message": "..." }, ...]
 * // }
 */
const syncBatch = async (req, res) => {
    try {
        const { collection, documents } = req.body;
        const { userId } = req.user;

        // Validate request
        if (!collection || !documents || !Array.isArray(documents)) {
            return res.status(400).json({
                success: false,
                message: 'Collection name and documents array are required',
            });
        }

        // Check if collection is allowed
        const Model = modelMap[collection];
        if (!Model) {
            return res.status(400).json({
                success: false,
                message: `Collection '${collection}' is not supported for sync`,
                allowedCollections: Object.keys(modelMap),
            });
        }

        const results = {
            inserted: 0,
            updated: 0,
            failed: 0,
            errors: [],
        };

        // Process each document
        for (const doc of documents) {
            try {
                // Prepare document for upsert
                const docToUpsert = { ...doc };

                // Handle _id conversion
                if (doc._id && mongoose.Types.ObjectId.isValid(doc._id)) {
                    docToUpsert._id = new mongoose.Types.ObjectId(doc._id);
                } else if (doc._id) {
                    // If _id is not a valid ObjectId, use it as a custom identifier
                    // and let MongoDB generate a new _id
                    docToUpsert.clientId = doc._id;
                    delete docToUpsert._id;
                }

                // Add user reference for user-owned collections
                if (collection === 'advisories') {
                    docToUpsert.userId = userId;
                }

                // Perform upsert
                const filter = doc._id && mongoose.Types.ObjectId.isValid(doc._id)
                    ? { _id: docToUpsert._id }
                    : { clientId: docToUpsert.clientId };

                const result = await Model.findOneAndUpdate(
                    filter,
                    { $set: docToUpsert },
                    { upsert: true, new: true, runValidators: true }
                );

                if (result.createdAt === result.updatedAt) {
                    results.inserted++;
                } else {
                    results.updated++;
                }

            } catch (docError) {
                results.failed++;
                results.errors.push({
                    document: doc._id || 'unknown',
                    error: docError.message,
                });
            }
        }

        console.log(`🔄 Sync complete for ${collection}: ${results.inserted} inserted, ${results.updated} updated, ${results.failed} failed`);

        res.status(200).json({
            success: true,
            message: 'Sync completed',
            results,
        });

    } catch (error) {
        console.error(`❌ Sync batch error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Sync failed',
            error: error.message,
        });
    }
};

/**
 * Gets documents modified since a given timestamp.
 * Used by offline clients to fetch updates.
 * 
 * @async
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 * 
 * @example
 * // GET /api/sync/pull?collection=advisories&since=2024-01-01T00:00:00Z
 */
const pullChanges = async (req, res) => {
    try {
        const { collection, since } = req.query;
        const { userId } = req.user;

        if (!collection) {
            return res.status(400).json({
                success: false,
                message: 'Collection name is required',
            });
        }

        const Model = modelMap[collection];
        if (!Model) {
            return res.status(400).json({
                success: false,
                message: `Collection '${collection}' is not supported for sync`,
            });
        }

        // Build query
        const query = {};

        // Filter by user for user-owned collections
        if (collection === 'advisories') {
            query.userId = userId;
        }

        // Filter by modification date if provided
        if (since) {
            const sinceDate = new Date(since);
            if (!isNaN(sinceDate.getTime())) {
                query.updatedAt = { $gt: sinceDate };
            }
        }

        // Fetch documents
        const documents = await Model.find(query)
            .sort({ updatedAt: -1 })
            .limit(1000)
            .lean();

        // Get the latest timestamp for next sync
        const lastSync = documents.length > 0
            ? documents[0].updatedAt
            : new Date();

        res.status(200).json({
            success: true,
            data: {
                documents,
                count: documents.length,
                lastSync,
            },
        });

    } catch (error) {
        console.error(`❌ Pull changes error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to pull changes',
            error: error.message,
        });
    }
};

/**
 * Gets the sync status for a collection.
 * Returns counts and last modification timestamps.
 * 
 * @async
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 * 
 * @example
 * // GET /api/sync/status?collection=advisories
 */
const getSyncStatus = async (req, res) => {
    try {
        const { collection } = req.query;
        const { userId } = req.user;

        if (collection) {
            // Status for specific collection
            const Model = modelMap[collection];
            if (!Model) {
                return res.status(400).json({
                    success: false,
                    message: `Collection '${collection}' is not supported`,
                });
            }

            const query = collection === 'advisories' ? { userId } : {};
            const [count, lastDoc] = await Promise.all([
                Model.countDocuments(query),
                Model.findOne(query).sort({ updatedAt: -1 }).select('updatedAt'),
            ]);

            return res.status(200).json({
                success: true,
                data: {
                    collection,
                    count,
                    lastModified: lastDoc?.updatedAt || null,
                },
            });
        }

        // Status for all collections
        const status = await Promise.all(
            Object.entries(modelMap).map(async ([name, Model]) => {
                const query = name === 'advisories' ? { userId } : {};
                const [count, lastDoc] = await Promise.all([
                    Model.countDocuments(query),
                    Model.findOne(query).sort({ updatedAt: -1 }).select('updatedAt'),
                ]);
                return {
                    collection: name,
                    count,
                    lastModified: lastDoc?.updatedAt || null,
                };
            })
        );

        res.status(200).json({
            success: true,
            data: status,
        });

    } catch (error) {
        console.error(`❌ Get sync status error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to get sync status',
            error: error.message,
        });
    }
};

/**
 * Handles conflict resolution for sync.
 * Uses last-write-wins strategy by default.
 * 
 * @async
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 * 
 * @example
 * // POST /api/sync/resolve
 * // Body: { "collection": "advisories", "documentId": "...", "resolution": "server" | "client", "clientData": {...} }
 */
const resolveConflict = async (req, res) => {
    try {
        const { collection, documentId, resolution, clientData } = req.body;

        if (!collection || !documentId || !resolution) {
            return res.status(400).json({
                success: false,
                message: 'Collection, documentId, and resolution are required',
            });
        }

        const Model = modelMap[collection];
        if (!Model) {
            return res.status(400).json({
                success: false,
                message: `Collection '${collection}' is not supported`,
            });
        }

        let resolvedDoc;

        if (resolution === 'client' && clientData) {
            // Use client version
            resolvedDoc = await Model.findByIdAndUpdate(
                documentId,
                { $set: clientData },
                { new: true, runValidators: true }
            );
        } else {
            // Use server version (just return current)
            resolvedDoc = await Model.findById(documentId);
        }

        if (!resolvedDoc) {
            return res.status(404).json({
                success: false,
                message: 'Document not found',
            });
        }

        res.status(200).json({
            success: true,
            message: `Conflict resolved using ${resolution} version`,
            data: resolvedDoc,
        });

    } catch (error) {
        console.error(`❌ Resolve conflict error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to resolve conflict',
            error: error.message,
        });
    }
};

export {
    syncBatch,
    pullChanges,
    getSyncStatus,
    resolveConflict,
};
