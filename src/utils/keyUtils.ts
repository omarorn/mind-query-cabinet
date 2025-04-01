
// Utility to safely store and retrieve API keys
// Note: In production, API keys should be stored on the server, not in the client

// Local storage key
const GEMINI_KEY_STORAGE = "lovable_gemini_key";

export const storeGeminiKey = (key: string): void => {
  if (!key) return;
  localStorage.setItem(GEMINI_KEY_STORAGE, key);
};

export const getGeminiKey = (): string | null => {
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (envKey) return envKey;
  
  return localStorage.getItem(GEMINI_KEY_STORAGE);
};

export const clearGeminiKey = (): void => {
  localStorage.removeItem(GEMINI_KEY_STORAGE);
};

export const hasGeminiKey = (): boolean => {
  return !!getGeminiKey();
};
