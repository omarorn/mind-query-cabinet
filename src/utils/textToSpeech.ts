
/**
 * Text-to-Speech utility using OpenAI's TTS API
 */
import { createClient } from '@supabase/supabase-js';

// Voice options available from OpenAI
export type VoiceOption = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer' | 'coral';

// Default voice to use
const DEFAULT_VOICE: VoiceOption = 'nova';

// Audio cache to avoid regenerating the same text
const audioCache: Map<string, HTMLAudioElement> = new Map();

// Currently playing audio element
let currentAudio: HTMLAudioElement | null = null;

/**
 * Generate speech from text using OpenAI's TTS API via Edge Function
 * @param text Text to convert to speech
 * @param voice Voice to use
 * @returns Promise resolving to audio data URL
 */
async function generateSpeechFromOpenAI(text: string, voice: VoiceOption = DEFAULT_VOICE): Promise<string> {
  try {
    console.log(`Generating speech for text using OpenAI TTS API with voice: ${voice}`);
    
    const response = await fetch('/api/text-to-speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, voice }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error generating speech:', errorData);
      throw new Error(errorData.error || 'Failed to generate speech');
    }

    const data = await response.json();
    return `data:audio/mp3;base64,${data.audioContent}`;
  } catch (error) {
    console.error('Error calling text-to-speech API:', error);
    throw error;
  }
}

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
    
    try {
      // Try to use OpenAI's TTS API
      const audioDataUrl = await generateSpeechFromOpenAI(text, voice);
      stopSpeaking();
      
      // Create and play audio element with the generated speech
      const audio = new Audio(audioDataUrl);
      audioCache.set(cacheKey, audio);
      currentAudio = audio;
      await audio.play();
      return true;
    } catch (error) {
      // Fallback to browser's built-in TTS
      console.warn('Falling back to browser TTS:', error);
      if ('speechSynthesis' in window) {
        stopSpeaking();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'is-IS'; // Set language to Icelandic
        
        window.speechSynthesis.speak(utterance);
        return true;
      }
      
      throw new Error('Text-to-speech not available');
    }
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
  if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
    return true;
  }
  
  return currentAudio !== null && !currentAudio.paused;
};
