
import { callGeminiAPI } from "./geminiAPI";

export const simplifyForChildren = async (text: string): Promise<string | null> => {
  try {
    const prompt = `
      Rewrite the following text so that a 7-year-old can understand it.
      Use simple words, short sentences, and fun explanations.
      Avoid complex terms and add examples that children can relate to.
      
      Text: ${text}
    `;
    
    console.log("Sending simplification prompt to Gemini:", prompt);
    
    const simplifiedText = await callGeminiAPI(prompt);
    console.log("Simplified text:", simplifiedText);
    
    return simplifiedText;
  } catch (error) {
    console.error('Villa við að einfalda texta fyrir börn:', error);
    return null;
  }
};

export const factCheckAnswer = async (question: string, answer: string): Promise<string | null> => {
  try {
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
    
    const factCheck = await callGeminiAPI(prompt);
    console.log("Fact check result:", factCheck);
    
    return factCheck;
  } catch (error) {
    console.error('Villa við að framkvæma staðreyndakönnun:', error);
    return null;
  }
};
