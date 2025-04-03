
import { getGeminiKey, storeGeminiKey } from "./keyUtils";

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

/**
 * Attempts to fetch the Gemini API key from Supabase Edge Function
 */
async function fetchGeminiKeyFromEdge(): Promise<string | null> {
  try {
    console.log('Attempting to fetch Gemini API key from edge function...');
    const response = await fetch('/api/get-gemini-key', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error fetching Gemini API key:', errorData);
      return null;
    }

    const data = await response.json();
    if (data.key) {
      // Store the key locally for future use
      storeGeminiKey(data.key);
      return data.key;
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch Gemini API key:', error);
    return null;
  }
}

/**
 * Makes a request to the Gemini API with the given prompt
 */
export const callGeminiAPI = async (prompt: string): Promise<string> => {
  // Always try to fetch from edge function first before using local storage
  let apiKey = await fetchGeminiKeyFromEdge();
  
  // If the edge function didn't return a key, try to get one from local storage
  if (!apiKey) {
    apiKey = getGeminiKey();
  }
  
  if (!apiKey) {
    console.error('Gemini API lykill vantar');
    throw new Error('API lykil vantar. Vinsamlegast settu inn Gemini API lykilinn þinn í stillingum.');
  }
  
  console.log("Sending prompt to Gemini:", prompt);
  
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Gemini API villa:', errorData);
    throw new Error(`API kall mistókst: ${response.status} - ${errorData.error?.message || 'Óþekkt villa'}`);
  }

  const data: GeminiResponse = await response.json();
  
  if (!data.candidates || data.candidates.length === 0) {
    throw new Error('Ekkert svar frá gervigreind');
  }
  
  const generatedText = data.candidates[0].content.parts[0].text;
  return generatedText.trim();
};
