/**
 * Weather Service for OpenWeatherMap API integration.
 * Provides weather data and generates advisories for farmers.
 * 
 * NOTE: Current implementation uses hardcoded mock data.
 * For production, integrate with the actual OpenWeatherMap API.
 */

/**
 * Mock weather data for different conditions.
 * Simulates various weather scenarios for testing.
 */
const MOCK_WEATHER_DATA = {
    current: {
        temp: 28,
        humidity: 65,
        windSpeed: 12,
        condition: 'partly_cloudy',
        description: 'Partly cloudy with moderate humidity',
        uvIndex: 6,
        visibility: 10,
        pressure: 1015,
    },
    forecast: [
        { day: 'Today', high: 32, low: 24, condition: 'sunny', rainChance: 10 },
        { day: 'Tomorrow', high: 30, low: 23, condition: 'cloudy', rainChance: 40 },
        { day: 'Day 3', high: 28, low: 22, condition: 'rain', rainChance: 80 },
        { day: 'Day 4', high: 26, low: 21, condition: 'rain', rainChance: 70 },
        { day: 'Day 5', high: 29, low: 22, condition: 'partly_cloudy', rainChance: 20 },
    ],
    alerts: [
        {
            type: 'rain',
            severity: 'medium',
            message: 'Heavy rainfall expected in the next 48-72 hours. Consider delaying fertilizer application.',
        },
    ],
};

/**
 * Fetches current weather data for given coordinates.
 * Uses mock data - integrate with OpenWeatherMap API for production.
 * 
 * @async
 * @param {number} lat - Latitude coordinate
 * @param {number} lon - Longitude coordinate
 * @returns {Promise<Object>} Current weather data object
 * @example
 * const weather = await getCurrentWeather(19.076, 72.877);
 */
const getCurrentWeather = async (lat, lon) => {
    try {
        // In production, use actual API:
        // const apiKey = process.env.OPENWEATHER_API_KEY;
        // const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        // const response = await axios.get(url);
        // return transformWeatherResponse(response.data);

        // Mock implementation
        console.log(`🌤️ Fetching weather for coordinates: ${lat}, ${lon}`);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 100));

        return {
            ...MOCK_WEATHER_DATA.current,
            coordinates: { lat, lon },
            timestamp: new Date().toISOString(),
        };

    } catch (error) {
        console.error(`❌ Weather fetch error: ${error.message}`);
        throw new Error(`Failed to fetch weather: ${error.message}`);
    }
};

/**
 * Fetches 5-day weather forecast for given coordinates.
 * 
 * @async
 * @param {number} lat - Latitude coordinate
 * @param {number} lon - Longitude coordinate
 * @returns {Promise<Array>} Array of daily forecast objects
 */
const getForecast = async (lat, lon) => {
    try {
        // In production, use actual API:
        // const apiKey = process.env.OPENWEATHER_API_KEY;
        // const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

        console.log(`📅 Fetching forecast for coordinates: ${lat}, ${lon}`);

        await new Promise(resolve => setTimeout(resolve, 100));

        return MOCK_WEATHER_DATA.forecast;

    } catch (error) {
        console.error(`❌ Forecast fetch error: ${error.message}`);
        throw new Error(`Failed to fetch forecast: ${error.message}`);
    }
};

/**
 * Generates agricultural advisories based on weather conditions.
 * 
 * @param {Object} weather - Current weather data
 * @param {Array} forecast - Forecast data
 * @param {string} cropType - User's primary crop type
 * @returns {Array<Object>} Array of advisory objects
 */
const generateWeatherAdvisories = (weather, forecast, cropType) => {
    const advisories = [];
    const now = new Date();

    // High temperature advisory
    if (weather.temp > 35) {
        advisories.push({
            type: 'weather',
            message: `High temperature alert (${weather.temp}°C). Ensure adequate irrigation and consider shade nets for sensitive crops.`,
            severity: 'high',
            metadata: { temp: weather.temp, condition: 'heat' },
            expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000), // 24 hours
        });
    }

    // Low humidity advisory
    if (weather.humidity < 40) {
        advisories.push({
            type: 'irrigation',
            message: `Low humidity (${weather.humidity}%). Increase irrigation frequency to prevent crop stress.`,
            severity: 'medium',
            metadata: { humidity: weather.humidity },
            expiresAt: new Date(now.getTime() + 12 * 60 * 60 * 1000),
        });
    }

    // High humidity (pest risk)
    if (weather.humidity > 85) {
        advisories.push({
            type: 'pest',
            message: `High humidity (${weather.humidity}%) increases fungal disease risk. Monitor crops closely and consider preventive fungicide application.`,
            severity: 'medium',
            metadata: { humidity: weather.humidity },
            expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
        });
    }

    // Rain forecast advisory
    const rainyDays = forecast.filter(day => day.rainChance > 60);
    if (rainyDays.length > 0) {
        advisories.push({
            type: 'weather',
            message: `Rain expected in the coming days (${rainyDays.length} days with >60% chance). Delay fertilizer and pesticide applications.`,
            severity: 'medium',
            metadata: { rainyDays: rainyDays.length },
            expiresAt: new Date(now.getTime() + 48 * 60 * 60 * 1000),
        });
    }

    // Wind advisory
    if (weather.windSpeed > 30) {
        advisories.push({
            type: 'weather',
            message: `Strong winds expected (${weather.windSpeed} km/h). Secure greenhouse covers and support tall crops.`,
            severity: 'high',
            metadata: { windSpeed: weather.windSpeed },
            expiresAt: new Date(now.getTime() + 12 * 60 * 60 * 1000),
        });
    }

    // Crop-specific advisories
    const cropAdvisory = getCropSpecificAdvisory(weather, cropType);
    if (cropAdvisory) {
        advisories.push(cropAdvisory);
    }

    return advisories;
};

/**
 * Generates crop-specific weather advisories.
 * 
 * @param {Object} weather - Current weather data
 * @param {string} cropType - User's crop type
 * @returns {Object|null} Crop-specific advisory or null
 */
const getCropSpecificAdvisory = (weather, cropType) => {
    const now = new Date();

    const cropAdvisories = {
        rice: {
            condition: weather.temp > 30 && weather.humidity > 70,
            message: 'Ideal conditions for rice cultivation. Monitor water levels in paddy fields.',
            severity: 'low',
        },
        wheat: {
            condition: weather.temp > 25,
            message: 'Temperature rising above optimal for wheat. Ensure timely irrigation to prevent heat stress.',
            severity: 'medium',
        },
        cotton: {
            condition: weather.humidity > 80,
            message: 'High humidity may affect cotton boll development. Watch for bollworm activity.',
            severity: 'medium',
        },
        vegetables: {
            condition: weather.temp > 32,
            message: 'High temperatures may affect vegetable quality. Consider shade nets and mulching.',
            severity: 'medium',
        },
    };

    const advisory = cropAdvisories[cropType];
    if (advisory && advisory.condition) {
        return {
            type: 'general',
            message: advisory.message,
            severity: advisory.severity,
            cropType,
            metadata: { weather },
            expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
        };
    }

    return null;
};

/**
 * Gets weather alerts for a location.
 * 
 * @async
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Array>} Array of weather alerts
 */
const getWeatherAlerts = async (lat, lon) => {
    try {
        // Mock implementation
        return MOCK_WEATHER_DATA.alerts;
    } catch (error) {
        console.error(`❌ Alert fetch error: ${error.message}`);
        return [];
    }
};

export {
    getCurrentWeather,
    getForecast,
    generateWeatherAdvisories,
    getCropSpecificAdvisory,
    getWeatherAlerts,
};
