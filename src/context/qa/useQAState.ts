
import { useState, useEffect } from 'react';
import { User, Question, Answer } from '@/types/qa';

export const useQAState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [hasContributed, setHasContributed] = useState(false);
  const [dailyVotes, setDailyVotes] = useState<{date: string, count: number}>({
    date: new Date().toDateString(),
    count: 0
  });

  const dailyVotesRemaining = 5 - dailyVotes.count;

  useEffect(() => {
    const storedUser = localStorage.getItem('qa-user');
    const storedQuestions = localStorage.getItem('qa-questions');
    const storedAnswers = localStorage.getItem('qa-answers');
    const storedContributed = localStorage.getItem('qa-contributed');
    const storedDailyVotes = localStorage.getItem('qa-daily-votes');

    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedQuestions) setQuestions(JSON.parse(storedQuestions));
    if (storedAnswers) setAnswers(JSON.parse(storedAnswers));
    if (storedContributed) setHasContributed(JSON.parse(storedContributed));
    if (storedDailyVotes) setDailyVotes(JSON.parse(storedDailyVotes));
  }, []);

  useEffect(() => {
    const today = new Date().toDateString();
    if (dailyVotes.date !== today) {
      setDailyVotes({
        date: today,
        count: 0
      });
    }
  }, [dailyVotes.date]);

  useEffect(() => {
    if (user) localStorage.setItem('qa-user', JSON.stringify(user));
    if (questions.length) localStorage.setItem('qa-questions', JSON.stringify(questions));
    if (answers.length) localStorage.setItem('qa-answers', JSON.stringify(answers));
    localStorage.setItem('qa-contributed', JSON.stringify(hasContributed));
    localStorage.setItem('qa-daily-votes', JSON.stringify(dailyVotes));
  }, [user, questions, answers, hasContributed, dailyVotes]);

  const checkContributionStatus = () => {
    if (!hasContributed && user) {
      const userQuestionsCount = questions.filter(q => q.authorId === user.id).length + 1;
      const userAnswersCount = answers.filter(a => a.authorId === user.id).length;
      
      if (userQuestionsCount + userAnswersCount >= 3) {
        setHasContributed(true);
        return true;
      }
    }
    return false;
  };

  return {
    user,
    setUser,
    questions,
    setQuestions,
    answers,
    setAnswers,
    hasContributed,
    setHasContributed,
    dailyVotes,
    setDailyVotes,
    dailyVotesRemaining,
    checkContributionStatus
  };
};
