
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
    en: 'Ask questions, find answers, share knowledge', 
    is: 'Spyrðu spurninga, fáðu svör, deildu þekkingu' 
  },
  getStarted: { en: 'Let\'s Go!', is: 'Byrjum!' },
  browseQuestions: { en: 'Browse Questions', is: 'Skoða spurningar' },
  recentQuestions: { en: 'Recent Questions', is: 'Nýlegar spurningar' },
  viewAll: { en: 'View All', is: 'Sjá allt' },
  howItWorks: { en: 'How It Works', is: 'Hvernig virkar það' },
  step1Title: { en: 'Create an Account', is: 'Búðu til aðgang' },
  step1Desc: { 
    en: 'Tell us your name to join our community', 
    is: 'Segðu okkur hvað þú heitir til að vera með' 
  },
  step2Title: { en: 'Share Your Ideas', is: 'Deildu hugmyndum þínum' },
  step2Desc: { 
    en: 'Ask questions or answer others to join the fun', 
    is: 'Spyrðu spurninga eða svaraðu öðrum til að vera með í gleðinni' 
  },
  step3Title: { en: 'Discover Everything', is: 'Uppgötvaðu allt' },
  step3Desc: { 
    en: 'After 3 contributions, enjoy all our content', 
    is: 'Eftir 3 framlög, njóttu alls efnisins okkar' 
  },
  home: { en: 'Home', is: 'Heim' },
  browse: { en: 'Browse', is: 'Skoða' },
  contribute: { en: 'Contribute', is: 'Taka þátt' },
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
  
  // Updated to be more family-friendly
  contributeTitle: { 
    en: 'Join Our Q&A Adventure!', 
    is: 'Vertu með í ævintýrinu okkar!' 
  },
  yourName: { en: 'Your Name', is: 'Nafnið þitt' },
  enterYourName: { en: 'Enter your name', is: 'Sláðu inn nafnið þitt' },
  createAccount: { en: 'Join In', is: 'Skrá sig' },
  yourContributions: { en: 'Your Adventures', is: 'Ævintýrin þín' },
  required: { en: 'Required', is: 'Nauðsynlegt' },
  yes: { en: 'Yes', is: 'Já' },
  notYet: { en: 'Not Yet', is: 'Ekki enn' },
  fullAccess: { en: 'Full Access', is: 'Fullur aðgangur' },
  congratulations: { en: 'Hooray!', is: 'Húrra!' },
  contributionComplete: { 
    en: "You've unlocked all our fun content!", 
    is: 'Þú hefur opnað aðgang að öllu skemmtilega efninu okkar!' 
  },
  askQuestion: { en: 'Ask a Question', is: 'Spyrja spurningu' },
  answerQuestion: { en: 'Answer a Question', is: 'Svara spurningu' },
  questionTitle: { en: 'Question Title', is: 'Titill spurningar' },
  questionTitlePlaceholder: { 
    en: 'e.g. Why is the sky blue?', 
    is: 't.d. Af hverju er himininn blár?' 
  },
  questionDetails: { en: 'Question Details', is: 'Upplýsingar um spurningu' },
  questionDetailsPlaceholder: { 
    en: 'Tell us more about your question...', 
    is: 'Segðu okkur meira um spurninguna þína...' 
  },
  submitQuestion: { en: 'Submit Question', is: 'Senda spurningu' },
  selectQuestion: { en: 'Pick a Question', is: 'Veldu spurningu' },
  selectQuestionPlaceholder: { 
    en: 'Choose a question to answer', 
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
    en: "We couldn't find that question!", 
    is: 'Við fundum ekki þessa spurningu!' 
  },
  backToQuestions: { en: 'Back to Questions', is: 'Til baka í spurningar' },
  answer: { en: 'Answer', is: 'Svar' },
  noAnswersYet: { 
    en: 'No answers yet. Be the first!', 
    is: 'Engin svör enn. Vertu fyrst/ur!' 
  },
  mustBeLoggedIn: { 
    en: 'Please log in to answer', 
    is: 'Skráðu þig inn til að svara' 
  },
  enterAnswer: { en: 'Please enter an answer', is: 'Vinsamlegast sláðu inn svar' },
  
  // Attachment and article translations updated
  attachmentType: { en: 'Attachment Type', is: 'Tegund viðhengis' },
  file: { en: 'File', is: 'Skrá' },
  video: { en: 'Video', is: 'Myndband' },
  link: { en: 'Link', is: 'Hlekkur' },
  linkUrl: { en: 'Link URL', is: 'Slóð hlekkjar' },
  attachmentUrl: { en: 'Attachment URL', is: 'Slóð viðhengis' },
  attachmentName: { en: 'Attachment Name', is: 'Nafn viðhengis' },
  optionalName: { en: 'Name or description', is: 'Nafn eða lýsing' },
  addAttachment: { en: 'Add Attachment', is: 'Bæta við viðhengi' },
  clear: { en: 'Clear', is: 'Hreinsa' },
  articleFacts: { en: 'Fun Facts', is: 'Skemmtilegar staðreyndir' },
  articleFactsPlaceholder: { 
    en: 'Add fun facts here...', 
    is: 'Bættu við skemmtilegum staðreyndum hér...' 
  },
  articleFactsHelp: { 
    en: 'Add fun information related to your question', 
    is: 'Bættu við skemmtilegum upplýsingum tengdum spurningunni þinni' 
  },
  attachments: { en: 'Attachments', is: 'Viðhengi' },
  fileAttachment: { en: 'File Attachment', is: 'Skráarviðhengi' },
  videoAttachment: { en: 'Video Attachment', is: 'Myndbandviðhengi' },
  linkAttachment: { en: 'Link Attachment', is: 'Hlekksviðhengi' },
  
  // More kid-friendly wording
  voteLimit: { en: 'Daily Vote Limit Reached', is: 'Daglegu atkvæðamarki náð' },
  voteLimitDesc: { 
    en: 'You have used all 5 of your daily stars', 
    is: 'Þú hefur notað allar 5 daglegu stjörnurnar þínar' 
  },
  noVotesRemaining: { 
    en: 'No more stars today', 
    is: 'Engar fleiri stjörnur í dag' 
  },
  
  // AI Question generation
  generateAIQuestion: { 
    en: 'Magic Question Maker', 
    is: 'Töfra-spurningavél' 
  },
  generating: { 
    en: 'Creating Magic...', 
    is: 'Býr til töfra...' 
  },
  
  // API functionality
  apiKeySet: {
    en: "Magic key is ready",
    is: "Töfralykillinn er tilbúinn"
  },
  removeKey: {
    en: "Remove Key",
    is: "Fjarlægja lykil"
  },
  needGeminiKey: {
    en: "Please enter your magic key",
    is: "Vinsamlegast sláðu inn töfralykil"
  },
  saveKey: {
    en: "Save Key",
    is: "Vista lykil"
  },
  
  // Login
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
    en: "Helper elves get special powers",
    is: "Hjálparálfar fá sérstaka krafta"
  },
  
  // Source and image
  sourceLink: {
    en: "Source Link",
    is: "Heimild tengill"
  },
  sourceLinkHelp: {
    en: "Where did you learn this?",
    is: "Hvar lærðirðu þetta?"
  },
  imageUrl: {
    en: "Image URL",
    is: "Slóð myndar"
  },
  imageUrlHelp: {
    en: "Add a fun picture",
    is: "Bættu við skemmtilegri mynd"
  },
  
  // Add new family-friendly categories
  categories: {
    en: "Categories",
    is: "Flokkar"
  },
  categoryAnimals: {
    en: "Animals",
    is: "Dýr"
  },
  categorySpace: {
    en: "Space",
    is: "Geimurinn"
  },
  categoryNature: {
    en: "Nature",
    is: "Náttúran"
  },
  categoryScience: {
    en: "Science",
    is: "Vísindi"
  },
  categoryHistory: {
    en: "History",
    is: "Saga"
  },
  categoryArt: {
    en: "Art & Crafts",
    is: "List og handverk"
  },
  categoryMusic: {
    en: "Music",
    is: "Tónlist"
  },
  categoryFood: {
    en: "Food",
    is: "Matur"
  },
  categoryBooks: {
    en: "Books",
    is: "Bækur"
  },
  categoryGames: {
    en: "Games",
    is: "Leikir"
  },
  categoryPuzzles: {
    en: "Puzzles",
    is: "Þrautir"
  },
  categoryFunnyFacts: {
    en: "Funny Facts",
    is: "Fyndnar staðreyndir"
  },
  categoryMagic: {
    en: "Magic",
    is: "Töfrar"
  },
  categoryRainbow: {
    en: "Rainbow",
    is: "Regnbogi"
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to Icelandic now
  const [language, setLanguage] = useState<'en' | 'is'>('is');

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
