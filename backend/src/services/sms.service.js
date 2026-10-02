const config = require('../config/env');

/**
 * Service interface for SMS and OTP handling.
 * Per specification:
 * - OTP is mocked (always 123456, logged to console)
 * - SMS is mocked (printed to console) behind a clean service interface
 */
class SmsService {
  /**
   * Send OTP to a phone number (Mocked)
   * @param {string} phone
   * @param {string} otp
   * @returns {Promise<boolean>}
   */
  async sendOtp(phone, otp = config.mockOtpCode) {
    console.log('\n================== [MOCK SMS SERVICE - OTP] ==================');
    console.log(`📱 Recipient Phone: ${phone}`);
    console.log(`🔑 Verification OTP: ${otp}`);
    console.log(`⏰ Valid for: 10 minutes`);
    console.log('==============================================================\n');
    return true;
  }

  /**
   * Send an arbitrary SMS notification (Mocked)
   * @param {string} phone
   * @param {string} message
   * @returns {Promise<boolean>}
   */
  async sendSms(phone, message) {
    console.log('\n================== [MOCK SMS SERVICE - NOTIFICATION] =========');
    console.log(`📱 Recipient Phone: ${phone}`);
    console.log(`💬 Message: ${message}`);
    console.log('==============================================================\n');
    return true;
  }

  /**
   * Verify an OTP code
   * @param {string} inputOtp
   * @returns {boolean}
   */
  verifyOtp(inputOtp) {
    // Specification: OTP is mocked, always 123456
    return String(inputOtp).trim() === String(config.mockOtpCode).trim();
  }
}

module.exports = new SmsService();
