
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
    
    // Use Icelandic in the prompt and instruct AI to format properly
    const icelandicPrompt = 
      `${prompt} á íslensku. Bættu við heimild (tilbúin er í lagi) og stingdu upp á mynd sem myndi passa vel við þessa spurningu. 
      Svörun þín ætti að vera á eftirfarandi formi:
      
      Titill: [Spurningatitill]
      
      Spurning: [Efni spurningar]
      
      Heimild: [Heimild]
      
      Mynd: [Mynd-tengill]
      
      Hafðu titilinn stuttan og hnitmiðaðan. Spurningin ætti að vera ítarlegri.`;
    
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
    console.log("Generated AI text:", generatedText);
    
    // Parse the response with clear section separation
    let title = "";
    let content = "";
    let source = "";
    let imageUrl = "";
    
    // Better parsing with clear section detection
    const lines = generatedText.split('\n').map(line => line.trim()).filter(line => line);
    let currentSection = "";
    
    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      
      if (lowerLine.startsWith('titill:')) {
        currentSection = "title";
        title = line.substring(line.indexOf(':') + 1).trim();
      } 
      else if (lowerLine.startsWith('spurning:')) {
        currentSection = "content";
        content = line.substring(line.indexOf(':') + 1).trim();
      } 
      else if (lowerLine.startsWith('heimild:') || lowerLine.startsWith('link:') || lowerLine.startsWith('tengill:')) {
        currentSection = "source";
        source = line.substring(line.indexOf(':') + 1).trim();
      } 
      else if (lowerLine.startsWith('mynd:') || lowerLine.startsWith('picture:') || lowerLine.startsWith('image:')) {
        currentSection = "image";
        imageUrl = line.substring(line.indexOf(':') + 1).trim();
      } 
      else {
        // Append to the current section
        if (currentSection === "title") {
          title += " " + line;
        } else if (currentSection === "content") {
          content += "\n" + line;
        } else if (currentSection === "source") {
          source += " " + line;
        } else if (currentSection === "image") {
          imageUrl += " " + line;
        }
      }
    }
    
    // If no clear sections were detected, try a fallback approach
    if (!title && !content) {
      console.log("Using fallback parsing for AI response");
      
      // Look for the first bold text as title
      const boldMatch = generatedText.match(/\*\*(.*?)\*\*/);
      if (boldMatch) {
        title = boldMatch[1].trim();
        content = generatedText.replace(/\*\*.*?\*\*/, "").trim();
      } else {
        // Just take the first line as title and the rest as content
        const allLines = generatedText.split('\n').filter(line => line.trim());
        if (allLines.length > 0) {
          title = allLines[0].trim();
          content = allLines.slice(1).join('\n').trim();
        }
      }
    }
    
    // Default image if none is provided
    if (!imageUrl || imageUrl.length < 5) {
      imageUrl = 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3';
    }
    
    return { 
      title: title.trim() || "Spurning frá gervigreind", 
      content: content.trim() || "Hvað eru þínar hugsanir um þetta efni?",
      source: source.trim() || undefined,
      imageUrl: imageUrl.trim() || undefined
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
