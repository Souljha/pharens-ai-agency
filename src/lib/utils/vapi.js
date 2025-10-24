import Vapi from '@vapi-ai/web';

/**
 * Vapi Configuration and Utility Functions
 *
 * This module handles the initialization and management of the Vapi AI Voice Agent
 * integrated with Twilio for voice communication.
 */

// Initialize Vapi client - will be configured with your API key
let vapiInstance = null;

/**
 * Initialize the Vapi client with your public key
 * @param {string} publicKey - Your Vapi public API key
 * @returns {Vapi} Vapi client instance
 */
export function initializeVapi(publicKey) {
  if (!vapiInstance) {
    vapiInstance = new Vapi(publicKey);
  }
  return vapiInstance;
}

/**
 * Get the current Vapi instance
 * @returns {Vapi|null} Current Vapi instance or null if not initialized
 */
export function getVapiInstance() {
  return vapiInstance;
}

/**
 * Start a voice call with the AI assistant
 * @param {string} assistantId - Your Vapi assistant ID
 * @param {Object} options - Additional call options
 * @returns {Promise} Call promise
 */
export async function startCall(assistantId, options = {}) {
  if (!vapiInstance) {
    throw new Error('Vapi client not initialized. Call initializeVapi() first.');
  }

  // For Vapi SDK v2.5.0, pass assistantId directly as first parameter
  return vapiInstance.start(assistantId);
}

/**
 * End the current active call
 */
export function endCall() {
  if (!vapiInstance) {
    throw new Error('Vapi client not initialized.');
  }
  vapiInstance.stop();
}

/**
 * Check if a call is currently active
 * @returns {boolean} True if call is active
 */
export function isCallActive() {
  if (!vapiInstance) {
    return false;
  }
  // Vapi exposes the call state through events
  return vapiInstance.isMuted !== undefined;
}

/**
 * Mute/unmute the microphone during a call
 * @param {boolean} mute - True to mute, false to unmute
 */
export function setMuted(mute) {
  if (!vapiInstance) {
    throw new Error('Vapi client not initialized.');
  }
  vapiInstance.setMuted(mute);
}

/**
 * Get the current mute status
 * @returns {boolean} True if muted
 */
export function isMuted() {
  if (!vapiInstance) {
    return false;
  }
  return vapiInstance.isMuted;
}

/**
 * Setup event listeners for the Vapi client
 * @param {Object} callbacks - Event callback functions
 * @param {Function} callbacks.onCallStart - Called when call starts
 * @param {Function} callbacks.onCallEnd - Called when call ends
 * @param {Function} callbacks.onSpeechStart - Called when user starts speaking
 * @param {Function} callbacks.onSpeechEnd - Called when user stops speaking
 * @param {Function} callbacks.onMessage - Called when a message is received
 * @param {Function} callbacks.onError - Called when an error occurs
 */
export function setupEventListeners(callbacks = {}) {
  if (!vapiInstance) {
    throw new Error('Vapi client not initialized.');
  }

  const {
    onCallStart,
    onCallEnd,
    onSpeechStart,
    onSpeechEnd,
    onMessage,
    onError,
    onVolumeLevel,
  } = callbacks;

  if (onCallStart) {
    vapiInstance.on('call-start', onCallStart);
  }

  if (onCallEnd) {
    vapiInstance.on('call-end', onCallEnd);
  }

  if (onSpeechStart) {
    vapiInstance.on('speech-start', onSpeechStart);
  }

  if (onSpeechEnd) {
    vapiInstance.on('speech-end', onSpeechEnd);
  }

  if (onMessage) {
    vapiInstance.on('message', onMessage);
  }

  if (onError) {
    vapiInstance.on('error', onError);
  }

  if (onVolumeLevel) {
    vapiInstance.on('volume-level', onVolumeLevel);
  }
}

/**
 * Remove event listeners
 */
export function removeEventListeners() {
  if (!vapiInstance) {
    return;
  }

  // Vapi will clean up listeners when stopped
  vapiInstance.removeAllListeners();
}

/**
 * Send a message during an active call
 * @param {Object} message - Message to send to the assistant
 */
export function sendMessage(message) {
  if (!vapiInstance) {
    throw new Error('Vapi client not initialized.');
  }
  vapiInstance.send(message);
}

export default {
  initializeVapi,
  getVapiInstance,
  startCall,
  endCall,
  isCallActive,
  setMuted,
  isMuted,
  setupEventListeners,
  removeEventListeners,
  sendMessage,
};
