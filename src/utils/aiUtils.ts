
// Re-export from new utility files
export { generateQuestionWithAI } from './questionGenerator';
export { generateAnswerWithAI } from './answerGenerator';
export { factCheckAnswer, simplifyForChildren } from './simplifyUtils';

// Export the Gemini API types and functions for direct access if needed
export { callGeminiAPI, type GeminiResponse } from './geminiAPI';
