
import { Question, Answer } from "@/types/qa";
import { v4 as uuidv4 } from "uuid";

/**
 * Generate sample questions for testing and initial setup
 * @param authorId The ID of the author to use
 * @param authorName The name of the author to use
 * @returns Array of sample questions
 */
export const generateSampleQuestions = (authorId: string, authorName: string): Question[] => {
  // Return an empty array instead of sample data
  return [];
};

/**
 * Generate sample answers for the sample questions
 * @param authorId The ID of the author to use
 * @param authorName The name of the author to use
 * @param questions The questions to generate answers for
 * @returns Array of sample answers
 */
export const generateSampleAnswers = (
  authorId: string, 
  authorName: string, 
  questions: Question[]
): Answer[] => {
  // Return an empty array instead of sample data
  return [];
};

/**
 * Add sample data to the application
 * @param addQuestionFn Function to add a question
 * @param addAnswerFn Function to add an answer
 * @param userId The ID of the current user
 * @param userName The name of the current user
 */
export const populateSampleData = (
  addQuestionFn: (
    title: string,
    content: string,
    article?: string,
    attachment?: {
      type: 'file' | 'video' | 'link';
      url: string;
      name?: string;
    } | null,
    source?: string,
    imageUrl?: string,
    category?: string
  ) => void,
  addAnswerFn: (questionId: string, content: string) => void,
  userId: string,
  userName: string
) => {
  // Do nothing - no sample data will be added
  console.log('Sample data population skipped - production mode');
};
