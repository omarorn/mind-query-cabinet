
/**
 * Text-to-Speech utility using OpenAI's TTS API
 */

// Voice options available from OpenAI
export type VoiceOption = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';

// Default voice to use
const DEFAULT_VOICE: VoiceOption = 'nova';

// Audio cache to avoid regenerating the same text
const audioCache: Map<string, HTMLAudioElement> = new Map();

// Currently playing audio element
let currentAudio: HTMLAudioElement | null = null;

/**
 * Generate speech from text and play it
 * @param text Text to convert to speech
 * @param voice Voice to use
 * @returns Promise resolving to true if successful
 */
export const speakText = async (
  text: string, 
  voice: VoiceOption = DEFAULT_VOICE
): Promise<boolean> => {
  try {
    // Create a cache key based on text and voice
    const cacheKey = `${voice}:${text}`;
    
    // Check if we have this audio cached
    if (audioCache.has(cacheKey)) {
      stopSpeaking();
      const audio = audioCache.get(cacheKey)!;
      currentAudio = audio;
      await audio.play();
      return true;
    }
    
    // For now, we'll use the browser's built-in TTS
    // This will be replaced with OpenAI's TTS API integration later
    if ('speechSynthesis' in window) {
      stopSpeaking();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'is-IS'; // Set language to Icelandic
      
      window.speechSynthesis.speak(utterance);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error generating speech:', error);
    return false;
  }
};

/**
 * Stop any currently playing speech
 */
export const stopSpeaking = (): void => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
};

/**
 * Check if speech is currently playing
 * @returns Boolean indicating if speech is playing
 */
export const isSpeaking = (): boolean => {
  if ('speechSynthesis' in window) {
    return window.speechSynthesis.speaking;
  }
  
  return currentAudio !== null && !currentAudio.paused;
};
