import React, { createContext, useContext } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string) => { en: string; is: string };
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = React.useState('is');

  const t = (key: string) => {
    const translations = {
      contributeTitle: {
        en: "Contribute to the Knowledge Base",
        is: "Leggðu til efni í þekkingargrunninn"
      },
      askQuestion: {
        en: "Ask a Question",
        is: "Spyrja spurningu"
      },
      answerQuestion: {
        en: "Answer a Question",
        is: "Svara spurningu"
      },
      selectQuestion: {
        en: "Select a Question",
        is: "Veldu spurningu"
      },
      yourAnswer: {
        en: "Your Answer",
        is: "Þitt svar"
      },
      submitAnswer: {
        en: "Submit Answer",
        is: "Senda inn svar"
      },
      questionTitle: {
        en: "Question Title",
        is: "Titill spurningar"
      },
      questionContent: {
        en: "Question Content",
        is: "Innihald spurningar"
      },
      questionArticle: {
        en: "Related Article (Optional)",
        is: "Tengd grein (valfrjálst)"
      },
      submitQuestion: {
        en: "Submit Question",
        is: "Senda inn spurningu"
      },
      answeredBy: {
        en: "Answered by",
        is: "Svarað af"
      },
      askedBy: {
        en: "Asked by",
        is: "Spurt af"
      },
      on: {
        en: "on",
        is: "þann"
      },
      noAnswersYet: {
        en: "No answers yet. Be the first to answer!",
        is: "Engin svör ennþá. Vertu fyrst(ur) til að svara!"
      },
      answer: {
        en: "Answer",
        is: "Svar"
      },
      answers: {
        en: "Answers",
        is: "Svör"
      },
      backToQuestions: {
        en: "Back to Questions",
        is: "Til baka í spurningar"
      },
      questionNotFound: {
        en: "Question Not Found",
        is: "Spurning fannst ekki"
      },
      questionNotFoundDesc: {
        en: "The question you are looking for does not exist.",
        is: "Spurningin sem þú ert að leita að er ekki til."
      },
      mustBeLoggedIn: {
        en: "You must be logged in to perform this action.",
        is: "Þú verður að vera skráð(ur) inn til að framkvæma þessa aðgerð."
      },
      enterAnswer: {
        en: "Please enter an answer.",
        is: "Vinsamlegast sláðu inn svar."
      },
      selectQuestionPlaceholder: {
        en: "Select a question",
        is: "Veldu spurningu"
      },
      yourAnswerPlaceholder: {
        en: "Enter your answer here...",
        is: "Sláðu inn svarið þitt hér..."
      },
      noVotesRemaining: {
        en: "No votes remaining today.",
        is: "Engin atkvæði eftir í dag."
      },
      fileAttachment: {
        en: "File Attachment",
        is: "Skjal viðhengi"
      },
      videoAttachment: {
        en: "Video Attachment",
        is: "Myndband viðhengi"
      },
      linkAttachment: {
        en: "Link Attachment",
        is: "Hlekkur viðhengi"
      },
      articleFacts: {
        en: "Article Facts",
        is: "Staðreyndir úr grein"
      },
      magicQuestionTitle: {
        en: "Magic Question Title",
        is: "Galdra Spurning Titill"
      },
      magicQuestionContent: {
        en: "Magic Question Content",
        is: "Galdra Spurning Innihald"
      },
      magicQuestionSource: {
        en: "Magic Question Source",
        is: "Galdra Spurning Heimild"
      },
      magicQuestionImage: {
        en: "Magic Question Image",
        is: "Galdra Spurning Mynd"
      },
      magicButton: {
        en: "Magic",
        is: "Galdur"
      },
      science: {
        en: "Science",
        is: "Vísindi"
      },
      history: {
        en: "History",
        is: "Saga"
      },
      technology: {
        en: "Technology",
        is: "Tækni"
      },
      culture: {
        en: "Culture",
        is: "Menning"
      },
       education: {
        en: "Education",
        is: "Menntun"
      },
      adminControls: {
        en: "Admin Controls",
        is: "Stjórnandi Aðgerðir"
      },
      deleteQuestion: {
        en: "Delete Question",
        is: "Eyða Spurningu"
      },
      postToCreatomate: {
        en: "Post to Creatomate",
        is: "Senda á Creatomate"
      },
      addVote: {
        en: "Add Vote",
        is: "Bæta við Atkvæði"
      },
      updateCategory: {
        en: "Update Category",
        is: "Uppfæra Flokk"
      },
      category: {
        en: "Category",
        is: "Flokkur"
      },
      source: {
        en: "Source",
        is: "Heimild"
      },
      imageURL: {
        en: "Image URL",
        is: "Mynd URL"
      },
      resetVotes: {
        en: "Reset Votes",
        is: "Endurstilla Atkvæði"
      },
      resetVotesConfirmation: {
        en: "Are you sure you want to reset the votes for this question?",
        is: "Ertu viss um að þú viljir endurstilla atkvæðin fyrir þessa spurningu?"
      },
      confirm: {
        en: "Confirm",
        is: "Staðfesta"
      },
      cancel: {
        en: "Cancel",
        is: "Hætta við"
      },
      editUser: {
        en: "Edit User",
        is: "Breyta Notanda"
      },
      updateUser: {
        en: "Update User",
        is: "Uppfæra Notanda"
      },
      deleteUser: {
        en: "Delete User",
        is: "Eyða Notanda"
      },
      areYouSureDeleteUser: {
        en: "Are you sure you want to delete this user?",
        is: "Ertu viss um að þú viljir eyða þessum notanda?"
      },
      readMore: {
        en: "Read more",
        is: "Sjá meira"
      },
      showLess: {
        en: "Show less",
        is: "Sjá minna"
      },
      characters: {
        en: "characters",
        is: "stafir"
      },
      previewNote: {
        en: "First 50 characters will be visible in preview",
        is: "Fyrstu 50 stafir verða sýnilegir í forskoðun"
      },
      preview: {
        en: "Preview",
        is: "Forskoðun"
      },
      clickToExpandPreview: {
        en: "Click to expand",
        is: "Smella til að sjá meira"
      },
    };

    return translations[key] || { en: key, is: key };
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
