/**
 * Weather Service for OpenWeatherMap API integration.
 * Provides weather data and generates advisories for farmers.
 */

import axios from 'axios';

const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * Gets the OpenWeatherMap API key from environment.
 * @returns {string} API key
 */
const getApiKey = () => process.env.OPENWEATHER_API_KEY;

/**
 * Maps OpenWeatherMap weather condition codes to simple condition names.
 * @param {number} conditionCode - OpenWeatherMap condition code
 * @returns {string} Simple condition name
 */
const mapWeatherCondition = (conditionCode) => {
    if (conditionCode >= 200 && conditionCode < 300) return 'thunderstorm';
    if (conditionCode >= 300 && conditionCode < 400) return 'drizzle';
    if (conditionCode >= 500 && conditionCode < 600) return 'rain';
    if (conditionCode >= 600 && conditionCode < 700) return 'snow';
    if (conditionCode >= 700 && conditionCode < 800) return 'fog';
    if (conditionCode === 800) return 'sunny';
    if (conditionCode > 800) return 'partly_cloudy';
    return 'unknown';
};

/**
 * Transforms OpenWeatherMap current weather response to our format.
 * @param {Object} data - Raw API response
 * @returns {Object} Transformed weather data
 */
const transformCurrentWeatherResponse = (data) => {
    return {
        temp: Math.round(data.main.temp),
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
        condition: mapWeatherCondition(data.weather[0].id),
        description: data.weather[0].description,
        uvIndex: data.uvi || 0,
        visibility: data.visibility ? data.visibility / 1000 : 10, // Convert to km
        pressure: data.main.pressure,
        feelsLike: Math.round(data.main.feels_like),
        clouds: data.clouds?.all || 0,
    };
};

/**
 * Transforms OpenWeatherMap forecast response to our format.
 * @param {Object} data - Raw API response
 * @returns {Array} Transformed forecast data
 */
const transformForecastResponse = (data) => {
    const dailyForecasts = {};

    // Group by date and find high/low for each day
    data.list.forEach((item) => {
        const date = new Date(item.dt * 1000);
        const dateKey = date.toISOString().split('T')[0];

        if (!dailyForecasts[dateKey]) {
            dailyForecasts[dateKey] = {
                date: dateKey,
                temps: [],
                conditions: [],
                rainChances: [],
            };
        }

        dailyForecasts[dateKey].temps.push(item.main.temp);
        dailyForecasts[dateKey].conditions.push(item.weather[0].id);
        dailyForecasts[dateKey].rainChances.push(item.pop * 100); // Convert to percentage
    });

    // Convert to array and format
    const days = Object.values(dailyForecasts).slice(0, 5);
    const dayNames = ['Today', 'Tomorrow', 'Day 3', 'Day 4', 'Day 5'];

    return days.map((day, index) => {
        const avgConditionCode = day.conditions[Math.floor(day.conditions.length / 2)];
        return {
            day: dayNames[index] || `Day ${index + 1}`,
            date: day.date,
            high: Math.round(Math.max(...day.temps)),
            low: Math.round(Math.min(...day.temps)),
            condition: mapWeatherCondition(avgConditionCode),
            rainChance: Math.round(Math.max(...day.rainChances)),
        };
    });
};

/**
 * Fetches current weather data for given coordinates.
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
        const apiKey = getApiKey();
        if (!apiKey) {
            throw new Error('OpenWeatherMap API key is not configured');
        }

        console.log(`🌤️ Fetching weather for coordinates: ${lat}, ${lon}`);

        const url = `${OPENWEATHER_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        const response = await axios.get(url);

        const transformedData = transformCurrentWeatherResponse(response.data);

        return {
            ...transformedData,
            coordinates: { lat, lon },
            location: response.data.name,
            timestamp: new Date().toISOString(),
        };

    } catch (error) {
        console.error(`❌ Weather fetch error: ${error.message}`);
        if (error.response) {
            console.error(`API Response Status: ${error.response.status}`);
            console.error(`API Response Data: ${JSON.stringify(error.response.data)}`);
        }
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
        const apiKey = getApiKey();
        if (!apiKey) {
            throw new Error('OpenWeatherMap API key is not configured');
        }

        console.log(`📅 Fetching forecast for coordinates: ${lat}, ${lon}`);

        const url = `${OPENWEATHER_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        const response = await axios.get(url);

        return transformForecastResponse(response.data);

    } catch (error) {
        console.error(`❌ Forecast fetch error: ${error.message}`);
        if (error.response) {
            console.error(`API Response Status: ${error.response.status}`);
            console.error(`API Response Data: ${JSON.stringify(error.response.data)}`);
        }
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

    // Frost warning
    if (weather.temp < 5) {
        advisories.push({
            type: 'weather',
            message: `Frost warning! Temperature is ${weather.temp}°C. Protect sensitive crops with covers or move potted plants indoors.`,
            severity: 'high',
            metadata: { temp: weather.temp, condition: 'frost' },
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
        sugarcane: {
            condition: weather.temp > 35,
            message: 'High temperature may stress sugarcane. Ensure adequate irrigation for optimal growth.',
            severity: 'medium',
        },
        maize: {
            condition: weather.temp > 32 && weather.humidity < 50,
            message: 'Hot and dry conditions not ideal for maize. Increase irrigation frequency.',
            severity: 'medium',
        },
    };

    const advisory = cropAdvisories[cropType?.toLowerCase()];
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
 * Gets weather alerts for a location using One Call API (requires subscription).
 * Falls back to generating alerts from current weather and forecast data.
 * 
 * @async
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Array>} Array of weather alerts
 */
const getWeatherAlerts = async (lat, lon) => {
    try {
        // Try to get current weather and forecast to generate alerts
        const [currentWeather, forecast] = await Promise.all([
            getCurrentWeather(lat, lon),
            getForecast(lat, lon),
        ]);

        const alerts = [];

        // Generate alerts based on current conditions
        if (currentWeather.temp > 40) {
            alerts.push({
                type: 'extreme_heat',
                severity: 'high',
                message: `Extreme heat warning: Temperature is ${currentWeather.temp}°C. Take precautions to protect crops and livestock.`,
            });
        }

        if (currentWeather.temp < 0) {
            alerts.push({
                type: 'freeze',
                severity: 'high',
                message: `Freeze warning: Temperature is ${currentWeather.temp}°C. Protect sensitive crops immediately.`,
            });
        }

        // Check forecast for heavy rain
        const heavyRainDays = forecast.filter(day => day.rainChance > 80);
        if (heavyRainDays.length >= 2) {
            alerts.push({
                type: 'rain',
                severity: 'medium',
                message: `Heavy rainfall expected in the next ${heavyRainDays.length} days. Consider delaying fertilizer application and prepare for possible waterlogging.`,
            });
        }

        // Strong wind alert
        if (currentWeather.windSpeed > 50) {
            alerts.push({
                type: 'wind',
                severity: 'high',
                message: `Strong wind alert: Wind speed is ${currentWeather.windSpeed} km/h. Secure structures and protect crops.`,
            });
        }

        return alerts;

    } catch (error) {
        console.error(`❌ Alert fetch error: ${error.message}`);
        return [];
    }
};

/**
 * Gets complete weather data including current, forecast, and alerts.
 * 
 * @async
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {string} cropType - Optional crop type for specific advisories
 * @returns {Promise<Object>} Complete weather data object
 */
const getCompleteWeatherData = async (lat, lon, cropType = null) => {
    try {
        const [current, forecast] = await Promise.all([
            getCurrentWeather(lat, lon),
            getForecast(lat, lon),
        ]);

        const advisories = generateWeatherAdvisories(current, forecast, cropType);

        // Generate alerts based on conditions
        const alerts = [];
        if (current.temp > 40 || current.temp < 0 || current.windSpeed > 50) {
            const fetchedAlerts = await getWeatherAlerts(lat, lon);
            alerts.push(...fetchedAlerts);
        }

        return {
            current,
            forecast,
            advisories,
            alerts,
            fetchedAt: new Date().toISOString(),
        };

    } catch (error) {
        console.error(`❌ Complete weather data fetch error: ${error.message}`);
        throw error;
    }
};

export {
    getCurrentWeather,
    getForecast,
    generateWeatherAdvisories,
    getCropSpecificAdvisory,
    getWeatherAlerts,
    getCompleteWeatherData,
};
