import { writable } from 'svelte/store';

// Mobile menu state
export const mobileMenuOpen = writable(false);

// Active pricing service tab
export const activeService = writable('medspa');

// Form submission states
export const formSubmitting = writable(false);
export const formSuccess = writable(false);
export const formError = writable(null);

// Scroll position for header styling
export const scrollY = writable(0);

// Chatbot state
export const chatbotOpen = writable(false);
export const chatbotMessages = writable([
  {
    id: 'welcome',
    text: 'Hi! I\'m Pharens AI Assistant. I can help you with beauty marketing strategies, services, and answer any questions about growing your beauty business. How can I assist you today?',
    isBot: true,
    timestamp: new Date()
  }
]);
export const chatbotLoading = writable(false);

// Functions to manage state
export function toggleMobileMenu() {
  mobileMenuOpen.update(open => !open);
}

export function closeMobileMenu() {
  mobileMenuOpen.set(false);
}

export function setActiveService(service) {
  activeService.set(service);
}

export function resetFormState() {
  formSubmitting.set(false);
  formSuccess.set(false);
  formError.set(null);
}

export function toggleChatbot() {
  chatbotOpen.update(open => !open);
}

export function closeChatbot() {
  chatbotOpen.set(false);
}

export function addChatMessage(message) {
  chatbotMessages.update(messages => [...messages, message]);
}

export function setChatbotLoading(loading) {
  chatbotLoading.set(loading);
}
