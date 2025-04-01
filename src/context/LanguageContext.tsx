import React, { createContext, useContext, useState } from 'react';

type DualTextValue = {
  en: string;
  is: string;
};

interface TextDictionary {
  [key: string]: DualTextValue;
}

interface LanguageContextType {
  language: 'en' | 'is';
  setLanguage: (lang: 'en' | 'is') => void;
  t: (key: string) => DualTextValue;
}

const dictionary: TextDictionary = {
  // Existing translations
  welcome: { en: 'Welcome', is: 'Velkomin' },
  tagline: { 
    en: 'Ask questions, get answers, share knowledge', 
    is: 'Spyrðu spurninga, fáðu svör, deildu þekkingu' 
  },
  getStarted: { en: 'Get Started', is: 'Komast af stað' },
  browseQuestions: { en: 'Browse Questions', is: 'Skoða spurningar' },
  recentQuestions: { en: 'Recent Questions', is: 'Nýlegar spurningar' },
  viewAll: { en: 'View All', is: 'Sjá allt' },
  howItWorks: { en: 'How It Works', is: 'Hvernig virkar það' },
  step1Title: { en: 'Create an Account', is: 'Búðu til reikning' },
  step1Desc: { 
    en: 'Provide your name to start contributing to the community', 
    is: 'Gefðu upp nafnið þitt til að byrja að leggja til samfélaginu' 
  },
  step2Title: { en: 'Contribute Content', is: 'Leggðu til efni' },
  step2Desc: { 
    en: 'Ask questions or answer existing ones to gain full access', 
    is: 'Spurðu spurninga eða svaraðu fyrirliggjandi til að fá fullan aðgang' 
  },
  step3Title: { en: 'Unlock Full Access', is: 'Opnað fyrir fullan aðgang' },
  step3Desc: { 
    en: 'After 3 contributions, enjoy unlimited access to all content', 
    is: 'Eftir 3 framlög, njóttu ótakmarkaðs aðgang að öllu efni' 
  },
  home: { en: 'Home', is: 'Heim' },
  browse: { en: 'Browse', is: 'Vafra' },
  contribute: { en: 'Contribute', is: 'Leggja til' },
  searchPlaceholder: { en: 'Search questions...', is: 'Leita að spurningum...' },
  loading: { en: 'Loading...', is: 'Hleður...' },
  questions: { en: 'Questions', is: 'Spurningar' },
  answers: { en: 'Answers', is: 'Svör' },
  viewDetails: { en: 'View Details', is: 'Sjá nánar' },
  noQuestionsFound: { 
    en: 'No questions found', 
    is: 'Engar spurningar fundust' 
  },
  askedBy: { en: 'Asked by', is: 'Spurt af' },
  on: { en: 'on', is: 'þann' },
  answeredBy: { en: 'Answered by', is: 'Svarað af' },
  
  // New translations
  contributeTitle: { 
    en: 'Contribute to Q&A Exchange', 
    is: 'Leggja til Q&A-vettvangs' 
  },
  yourName: { en: 'Your Name', is: 'Nafnið þitt' },
  enterYourName: { en: 'Enter your name', is: 'Sláðu inn nafnið þitt' },
  createAccount: { en: 'Create Account', is: 'Búa til reikning' },
  yourContributions: { en: 'Your Contributions', is: 'Framlög þín' },
  required: { en: 'Required', is: 'Nauðsynlegt' },
  yes: { en: 'Yes', is: 'Já' },
  notYet: { en: 'Not Yet', is: 'Ekki enn' },
  fullAccess: { en: 'Full Access', is: 'Fullur aðgangur' },
  congratulations: { en: 'Congratulations!', is: 'Til hamingju!' },
  contributionComplete: { 
    en: "You've contributed enough to gain full access to all Q&A content.", 
    is: 'Þú hefur lagt nóg til að fá fullan aðgang að öllu Q&A efni.' 
  },
  askQuestion: { en: 'Ask a Question', is: 'Spyrja spurningu' },
  answerQuestion: { en: 'Answer a Question', is: 'Svara spurningu' },
  questionTitle: { en: 'Question Title', is: 'Titill spurningar' },
  questionTitlePlaceholder: { 
    en: 'e.g. How do I improve my programming skills?', 
    is: 't.d. Hvernig get ég bætt forritunarhæfni mína?' 
  },
  questionDetails: { en: 'Question Details', is: 'Upplýsingar um spurningu' },
  questionDetailsPlaceholder: { 
    en: 'Provide more details about your question...', 
    is: 'Gefðu meiri upplýsingar um spurninguna þína...' 
  },
  submitQuestion: { en: 'Submit Question', is: 'Senda spurningu' },
  selectQuestion: { en: 'Select a Question', is: 'Veldu spurningu' },
  selectQuestionPlaceholder: { 
    en: 'Select a question to answer', 
    is: 'Veldu spurningu til að svara' 
  },
  yourAnswer: { en: 'Your Answer', is: 'Svarið þitt' },
  yourAnswerPlaceholder: { 
    en: 'Write your answer here...', 
    is: 'Skrifaðu svarið þitt hér...' 
  },
  submitAnswer: { en: 'Submit Answer', is: 'Senda svar' },
  questionNotFound: { en: 'Question Not Found', is: 'Spurning fannst ekki' },
  questionNotFoundDesc: { 
    en: "The question you're looking for doesn't exist or has been removed.", 
    is: 'Spurningin sem þú ert að leita að er ekki til eða hefur verið fjarlægð.' 
  },
  backToQuestions: { en: 'Back to Questions', is: 'Til baka í spurningar' },
  answer: { en: 'Answer', is: 'Svar' },
  noAnswersYet: { 
    en: 'No answers yet. Be the first to answer!', 
    is: 'Engin svör enn. Vertu fyrst/ur til að svara!' 
  },
  mustBeLoggedIn: { 
    en: 'You must be logged in to answer questions', 
    is: 'Þú verður að vera skráð/ur inn til að svara spurningum' 
  },
  enterAnswer: { en: 'Please enter an answer', is: 'Vinsamlegast sláðu inn svar' },
  
  // New attachment and article translations
  attachmentType: { en: 'Attachment Type', is: 'Tegund viðhengis' },
  file: { en: 'File', is: 'Skrá' },
  video: { en: 'Video', is: 'Myndband' },
  link: { en: 'Link', is: 'Hlekkur' },
  linkUrl: { en: 'Link URL', is: 'Slóð hlekkjar' },
  attachmentUrl: { en: 'Attachment URL', is: 'Slóð viðhengis' },
  attachmentName: { en: 'Attachment Name', is: 'Nafn viðhengis' },
  optionalName: { en: 'Optional name or description', is: 'Valfrjálst nafn eða lýsing' },
  addAttachment: { en: 'Add Attachment', is: 'Bæta við viðhengi' },
  clear: { en: 'Clear', is: 'Hreinsa' },
  articleFacts: { en: 'Article / Facts', is: 'Grein / Staðreyndir' },
  articleFactsPlaceholder: { 
    en: 'Add supporting facts or article text here...', 
    is: 'Bættu við stuðningsstaðreyndum eða greinarefni hér...' 
  },
  articleFactsHelp: { 
    en: 'Optional. Add supporting information or verifiable facts related to your question.', 
    is: 'Valfrjálst. Bættu við stuðningsupplýsingum eða staðfestanlegum staðreyndum tengdum spurningunni þinni.' 
  },
  attachments: { en: 'Attachments', is: 'Viðhengi' },
  fileAttachment: { en: 'File Attachment', is: 'Skráarviðhengi' },
  videoAttachment: { en: 'Video Attachment', is: 'Myndbandviðhengi' },
  linkAttachment: { en: 'Link Attachment', is: 'Hlekksviðhengi' },
  
  // New translations for voting limits
  voteLimit: { en: 'Daily Vote Limit Reached', is: 'Daglegu atkvæðamarki náð' },
  voteLimitDesc: { 
    en: 'You have used all 5 of your daily upvotes. Try again tomorrow.', 
    is: 'Þú hefur notað öll 5 daglegu uppatkvæði þín. Reyndu aftur á morgun.' 
  },
  noVotesRemaining: { 
    en: 'No more upvotes remaining today', 
    is: 'Engin fleiri uppatkvæði eftir í dag' 
  },
  
  // New translations for AI Question generation
  generateAIQuestion: { 
    en: 'Generate AI Question', 
    is: 'Búa til gervigreindspurningu' 
  },
  generating: { 
    en: 'Generating...', 
    is: 'Bý til...' 
  },
  
  // New keys for API functionality
  apiKeySet: {
    en: "Gemini API key is set and ready to use",
    is: "Gemini API lykillinn er stilltur og tilbúinn til notkunar"
  },
  removeKey: {
    en: "Remove Key",
    is: "Fjarlægja lykil"
  },
  needGeminiKey: {
    en: "Please enter your Gemini API key to enable AI question generation",
    is: "Vinsamlegast sláðu inn Gemini API lykilinn þinn til að virkja AI spurningagerð"
  },
  saveKey: {
    en: "Save Key",
    is: "Vista lykil"
  },
  
  // New entries for login
  login: {
    en: "Login",
    is: "Skrá inn"
  },
  logout: {
    en: "Logout",
    is: "Skrá út"
  },
  yourEmail: {
    en: "Your Email",
    is: "Tölvupósturinn þinn"
  },
  enterEmail: {
    en: "Enter your email",
    is: "Sláðu inn tölvupóstinn þinn"
  },
  emailHelp: {
    en: "Users with @omaromar.net email will receive admin privileges",
    is: "Notendur með @omaromar.net tölvupóst fá stjórnendaréttindi"
  },
  
  // New entries for source and image
  sourceLink: {
    en: "Source Link",
    is: "Heimild tengill"
  },
  sourceLinkHelp: {
    en: "Add a link to the source of your question",
    is: "Bættu við tengli á heimild spurningarinnar þinnar"
  },
  imageUrl: {
    en: "Image URL",
    is: "Slóð myndar"
  },
  imageUrlHelp: {
    en: "Add an image to illustrate your question",
    is: "Bættu við mynd til að sýna spurninguna þína"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'en' | 'is'>('en');

  const t = (key: string): DualTextValue => {
    return dictionary[key] || { en: key, is: key };
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
