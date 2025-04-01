
import React, { createContext, useContext } from 'react';
import { QAContextType } from './qa/types';
import { useQAState } from './qa/useQAState';
import { useUserActions } from './qa/useUserActions';
import { useQuestionActions } from './qa/useQuestionActions';
import { useAnswerActions } from './qa/useAnswerActions';
import { useVotingActions } from './qa/useVotingActions';
import { useAdminActions } from './qa/useAdminActions';

const QAContext = createContext<QAContextType | undefined>(undefined);

export const QAProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    user,
    setUser,
    questions,
    setQuestions,
    answers,
    setAnswers,
    hasContributed,
    dailyVotes,
    setDailyVotes,
    dailyVotesRemaining,
    checkContributionStatus
  } = useQAState();

  const { createUser, updateUser, login, logout } = useUserActions({
    user,
    setUser,
    questions,
    setQuestions,
    answers,
    setAnswers
  });

  const { addQuestion, deleteQuestion, addQuestionVotes, updateQuestionCategory } = useQuestionActions({
    user,
    questions,
    setQuestions,
    checkContributionStatus
  });

  const { addAnswer } = useAnswerActions({
    user,
    questions,
    answers,
    setAnswers,
    checkContributionStatus
  });

  const { voteQuestion, voteAnswer, resetVoteCount } = useVotingActions({
    user,
    questions,
    setQuestions,
    answers,
    setAnswers,
    dailyVotes,
    setDailyVotes
  });

  const { postQuestion } = useAdminActions({
    user,
    questions,
    setQuestions
  });

  const userQuestionCount = user 
    ? questions.filter(q => q.authorId === user.id).length 
    : 0;
    
  const userAnswerCount = user 
    ? answers.filter(a => a.authorId === user.id).length 
    : 0;

  return (
    <QAContext.Provider value={{ 
      user, 
      questions, 
      answers, 
      hasContributed,
      dailyVotesRemaining,
      createUser,
      updateUser,
      login, 
      logout, 
      addQuestion, 
      addAnswer, 
      voteQuestion, 
      voteAnswer,
      resetVoteCount,
      postQuestion,
      userQuestionCount,
      userAnswerCount,
      deleteQuestion,
      addQuestionVotes,
      updateQuestionCategory
    }}>
      {children}
    </QAContext.Provider>
  );
};

export const useQA = () => {
  const context = useContext(QAContext);
  if (context === undefined) {
    throw new Error('useQA must be used within a QAProvider');
  }
  return context;
};
