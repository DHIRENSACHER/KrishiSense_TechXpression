/**
 * Notification Service using notifme-sdk.
 * Handles multi-channel notifications (currently focused on SMS).
 */

import NotifmeSdk from 'notifme-sdk';

// Environment variables for Notifme
const provider = process.env.NOTIFME_SMS_PROVIDER || 'infobip';
const from = process.env.NOTIFME_TWILIO_PHONE_NUMBER || process.env.NOTIFME_SMS_FROM || 'KrushiSense';

// Initialize Notifme SDK
// We use a getter to ensure environment variables are loaded and to allow mock fallback
let notifme;

const getNotifme = () => {
    if (!notifme) {
        // Configuration for Notifme providers
        // In a real scenario, you'd configure multiple providers or choose one
        const sdkConfig = {
            channels: {
                sms: {
                    providers: []
                }
            }
        };

        // Configure Infobip if credentials exist
        if (provider === 'infobip' && process.env.NOTIFME_INFOBIP_API_KEY) {
            sdkConfig.channels.sms.providers.push({
                type: 'infobip',
                apiKey: process.env.NOTIFME_INFOBIP_API_KEY,
                baseUrl: process.env.NOTIFME_INFOBIP_BASE_URL
            });
        }

        // Configure Twilio if credentials exist
        if (provider === 'twilio' && process.env.NOTIFME_TWILIO_ACCOUNT_SID && process.env.NOTIFME_TWILIO_AUTH_TOKEN) {
            sdkConfig.channels.sms.providers.push({
                type: 'twilio',
                accountSid: process.env.NOTIFME_TWILIO_ACCOUNT_SID,
                authToken: process.env.NOTIFME_TWILIO_AUTH_TOKEN
            });
        }

        // Add a logger provider as fallback for development
        sdkConfig.channels.sms.providers.push({
            type: 'logger'
        });

        notifme = new NotifmeSdk.default(sdkConfig);
    }
    return notifme;
};

/**
 * Sends an SMS notification.
 * 
 * @async
 * @param {string} to - Recipient phone number
 * @param {string} text - Message content
 * @returns {Promise<Object>} Notifme result object
 */
const sendSMS = async (to, text) => {
    try {
        const sdk = getNotifme();
        const result = await sdk.send({
            sms: { from, to, text }
        });

        if (result.status === 'success') {
            console.log(`✅ Notification sent successfully to ${to}`);
        } else {
            console.warn(`⚠️ Notification failed for some providers to ${to}`);
        }
        return result;
    } catch (error) {
        console.error(`❌ Notifme error sending to ${to}:`, error.message);
        throw error;
    }
};

/**
 * Sends an OTP for authentication.
 * 
 * @async
 * @param {string} phone - Recipient phone number
 * @param {string} otp - The OTP code
 */
const sendOTP = async (phone, otp) => {
    const text = `Your KrushiSense verification code is: ${otp}. Valid for 5 minutes.`;
    return await sendSMS(phone, text);
};

/**
 * Sends an irrigation alert.
 * 
 * @async
 * @param {string} phone - Recipient phone number
 * @param {Object} data - Alert data
 */
const sendIrrigationAlert = async (phone, data) => {
    const { crop, status } = data;
    const text = `[KrushiSense Alert] Irrigation Notice for your ${crop}: ${status}. Check the app for details.`;
    return await sendSMS(phone, text);
};

/**
 * Sends a government scheme alert.
 * 
 * @async
 * @param {string} phone - Recipient phone number
 * @param {Object} scheme - Scheme data
 */
const sendSchemeAlert = async (phone, scheme) => {
    const { title } = scheme;
    const text = `[KrushiSense Scheme] New scheme available: ${title}. You may be eligible! Tap to view details.`;
    return await sendSMS(phone, text);
};

export {
    sendSMS,
    sendOTP,
    sendIrrigationAlert,
    sendSchemeAlert
};
