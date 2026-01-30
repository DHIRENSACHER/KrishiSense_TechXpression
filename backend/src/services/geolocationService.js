/**
 * Geolocation Service for address/coordinates conversion.
 * Uses OpenWeatherMap Geocoding API for geocoding and reverse geocoding.
 */

import axios from 'axios';

const GEO_API_SEARCH_URL = 'https://api.geoapify.com/v1/geocode/search';
const GEO_API_REVERSE_URL = 'https://api.geoapify.com/v1/geocode/reverse';

/**
 * Gets the Geoapify API key from environment.
 * @returns {string} API key
 */
const getApiKey = () => process.env.GEOAPIFY_API_KEY;

/**
 * Geocodes an address/city name to coordinates.
 * 
 * @async
 * @param {string} query - Address, city, or village name to geocode
 * @param {number} limit - Maximum number of results (default: 5)
 * @returns {Promise<Array>} Array of location results
 * @example
 * const locations = await geocodeAddress('Mumbai, India');
 * // Returns: [{ name: 'Mumbai', lat: 19.0760, lon: 72.8777, country: 'IN', state: 'Maharashtra' }]
 */
const geocodeAddress = async (query, limit = 5) => {
    try {
        const apiKey = getApiKey();
        if (!apiKey) {
            throw new Error('Geoapify API key is not configured');
        }

        if (!query || query.trim().length === 0) {
            throw new Error('Search query is required');
        }

        console.log(`📍 Geocoding address via Geoapify: "${query}"`);

        const url = `${GEO_API_SEARCH_URL}?text=${encodeURIComponent(query)}&limit=${limit}&apiKey=${apiKey}`;
        const response = await axios.get(url);

        if (!response.data || !response.data.features || response.data.features.length === 0) {
            return [];
        }

        // Transform Geoapify response to consistent format
        return response.data.features.map(feature => {
            const loc = feature.properties;
            return {
                name: loc.city || loc.village || loc.municipality || loc.name,
                localName: loc.name,
                lat: loc.lat,
                lon: loc.lon,
                country: loc.country_code?.toUpperCase() || loc.country,
                state: loc.state || null,
                displayName: loc.formatted || formatDisplayName(loc),
            };
        });

    } catch (error) {
        console.error(`❌ Geocoding error: ${error.message}`);
        if (error.response) {
            console.error(`API Response: ${JSON.stringify(error.response.data)}`);
        }
        throw new Error(`Failed to geocode address: ${error.message}`);
    }
};

/**
 * Reverse geocodes coordinates to address/location name.
 * 
 * @async
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {number} limit - Maximum number of results (default: 1)
 * @returns {Promise<Object|null>} Location details or null if not found
 * @example
 * const location = await reverseGeocode(19.076, 72.877);
 * // Returns: { name: 'Mumbai', state: 'Maharashtra', country: 'IN', displayName: 'Mumbai, Maharashtra, IN' }
 */
const reverseGeocode = async (lat, lon, limit = 1) => {
    try {
        const apiKey = getApiKey();
        if (!apiKey) {
            throw new Error('Geoapify API key is not configured');
        }

        if (lat === undefined || lon === undefined) {
            throw new Error('Latitude and longitude are required');
        }

        console.log(`📍 Reverse geocoding via Geoapify: ${lat}, ${lon}`);

        const url = `${GEO_API_REVERSE_URL}?lat=${lat}&lon=${lon}&limit=${limit}&apiKey=${apiKey}`;
        const response = await axios.get(url);

        if (!response.data || !response.data.features || response.data.features.length === 0) {
            return null;
        }

        const loc = response.data.features[0].properties;
        return {
            name: loc.city || loc.village || loc.municipality || loc.name,
            localName: loc.name,
            lat: loc.lat,
            lon: loc.lon,
            country: loc.country_code?.toUpperCase() || loc.country,
            state: loc.state || null,
            displayName: loc.formatted || formatDisplayName(loc),
        };

    } catch (error) {
        console.error(`❌ Reverse geocoding error: ${error.message}`);
        if (error.response) {
            console.error(`API Response: ${JSON.stringify(error.response.data)}`);
        }
        throw new Error(`Failed to reverse geocode: ${error.message}`);
    }
};

/**
 * Formats a location object into a display-friendly string.
 * 
 * @param {Object} loc - Location object from API
 * @returns {string} Formatted display name (e.g., "Mumbai, Maharashtra, IN")
 */
const formatDisplayName = (loc) => {
    const parts = [loc.name];
    if (loc.state) parts.push(loc.state);
    if (loc.country) parts.push(loc.country);
    return parts.join(', ');
};

/**
 * Gets detailed location information from coordinates.
 * Combines reverse geocoding with formatted output.
 * 
 * @async
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>} Detailed location information
 */
const getLocationDetails = async (lat, lon) => {
    try {
        const location = await reverseGeocode(lat, lon);

        if (!location) {
            return {
                name: 'Unknown',
                state: null,
                country: null,
                displayName: 'Unknown Location',
                coordinates: { lat, lon },
            };
        }

        return {
            ...location,
            coordinates: { lat, lon },
        };

    } catch (error) {
        console.error(`❌ Get location details error: ${error.message}`);
        return {
            name: 'Unknown',
            state: null,
            country: null,
            displayName: 'Unknown Location',
            coordinates: { lat, lon },
        };
    }
};

/**
 * Validates if coordinates are valid (not default 0,0).
 * 
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {boolean} True if coordinates are valid
 */
const isValidCoordinates = (lat, lon) => {
    if (lat === undefined || lon === undefined) return false;
    if (lat === 0 && lon === 0) return false;
    if (lat < -90 || lat > 90) return false;
    if (lon < -180 || lon > 180) return false;
    return true;
};

/**
 * Searches for locations by query and returns the best match.
 * 
 * @async
 * @param {string} query - Search query
 * @returns {Promise<Object|null>} Best matching location or null
 */
const findBestMatch = async (query) => {
    const results = await geocodeAddress(query, 1);
    return results.length > 0 ? results[0] : null;
};

export {
    geocodeAddress,
    reverseGeocode,
    getLocationDetails,
    formatDisplayName,
    isValidCoordinates,
    findBestMatch,
};
