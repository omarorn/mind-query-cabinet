
interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

import { getGeminiKey } from "./keyUtils";

export const generateQuestionWithAI = async (prompt: string = "Generate an interesting question for a Q&A platform"): Promise<{ title: string; content: string } | null> => {
  try {
    // Get the API key from storage
    const apiKey = getGeminiKey();
    
    if (!apiKey) {
      console.error('Gemini API key is missing');
      throw new Error('API key is missing. Please add your Gemini API key in the settings.');
    }
    
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
      console.error('Gemini API error:', errorData);
      throw new Error(`API call failed: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data: GeminiResponse = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response from AI');
    }
    
    const generatedText = data.candidates[0].content.parts[0].text;
    
    // Parse the response to extract a title and content
    const lines = generatedText.split('\n').filter(line => line.trim());
    
    // Use the first line as the title and the rest as content
    const title = lines[0].replace(/^(question:|q:|title:)/i, '').trim();
    const content = lines.slice(1).join('\n').trim();
    
    return { 
      title: title || "AI Generated Question", 
      content: content || "What are your thoughts on this topic?" 
    };
  } catch (error) {
    console.error('Error generating question with AI:', error);
    return null;
  }
};

export const generateAnswerWithAI = async (questionTitle: string, questionContent: string): Promise<string | null> => {
  try {
    // Get the API key from storage
    const apiKey = getGeminiKey();
    
    if (!apiKey) {
      console.error('Gemini API key is missing');
      throw new Error('API key is missing. Please add your Gemini API key in the settings.');
    }
    
    const prompt = `Generate a witty, insightful answer to this question. Be creative but informative.
    
Question title: ${questionTitle}
Question content: ${questionContent}`;

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
      console.error('Gemini API error:', errorData);
      throw new Error(`API call failed: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data: GeminiResponse = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response from AI');
    }
    
    const generatedText = data.candidates[0].content.parts[0].text;
    return generatedText.trim();
  } catch (error) {
    console.error('Error generating answer with AI:', error);
    return null;
  }
};
