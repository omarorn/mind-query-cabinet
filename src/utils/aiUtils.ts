
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
    
    console.log("Sending prompt to Gemini:", icelandicPrompt);
    
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
    
    // Improved parsing with more robust section detection
    const sections = generatedText.split(/\n\s*\n/); // Split by empty lines
    
    for (const section of sections) {
      const lines = section.split('\n').map(line => line.trim()).filter(line => line);
      
      for (const line of lines) {
        const lowerLine = line.toLowerCase();
        
        if (lowerLine.match(/^titill:?\s/i)) {
          title = line.replace(/^titill:?\s/i, "").trim();
        } 
        else if (lowerLine.match(/^spurning:?\s/i)) {
          content = line.replace(/^spurning:?\s/i, "").trim();
          // Collect additional lines for content if they don't match other section headers
          let i = lines.indexOf(line) + 1;
          while (i < lines.length && 
                !lines[i].toLowerCase().match(/^(titill|heimild|mynd|source|image|link|tengill):?\s/i)) {
            content += "\n" + lines[i];
            i++;
          }
        } 
        else if (lowerLine.match(/^(heimild|source|link|tengill):?\s/i)) {
          source = line.replace(/^(heimild|source|link|tengill):?\s/i, "").trim();
        } 
        else if (lowerLine.match(/^(mynd|picture|image):?\s/i)) {
          imageUrl = line.replace(/^(mynd|picture|image):?\s/i, "").trim();
          // Clean up common formatting issues in image URLs
          imageUrl = imageUrl.replace(/["\[\]]/g, "").trim();
        } 
      }
    }
    
    // If parsing fails, try to extract content intelligently
    if (!title || !content) {
      console.log("Using fallback parsing for AI response");
      
      // Look for the first line as title if not found
      if (!title) {
        const firstLine = generatedText.split('\n')[0].trim();
        if (firstLine && !firstLine.toLowerCase().includes("titill:")) {
          title = firstLine;
        } else {
          // Extract anything after "titill:" in the text if present
          const titleMatch = generatedText.match(/titill:?\s*(.*?)(?:\n|$)/i);
          if (titleMatch && titleMatch[1]) {
            title = titleMatch[1].trim();
          }
        }
      }
      
      // If still no title, use a generic one
      if (!title) {
        title = "Spurning frá gervigreind";
      }
      
      // For content, take everything except the first line if we used it as title
      if (!content) {
        if (title !== generatedText.split('\n')[0].trim()) {
          content = generatedText;
        } else {
          content = generatedText.split('\n').slice(1).join('\n').trim();
        }
        
        // If content still contains "Titill:", remove that section
        if (content.match(/titill:?\s/i)) {
          content = content.replace(/titill:?\s.*?(\n|$)/i, "").trim();
        }
      }
    }
    
    // Try to extract source if not already found
    if (!source) {
      const sourceMatch = generatedText.match(/(?:heimild|source|link|tengill):?\s*(.*?)(?:\n|$)/i);
      if (sourceMatch && sourceMatch[1]) {
        source = sourceMatch[1].trim();
      }
    }
    
    // Try to extract image URL if not already found
    if (!imageUrl || imageUrl.length < 5) {
      const imageMatch = generatedText.match(/(?:mynd|picture|image):?\s*(.*?)(?:\n|$)/i);
      if (imageMatch && imageMatch[1]) {
        imageUrl = imageMatch[1].trim().replace(/["\[\]]/g, "");
      } else {
        // Default image if none is provided
        imageUrl = 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3';
      }
    }
    
    console.log("Parsed AI response:", {
      title: title || "No title parsed",
      content: content || "No content parsed",
      source: source || "No source parsed",
      imageUrl: imageUrl || "No image parsed"
    });
    
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

    console.log("Sending answer prompt to Gemini:", prompt);

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
    console.log("Generated AI answer:", generatedText);
    return generatedText.trim();
  } catch (error) {
    console.error('Villa við að búa til svar með gervigreind:', error);
    return null;
  }
};

