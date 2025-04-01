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

export const generateQuestionWithAI = async (prompt: string = "Búðu til áhugaverða spurningu fyrir spurningar og svör vettvang"): Promise<{ title: string; content: string; source?: string; imageUrl?: string } | null> => {
  try {
    // Get the API key from storage
    const apiKey = getGeminiKey();
    
    if (!apiKey) {
      console.error('Gemini API lykill vantar');
      throw new Error('API lykil vantar. Vinsamlegast settu inn Gemini API lykilinn þinn í stillingum.');
    }
    
    // Use Icelandic in the prompt
    const icelandicPrompt = `${prompt} á íslensku. Bættu við heimild (tilbúin er í lagi) og stingdu upp á mynd sem myndi passa vel við þessa spurningu.`;
    
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
      console.error('Gemini API villa:', errorData);
      throw new Error(`API kall mistókst: ${response.status} - ${errorData.error?.message || 'Óþekkt villa'}`);
    }

    const data: GeminiResponse = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('Ekkert svar frá gervigreind');
    }
    
    const generatedText = data.candidates[0].content.parts[0].text;
    
    // Parse the response to extract a title, content, source, and image
    const lines = generatedText.split('\n').filter(line => line.trim());
    
    // Use the first line as the title and extract the rest
    const title = lines[0].replace(/^(spurning:|sp:|titill:)/i, '').trim();
    
    // Look for source and image in the response
    let content = '';
    let source = '';
    let imageUrl = '';
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      if (line.includes('heimild:') || line.includes('link:') || line.includes('tengill:')) {
        source = lines[i].split(':').slice(1).join(':').trim();
      } else if (line.includes('mynd:') || line.includes('picture:') || line.includes('image:')) {
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
      title: title || "Spurning frá gervigreind", 
      content: content.trim() || "Hvað eru þínar hugsanir um þetta efni?",
      source,
      imageUrl
    };
  } catch (error) {
    console.error('Villa við að búa til spurningu með gervigreind:', error);
    return null;
  }
};

export const generateAnswerWithAI = async (questionTitle: string, questionContent: string): Promise<string | null> => {
  try {
    // Get the API key from storage
    const apiKey = getGeminiKey();
    
    if (!apiKey) {
      console.error('Gemini API lykill vantar');
      throw new Error('API lykil vantar. Vinsamlegast settu inn Gemini API lykilinn þinn í stillingum.');
    }
    
    const prompt = `Búðu til skemmtilegt og upplýsandi svar við þessari spurningu. Vertu skapandi en fræðandi. Skrifaðu á íslensku.
    
Titill spurningar: ${questionTitle}
Efni spurningar: ${questionContent}`;

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
  } catch (error) {
    console.error('Villa við að búa til svar með gervigreind:', error);
    return null;
  }
};
