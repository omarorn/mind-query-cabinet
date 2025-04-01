
import { callGeminiAPI } from "./geminiAPI";

/**
 * Generates an answer to a question using AI
 */
export const generateAnswerWithAI = async (questionTitle: string, questionContent: string): Promise<string | null> => {
  try {
    const prompt = `Búðu til skemmtilegt og upplýsandi svar við þessari spurningu. Vertu skapandi en fræðandi. Skrifaðu á íslensku.
    
Titill spurningar: ${questionTitle}
Efni spurningar: ${questionContent}`;

    console.log("Sending answer prompt to Gemini:", prompt);
    
    const generatedText = await callGeminiAPI(prompt);
    console.log("Generated AI answer:", generatedText);
    return generatedText;
  } catch (error) {
    console.error('Villa við að búa til svar með gervigreind:', error);
    return null;
  }
};
