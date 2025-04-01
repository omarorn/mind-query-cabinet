
import { callGeminiAPI } from "./geminiAPI";

export const simplifyForChildren = async (text: string): Promise<string | null> => {
  try {
    const prompt = `
      Endurskrifaðu eftirfarandi texta þannig að 7 ára barn skilji hann.
      Notaðu einföld orð, stuttar setningar og skemmtilegar útskýringar.
      Bættu við dæmum sem börn geta tengt við og forðastu flókin hugtök.
      Skrifaðu á íslensku með skemmtilegum og barnvænum tón.
      
      Texti: ${text}
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
      Staðreyndaprófaðu eftirfarandi svar við gefna spurningu.
      Vertu nákvæmur og bentu á allar ónákvæmni eða villandi upplýsingar.
      Ef svarið er rétt, staðfestu að upplýsingarnar séu réttar.
      
      Spurning: ${question}
      Svar: ${answer}
      
      Hafðu svarið á forminu:
      "Staðreyndakönnun: [Þín ítarlega staðreyndakönnun]"
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
