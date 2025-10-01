<script>
  import { chatbotOpen, chatbotMessages, chatbotLoading, toggleChatbot, closeChatbot, addChatMessage, setChatbotLoading } from '$lib/stores/ui.js';
  import { v4 as uuidv4 } from 'uuid';
  import { trackChatbotInteraction } from '$lib/utils/analytics.js';
  
  let messageInput = '';
  let chatContainer;

  async function sendMessage() {
    if (!messageInput.trim()) return;

    const userMessage = {
      id: uuidv4(),
      text: messageInput,
      isBot: false,
      timestamp: new Date()
    };

    addChatMessage(userMessage);
    trackChatbotInteraction('send_message');
    messageInput = '';
    setChatbotLoading(true);
    
    // Scroll to bottom
    setTimeout(() => {
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 100);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.text,
          conversationHistory: $chatbotMessages.filter(m => m.id !== 'welcome').slice(-5)
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        const botMessage = {
          id: uuidv4(),
          text: data.response,
          isBot: true,
          timestamp: new Date()
        };
        addChatMessage(botMessage);
      } else {
        const errorMessage = {
          id: uuidv4(),
          text: 'Sorry, I encountered an error. Please try again.',
          isBot: true,
          timestamp: new Date()
        };
        addChatMessage(errorMessage);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: uuidv4(),
        text: 'Sorry, I\'m having trouble connecting. Please try again.',
        isBot: true,
        timestamp: new Date()
      };
      addChatMessage(errorMessage);
    } finally {
      setChatbotLoading(false);
      // Scroll to bottom after response
      setTimeout(() => {
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      }, 100);
    }
  }

  function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  function formatTime(timestamp) {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Auto-scroll when messages update
  $: if ($chatbotMessages && chatContainer) {
    setTimeout(() => {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 100);
  }
</script>

<!-- Floating Chat Button -->
{#if !$chatbotOpen}
  <button
    on:click={() => {
      toggleChatbot();
      trackChatbotInteraction('open');
    }}
    class="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-primary to-secondary-dark text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
    aria-label="Open chat"
  >
    <svg class="w-6 h-6 transform group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
    </svg>
    <div class="absolute -top-2 -right-2 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
  </button>
{/if}

<!-- Chat Widget -->
{#if $chatbotOpen}
  <div class="fixed bottom-6 right-6 z-50 w-96 h-[32rem] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-fade-in">
    <!-- Header -->
    <div class="bg-gradient-to-r from-primary to-secondary-dark text-white p-4 flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <div>
          <h3 class="font-semibold text-sm">Pharens AI Assistant</h3>
          <p class="text-xs text-white/80">Beauty Marketing Expert</p>
        </div>
      </div>
      <button
        on:click={() => {
          closeChatbot();
          trackChatbotInteraction('close');
        }}
        class="text-white/80 hover:text-white transition-colors p-1"
        aria-label="Close chat"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>

    <!-- Messages -->
    <div
      bind:this={chatContainer}
      class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
    >
      {#each $chatbotMessages as message (message.id)}
        <div class="flex {message.isBot ? 'justify-start' : 'justify-end'}">
          <div class="flex items-end space-x-2 max-w-[80%] {message.isBot ? 'flex-row' : 'flex-row-reverse space-x-reverse'}">
            <!-- Avatar -->
            <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 {message.isBot ? 'bg-primary text-white' : 'bg-gray-300 text-gray-600'}">
              {#if message.isBot}
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              {:else}
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              {/if}
            </div>
            
            <!-- Message Bubble -->
            <div class="rounded-2xl px-4 py-3 {message.isBot ? 'bg-white border border-gray-200 text-gray-800' : 'bg-primary text-white'}">
              <p class="text-sm leading-relaxed">{message.text}</p>
              <p class="text-xs opacity-60 mt-1">{formatTime(message.timestamp)}</p>
            </div>
          </div>
        </div>
      {/each}
      
      {#if $chatbotLoading}
        <div class="flex justify-start">
          <div class="flex items-end space-x-2 max-w-[80%]">
            <div class="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <div class="bg-white border border-gray-200 rounded-2xl px-4 py-3">
              <div class="flex space-x-1">
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
              </div>
            </div>
          </div>
        </div>
      {/if}
    </div>

    <!-- Input -->
    <div class="border-t border-gray-200 p-4">
      <div class="flex space-x-2">
        <input
          bind:value={messageInput}
          on:keypress={handleKeyPress}
          placeholder="Ask about beauty marketing strategies..."
          class="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          disabled={$chatbotLoading}
        />
        <button
          on:click={sendMessage}
          disabled={!messageInput.trim() || $chatbotLoading}
          class="bg-primary text-white p-2 rounded-lg hover:bg-secondary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(10px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .animate-fade-in {
    animation: fade-in 0.3s ease-out;
  }
</style>