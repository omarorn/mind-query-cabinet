
import { User, Question, Answer } from '@/types/qa';
import { toast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from 'uuid';

interface UserActionsProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  answers: Answer[];
  setAnswers: React.Dispatch<React.SetStateAction<Answer[]>>;
}

export const useUserActions = ({
  user,
  setUser,
  questions,
  setQuestions,
  answers,
  setAnswers
}: UserActionsProps) => {
  
  const createUser = (name: string, email: string = "", isAdmin: boolean = false) => {
    const isOmarOmarEmail = email.toLowerCase().endsWith('@omaromar.net');
    
    const newUser = {
      id: uuidv4(),
      name,
      email,
      isAdmin: isAdmin || isOmarOmarEmail
    };
    
    setUser(newUser);
    toast({
      title: "Welcome!",
      description: `Hello ${name}, you can now start contributing!${isOmarOmarEmail ? ' You have been granted admin privileges.' : ''}`,
    });
  };

  const updateUser = async (name: string, email: string): Promise<void> => {
    if (!user) {
      throw new Error("No user is logged in");
    }
    
    const isOmarOmarEmail = email.toLowerCase().endsWith('@omaromar.net');
    
    const updatedUser = {
      ...user,
      name,
      email,
      isAdmin: user.isAdmin || isOmarOmarEmail
    };
    
    const updatedQuestions = questions.map(question => {
      if (question.authorId === user.id) {
        return {
          ...question,
          authorName: name
        };
      }
      return question;
    });
    
    const updatedAnswers = answers.map(answer => {
      if (answer.authorId === user.id) {
        return {
          ...answer,
          authorName: name
        };
      }
      return answer;
    });
    
    setUser(updatedUser);
    setQuestions(updatedQuestions);
    setAnswers(updatedAnswers);
    
    return Promise.resolve();
  };

  const login = (email: string) => {
    if (user) {
      const isOmarOmarEmail = email.toLowerCase().endsWith('@omaromar.net');
      const updatedUser = {
        ...user,
        email,
        isAdmin: user.isAdmin || isOmarOmarEmail
      };
      
      setUser(updatedUser);
      
      if (isOmarOmarEmail && !user.isAdmin) {
        toast({
          title: "Admin Access Granted",
          description: "You have been granted administrator privileges.",
        });
      } else {
        toast({
          title: "Login Successful",
          description: "You have been logged in successfully.",
        });
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('qa-user');
    setUser(null);
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
  };
  
  return {
    createUser,
    updateUser,
    login,
    logout
  };
};
