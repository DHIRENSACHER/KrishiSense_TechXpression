/**
 * Notification Service using notifme-sdk.
 * Handles multi-channel notifications (currently focused on SMS).
 */

import NotifmeSdk from 'notifme-sdk';
import twilio from 'twilio';

// Environment variables for Notifme
const provider = process.env.NOTIFME_SMS_PROVIDER || 'twilio';
const from = process.env.NOTIFME_TWILIO_PHONE_NUMBER || process.env.NOTIFME_SMS_FROM || 'KrushiSense';

// Initialize Twilio client
const twilioClient = process.env.NOTIFME_TWILIO_ACCOUNT_SID && process.env.NOTIFME_TWILIO_AUTH_TOKEN
    ? twilio(process.env.NOTIFME_TWILIO_ACCOUNT_SID, process.env.NOTIFME_TWILIO_AUTH_TOKEN)
    : null;

const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

/**
 * Normalizes a phone number to E.164 format.
 * @param {string} phone - The phone number to format
 * @returns {string} E.164 formatted phone number
 */
const formatToE164 = (phone) => {
    if (!phone) return '';
    let cleaned = phone.replace(/\D/g, '');
    // If 10 digits, assume India (+91)
    if (cleaned.length === 10) return `+91${cleaned}`;
    // If it starts with 91 and has 12 digits, just add +
    if (cleaned.length === 12 && cleaned.startsWith('91')) return `+${cleaned}`;
    // Otherwise return as is if it already has +
    return phone.startsWith('+') ? phone : `+${cleaned}`;
};

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
        const normalizedTo = formatToE164(to);
        const statusCallback = process.env.TWILIO_STATUS_CALLBACK_URL;

        const result = await sdk.send({
            sms: {
                from,
                to: normalizedTo,
                text,
                ...(provider === 'twilio' && statusCallback ? { statusCallback } : {})
            }
        });

        if (result.status === 'success') {
            console.log(`✅ Notification sent successfully to ${normalizedTo}`);
        } else {
            const errorMsg = result.errors ? Object.values(result.errors).join(', ') : 'Unknown error';
            console.error(`❌ Notification failed for ${normalizedTo}: ${errorMsg}`);
            throw new Error(`SMS Provider Error: ${errorMsg}`);
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

/**
 * Sends an OTP using Twilio Verify API.
 * @param {string} phone - Recipient phone number
 * @returns {Promise<Object>} Twilio response
 */
const sendTwilioVerifyOTP = async (phone) => {
    if (!twilioClient || !verifyServiceSid) {
        throw new Error('Twilio Verify service not configured');
    }
    const normalizedTo = formatToE164(phone);
    return twilioClient.verify.v2.services(verifyServiceSid)
        .verifications.create({ to: normalizedTo, channel: 'sms' });
};

/**
 * Checks an OTP using Twilio Verify API.
 * @param {string} phone - Recipient phone number
 * @param {string} code - The 6-digit code
 * @returns {Promise<Object>} Twilio response
 */
const checkTwilioVerifyOTP = async (phone, code) => {
    if (!twilioClient || !verifyServiceSid) {
        throw new Error('Twilio Verify service not configured');
    }
    const normalizedTo = formatToE164(phone);
    return twilioClient.verify.v2.services(verifyServiceSid)
        .verificationChecks.create({ to: normalizedTo, code });
};

export {
    sendSMS,
    sendOTP,
    sendIrrigationAlert,
    sendSchemeAlert,
    sendTwilioVerifyOTP,
    checkTwilioVerifyOTP
};
