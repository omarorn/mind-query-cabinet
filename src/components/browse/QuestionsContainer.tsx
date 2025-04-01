
import { useQA } from "@/context/QAContext";
import { Question } from "@/types/qa";
import { motion } from "framer-motion";
import QuestionCard from "../QuestionCard";
import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";

interface QuestionsContainerProps {
  questions: Question[];
  easterEggMode: boolean;
  onQuestionClick: (questionId: string) => void;
}

const QuestionsContainer = ({ 
  questions, 
  easterEggMode,
  onQuestionClick 
}: QuestionsContainerProps) => {
  const { user, answers, postQuestion, deleteQuestion } = useQA();

  const handleDeleteQuestion = (e: React.MouseEvent, questionId: string) => {
    e.stopPropagation();
    if (window.confirm('Ertu viss um að þú viljir eyða þessari spurningu?')) {
      deleteQuestion(questionId);
    }
  };

  return (
    <div className="space-y-4">
      {questions.length > 0 ? (
        questions.map((question) => (
          <div key={question.id} onClick={() => onQuestionClick(question.id)} className="cursor-pointer">
            <QuestionCard 
              question={{
                ...question,
                isEasterEgg: easterEggMode && Math.random() > 0.8 ? true : question.isEasterEgg
              }} 
              showContent={true} 
            />
            
            {user?.isAdmin && (
              <div className="mt-2 flex justify-end gap-2">
                {answers.some(a => a.questionId === question.id) && (
                  <Button 
                    size="sm" 
                    variant={question.posted ? "outline" : "default"} 
                    onClick={(e) => {
                      e.stopPropagation();
                      const answer = answers.find(a => a.questionId === question.id);
                      if (answer) {
                        postQuestion(question.id, answer.id);
                      }
                    }}
                    disabled={question.posted}
                  >
                    {question.posted ? "Þegar birt" : "Birta á Creatomate"}
                  </Button>
                )}
                
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={(e) => handleDeleteQuestion(e, question.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="qa-card text-center py-8">
          <p className="text-gray-600">
            Engar spurningar fundust
          </p>
        </div>
      )}
    </div>
  );
};

export default QuestionsContainer;
