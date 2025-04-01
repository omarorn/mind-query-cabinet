
/**
 * Test utility functions for verifying application functionality
 */

import { Question, Answer } from "@/types/qa";

/**
 * Test parsing of AI-generated questions
 * @param text The raw text from AI
 * @returns Parsed question components or error message
 */
export const testAIQuestionParsing = (text: string): { 
  success: boolean;
  title?: string;
  content?: string;
  source?: string;
  imageUrl?: string;
  error?: string
} => {
  try {
    // Parse the response with clear section separation
    let title = "";
    let content = "";
    let source = "";
    let imageUrl = "";
    
    // Improved parsing with more robust section detection
    const sections = text.split(/\n\s*\n/); // Split by empty lines
    
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
    if (!title && !content) {
      // Look for the first line as title if not found
      if (!title) {
        const firstLine = text.split('\n')[0].trim();
        if (firstLine && !firstLine.toLowerCase().includes("titill:")) {
          title = firstLine;
        } else {
          // Extract anything after "titill:" in the text if present
          const titleMatch = text.match(/titill:?\s*(.*?)(?:\n|$)/i);
          if (titleMatch && titleMatch[1]) {
            title = titleMatch[1].trim();
          }
        }
      }
      
      // For content, take everything except the first line if we used it as title
      if (!content) {
        if (title !== text.split('\n')[0].trim()) {
          content = text;
        } else {
          content = text.split('\n').slice(1).join('\n').trim();
        }
        
        // If content still contains "Titill:", remove that section
        if (content.match(/titill:?\s/i)) {
          content = content.replace(/titill:?\s.*?(\n|$)/i, "").trim();
        }
      }
    }
    
    // Try to extract source if not already found
    if (!source) {
      const sourceMatch = text.match(/(?:heimild|source|link|tengill):?\s*(.*?)(?:\n|$)/i);
      if (sourceMatch && sourceMatch[1]) {
        source = sourceMatch[1].trim();
      }
    }
    
    // Try to extract image URL if not already found
    if (!imageUrl) {
      const imageMatch = text.match(/(?:mynd|picture|image):?\s*(.*?)(?:\n|$)/i);
      if (imageMatch && imageMatch[1]) {
        imageUrl = imageMatch[1].trim().replace(/["\[\]]/g, "");
      }
    }
    
    return {
      success: !!(title && content),
      title: title || undefined,
      content: content || undefined,
      source: source || undefined,
      imageUrl: imageUrl || undefined
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error in AI parsing'
    };
  }
};

/**
 * Validate a question object
 * @param question The question to validate
 * @returns Validation result
 */
export const validateQuestion = (question: Question): { 
  valid: boolean; 
  issues: string[] 
} => {
  const issues: string[] = [];
  
  if (!question.id) issues.push('Missing question ID');
  if (!question.title || question.title.trim().length === 0) issues.push('Missing question title');
  if (!question.content || question.content.trim().length === 0) issues.push('Missing question content');
  if (!question.authorId) issues.push('Missing author ID');
  if (!question.authorName) issues.push('Missing author name');
  if (!question.createdAt) issues.push('Missing creation date');
  
  // Check if imageUrl is a valid URL if present
  if (question.imageUrl) {
    try {
      new URL(question.imageUrl);
    } catch (e) {
      issues.push('Invalid image URL format');
    }
  }
  
  // Check if source is a valid URL if present
  if (question.source) {
    try {
      new URL(question.source.startsWith('http') ? question.source : `https://${question.source}`);
    } catch (e) {
      issues.push('Invalid source URL format');
    }
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
};

/**
 * Validate an answer object
 * @param answer The answer to validate
 * @returns Validation result
 */
export const validateAnswer = (answer: Answer): { 
  valid: boolean; 
  issues: string[] 
} => {
  const issues: string[] = [];
  
  if (!answer.id) issues.push('Missing answer ID');
  if (!answer.questionId) issues.push('Missing question ID');
  if (!answer.content || answer.content.trim().length === 0) issues.push('Missing answer content');
  if (!answer.authorId) issues.push('Missing author ID');
  if (!answer.authorName) issues.push('Missing author name');
  if (!answer.createdAt) issues.push('Missing creation date');
  
  return {
    valid: issues.length === 0,
    issues
  };
};

/**
 * Test function to measure component rendering performance
 * @param componentName Name of the component
 * @param callback Function to execute and measure
 * @returns Execution time in milliseconds
 */
export const measureRenderTime = (componentName: string, callback: () => void): number => {
  console.log(`Starting render test for ${componentName}...`);
  const start = performance.now();
  callback();
  const end = performance.now();
  const executionTime = end - start;
  console.log(`${componentName} render time: ${executionTime.toFixed(2)}ms`);
  return executionTime;
};

/**
 * Log a test result
 * @param testName Name of the test
 * @param success Whether the test passed
 * @param message Optional message with details
 */
export const logTestResult = (testName: string, success: boolean, message?: string): void => {
  if (success) {
    console.log(`✅ Test passed: ${testName}`);
    if (message) console.log(`   ${message}`);
  } else {
    console.error(`❌ Test failed: ${testName}`);
    if (message) console.error(`   ${message}`);
  }
};

/**
 * Test the end-to-end AI question generation flow
 */
export const testAIQuestionGeneration = async (): Promise<boolean> => {
  try {
    const { generateQuestionWithAI } = await import('./aiUtils');
    const result = await generateQuestionWithAI("Test question generation");
    
    if (!result) {
      logTestResult("AI Question Generation", false, "No result returned");
      return false;
    }
    
    const { title, content } = result;
    
    if (!title || !content) {
      logTestResult("AI Question Generation", false, 
        `Incomplete result: title=${title ? "OK" : "Missing"}, content=${content ? "OK" : "Missing"}`);
      return false;
    }
    
    logTestResult("AI Question Generation", true, "Successfully generated a valid question");
    return true;
  } catch (error) {
    logTestResult("AI Question Generation", false, error instanceof Error ? error.message : "Unknown error");
    return false;
  }
};
