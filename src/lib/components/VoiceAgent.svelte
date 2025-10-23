<script>
  import { onMount, onDestroy } from 'svelte';
  import {
    voiceCallActive,
    voiceCallStatus,
    voiceCallDuration,
    voiceCallMuted,
    voiceCallError,
    setCallActive,
    setCallStatus,
    setCallDuration,
    setCallMuted,
    setCallError,
    resetCallState
  } from '$lib/stores/ui.js';
  import {
    initializeVapi,
    startCall,
    endCall,
    setMuted as vapiSetMuted,
    setupEventListeners,
    removeEventListeners
  } from '$lib/utils/vapi.js';
  import { PUBLIC_VAPI_PUBLIC_KEY, PUBLIC_VAPI_ASSISTANT_ID } from '$env/static/public';

  let durationInterval = null;
  let isSpeaking = false;
  let volumeLevel = 0;

  onMount(() => {
    // Initialize Vapi client
    try {
      initializeVapi(PUBLIC_VAPI_PUBLIC_KEY);
      setupVapiEventListeners();
    } catch (error) {
      console.error('Failed to initialize Vapi:', error);
      setCallError('Failed to initialize voice service. Please check your configuration.');
    }
  });

  onDestroy(() => {
    // Clean up
    if ($voiceCallActive) {
      handleEndCall();
    }
    removeEventListeners();
    if (durationInterval) {
      clearInterval(durationInterval);
    }
  });

  function setupVapiEventListeners() {
    setupEventListeners({
      onCallStart: () => {
        console.log('Call started');
        setCallActive(true);
        setCallStatus('active');
        setCallError(null);
        startDurationTimer();
      },
      onCallEnd: () => {
        console.log('Call ended');
        handleCallEnd();
      },
      onSpeechStart: () => {
        console.log('User started speaking');
        isSpeaking = true;
      },
      onSpeechEnd: () => {
        console.log('User stopped speaking');
        isSpeaking = false;
      },
      onMessage: (message) => {
        console.log('Message received:', message);
      },
      onError: (error) => {
        console.error('Vapi error:', error);
        setCallError(error.message || 'An error occurred during the call');
        handleCallEnd();
      },
      onVolumeLevel: (level) => {
        volumeLevel = level;
      }
    });
  }

  async function handleStartCall() {
    try {
      setCallStatus('connecting');
      setCallError(null);

      await startCall(PUBLIC_VAPI_ASSISTANT_ID, {
        // You can pass additional options here
        // e.g., custom metadata, initial messages, etc.
      });

      // The actual status change will happen in the onCallStart event
    } catch (error) {
      console.error('Failed to start call:', error);
      setCallError('Failed to start call. Please try again.');
      setCallStatus('idle');
    }
  }

  function handleEndCall() {
    try {
      setCallStatus('ending');
      endCall();
      // The actual cleanup will happen in the onCallEnd event
    } catch (error) {
      console.error('Failed to end call:', error);
      handleCallEnd(); // Force cleanup
    }
  }

  function handleCallEnd() {
    if (durationInterval) {
      clearInterval(durationInterval);
      durationInterval = null;
    }
    resetCallState();
    isSpeaking = false;
    volumeLevel = 0;
  }

  function handleToggleMute() {
    const newMutedState = !$voiceCallMuted;
    vapiSetMuted(newMutedState);
    setCallMuted(newMutedState);
  }

  function startDurationTimer() {
    setCallDuration(0);
    durationInterval = setInterval(() => {
      setCallDuration($voiceCallDuration + 1);
    }, 1000);
  }

  function formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  function getStatusText() {
    switch ($voiceCallStatus) {
      case 'connecting':
        return 'Connecting...';
      case 'active':
        return 'Connected';
      case 'ending':
        return 'Ending call...';
      default:
        return 'Start Voice Call';
    }
  }

  function getStatusColor() {
    switch ($voiceCallStatus) {
      case 'connecting':
        return 'bg-yellow-500';
      case 'active':
        return 'bg-green-500';
      case 'ending':
        return 'bg-red-500';
      default:
        return 'bg-primary';
    }
  }
</script>

<div class="voice-agent-container">
  {#if $voiceCallError}
    <div class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
      <p class="text-red-700 text-sm">{$voiceCallError}</p>
    </div>
  {/if}

  {#if !$voiceCallActive && $voiceCallStatus === 'idle'}
    <!-- Start Call Button -->
    <button
      on:click={handleStartCall}
      class="w-full btn-primary flex items-center justify-center gap-3 text-lg"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
      </svg>
      Talk to Our AI Agent
    </button>
    <p class="mt-3 text-sm text-gray-600 text-center">
      Available 24/7 to answer questions and help with bookings
    </p>
  {:else if $voiceCallStatus === 'connecting'}
    <!-- Connecting State -->
    <div class="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
      <div class="relative">
        <div class="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
          </svg>
        </div>
      </div>
      <p class="mt-4 text-lg font-bold text-gray-900">{getStatusText()}</p>
      <p class="text-sm text-gray-600">Please wait while we connect you...</p>
    </div>
  {:else if $voiceCallActive}
    <!-- Active Call Interface -->
    <div class="flex flex-col items-center p-8 bg-gradient-to-br from-primary/5 to-secondary-light/5 rounded-lg border-2 border-primary">
      <!-- Status Indicator -->
      <div class="flex items-center gap-3 mb-6">
        <div class="relative">
          <div class="{getStatusColor()} w-4 h-4 rounded-full"></div>
          <div class="{getStatusColor()} w-4 h-4 rounded-full absolute inset-0 animate-ping opacity-75"></div>
        </div>
        <span class="text-lg font-bold text-gray-900">{getStatusText()}</span>
      </div>

      <!-- AI Agent Avatar -->
      <div class="relative mb-6">
        <div class="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
          <svg class="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        {#if isSpeaking}
          <div class="absolute inset-0 border-4 border-primary rounded-full animate-pulse"></div>
        {/if}
      </div>

      <!-- Call Duration -->
      <div class="text-3xl font-bold text-gray-900 font-mono mb-8">
        {formatDuration($voiceCallDuration)}
      </div>

      <!-- Call Controls -->
      <div class="flex items-center gap-4">
        <!-- Mute Button -->
        <button
          on:click={handleToggleMute}
          class="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300"
          class:bg-gray-200={!$voiceCallMuted}
          class:hover:bg-gray-300={!$voiceCallMuted}
          class:bg-red-500={$voiceCallMuted}
          class:hover:bg-red-600={$voiceCallMuted}
          title={$voiceCallMuted ? 'Unmute' : 'Mute'}
        >
          {#if $voiceCallMuted}
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clip-rule="evenodd"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path>
            </svg>
          {:else}
            <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
            </svg>
          {/if}
        </button>

        <!-- End Call Button -->
        <button
          on:click={handleEndCall}
          class="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl"
          title="End Call"
        >
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z"></path>
          </svg>
        </button>
      </div>

      <p class="mt-6 text-sm text-gray-600 text-center">
        Speak naturally. Our AI agent is listening and ready to help.
      </p>
    </div>
  {/if}
</div>

<style>
  .voice-agent-container {
    max-width: 100%;
  }

  @keyframes pulse-ring {
    0% {
      transform: scale(0.95);
      opacity: 1;
    }
    50% {
      transform: scale(1.05);
      opacity: 0.7;
    }
    100% {
      transform: scale(0.95);
      opacity: 1;
    }
  }

  .animate-pulse-ring {
    animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
</style>
