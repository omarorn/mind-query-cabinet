
import { getGeminiKey } from "./keyUtils";

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
 * Makes a request to the Gemini API with the given prompt
 */
export const callGeminiAPI = async (prompt: string): Promise<string> => {
  const apiKey = getGeminiKey();
  
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
