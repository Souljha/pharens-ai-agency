/**
 * Phone Number Validation and Formatting Utilities
 * Primarily for South African phone numbers, but supports international formats
 */

/**
 * Format a phone number to E.164 format (required for Vapi outbound calls)
 * @param {string} phoneNumber - The phone number to format
 * @param {string} defaultCountryCode - Default country code (e.g., '+27' for South Africa)
 * @returns {string} - Formatted phone number in E.164 format
 */
export function formatPhoneToE164(phoneNumber, defaultCountryCode = '+27') {
  if (!phoneNumber) return '';

  // Remove all non-digit characters except '+'
  let cleaned = phoneNumber.replace(/[^\d+]/g, '');

  // If number already starts with '+', it's likely already in international format
  if (cleaned.startsWith('+')) {
    return cleaned;
  }

  // If number starts with '00', replace with '+'
  if (cleaned.startsWith('00')) {
    return '+' + cleaned.substring(2);
  }

  // Handle South African numbers
  if (defaultCountryCode === '+27') {
    // If number starts with '0', it's a local SA number - replace '0' with '+27'
    if (cleaned.startsWith('0')) {
      return '+27' + cleaned.substring(1);
    }

    // If number starts with '27', add '+'
    if (cleaned.startsWith('27')) {
      return '+' + cleaned;
    }

    // If it's just digits without country code, add '+27'
    if (cleaned.length >= 9 && !cleaned.startsWith('0')) {
      return '+27' + cleaned;
    }
  }

  // For other countries or if format is unclear, prepend default country code
  return defaultCountryCode + cleaned;
}

/**
 * Validate if a phone number is valid for outbound calls
 * @param {string} phoneNumber - The phone number to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export function isValidPhoneNumber(phoneNumber) {
  if (!phoneNumber) return false;

  // Format to E.164
  const formatted = formatPhoneToE164(phoneNumber);

  // E.164 format validation:
  // - Starts with '+'
  // - Followed by 1-15 digits
  const e164Regex = /^\+[1-9]\d{1,14}$/;

  return e164Regex.test(formatted);
}

/**
 * Validate specifically South African phone numbers
 * @param {string} phoneNumber - The phone number to validate
 * @returns {boolean} - True if valid SA number, false otherwise
 */
export function isValidSAPhoneNumber(phoneNumber) {
  if (!phoneNumber) return false;

  const formatted = formatPhoneToE164(phoneNumber, '+27');

  // SA numbers: +27 followed by 9 digits (mobile or landline)
  // Mobile: +27 6/7/8 XXXXXXXX (10 digits total after +27)
  // Landline: +27 1X/2X/3X/4X/5X XXXXXXX
  const saPhoneRegex = /^\+27[1-8]\d{8}$/;

  return saPhoneRegex.test(formatted);
}

/**
 * Format phone number for display (adds spaces for readability)
 * @param {string} phoneNumber - The phone number to format
 * @returns {string} - Formatted phone number for display
 */
export function formatPhoneForDisplay(phoneNumber) {
  const e164 = formatPhoneToE164(phoneNumber);

  // Format South African numbers as +27 XX XXX XXXX
  if (e164.startsWith('+27') && e164.length === 12) {
    return `${e164.substring(0, 3)} ${e164.substring(3, 5)} ${e164.substring(5, 8)} ${e164.substring(8)}`;
  }

  // For other formats, just add space after country code
  const match = e164.match(/^(\+\d{1,3})(\d+)$/);
  if (match) {
    return `${match[1]} ${match[2]}`;
  }

  return e164;
}

/**
 * Get phone number validation error message
 * @param {string} phoneNumber - The phone number to validate
 * @returns {string|null} - Error message or null if valid
 */
export function getPhoneValidationError(phoneNumber) {
  if (!phoneNumber) {
    return 'Phone number is required';
  }

  if (!isValidPhoneNumber(phoneNumber)) {
    return 'Please enter a valid phone number (e.g., 0602785621 or +27602785621)';
  }

  return null;
}
