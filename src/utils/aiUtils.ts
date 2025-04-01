
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

export const generateQuestionWithAI = async (prompt: string = "Generate an interesting question for a Q&A platform"): Promise<{ title: string; content: string; source?: string; imageUrl?: string } | null> => {
  try {
    // Get the API key from storage
    const apiKey = getGeminiKey();
    
    if (!apiKey) {
      console.error('Gemini API key is missing');
      throw new Error('API key is missing. Please add your Gemini API key in the settings.');
    }
    
    // Include Icelandic language in the prompt
    const icelandicPrompt = `${prompt} in Icelandic. Also include a source link (fictional is fine) and suggest an image that would go well with this question.`;
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: icelandicPrompt }]
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
    
    // Parse the response to extract a title, content, source, and image
    const lines = generatedText.split('\n').filter(line => line.trim());
    
    // Use the first line as the title and extract the rest
    const title = lines[0].replace(/^(question:|q:|title:)/i, '').trim();
    
    // Look for source and image in the response
    let content = '';
    let source = '';
    let imageUrl = '';
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      if (line.includes('source:') || line.includes('heimild:') || line.includes('link:') || line.includes('tengill:')) {
        source = lines[i].split(':').slice(1).join(':').trim();
      } else if (line.includes('image:') || line.includes('mynd:') || line.includes('picture:')) {
        imageUrl = lines[i].split(':').slice(1).join(':').trim();
        // Default image if none is provided
        if (!imageUrl || imageUrl.length < 5) {
          imageUrl = 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3';
        }
      } else {
        content += lines[i] + '\n';
      }
    }
    
    return { 
      title: title || "AI Generated Question", 
      content: content.trim() || "Hvað eru þínar hugsanir um þetta efni?",
      source,
      imageUrl
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
