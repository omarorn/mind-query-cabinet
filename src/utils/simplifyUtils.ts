
import { getGeminiKey } from "./keyUtils";

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export const simplifyForChildren = async (text: string): Promise<string | null> => {
  try {
    const apiKey = getGeminiKey();
    
    if (!apiKey) {
      console.error('Gemini API lykill vantar');
      throw new Error('API lykil vantar. Vinsamlegast settu inn Gemini API lykilinn þinn í stillingum.');
    }
    
    const prompt = `
      Rewrite the following text so that a 7-year-old can understand it.
      Use simple words, short sentences, and fun explanations.
      Avoid complex terms and add examples that children can relate to.
      
      Text: ${text}
    `;
    
    console.log("Sending simplification prompt to Gemini:", prompt);
    
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
    
    const simplifiedText = data.candidates[0].content.parts[0].text;
    console.log("Simplified text:", simplifiedText);
    
    return simplifiedText.trim();
  } catch (error) {
    console.error('Villa við að einfalda texta fyrir börn:', error);
    return null;
  }
};

export const factCheckAnswer = async (question: string, answer: string): Promise<string | null> => {
  try {
    const apiKey = getGeminiKey();
    
    if (!apiKey) {
      console.error('Gemini API lykill vantar');
      throw new Error('API lykil vantar. Vinsamlegast settu inn Gemini API lykilinn þinn í stillingum.');
    }
    
    const prompt = `
      Fact check the following answer to the given question.
      Be thorough and point out any inaccuracies or misleading information.
      If the answer is correct, confirm that the information is accurate.
      
      Question: ${question}
      Answer: ${answer}
      
      Format your response as:
      "Fact check: [Your detailed fact check]"
    `;
    
    console.log("Sending fact-check prompt to Gemini:", prompt);
    
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
    
    const factCheck = data.candidates[0].content.parts[0].text;
    console.log("Fact check result:", factCheck);
    
    return factCheck.trim();
  } catch (error) {
    console.error('Villa við að framkvæma staðreyndakönnun:', error);
    return null;
  }
};
