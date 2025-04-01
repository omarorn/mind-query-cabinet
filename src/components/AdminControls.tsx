
import React from 'react';
import { useQA } from '@/context/QAContext';
import { Button } from '@/components/ui/button';
import { Question, Answer } from '@/types/qa';

interface AdminControlsProps {
  question: Question;
  answers: Answer[];
}

const AdminControls: React.FC<AdminControlsProps> = ({ question, answers }) => {
  const { user, resetVoteCount, postQuestion } = useQA();
  
  if (!user?.isAdmin) return null;
  
  const bestAnswer = answers.length > 0 
    ? answers.sort((a, b) => b.upvotes - a.upvotes)[0] 
    : null;
  
  return (
    <div className="mt-6 p-4 border rounded-md bg-gray-50">
      <h3 className="text-lg font-semibold mb-3">Admin Controls</h3>
      
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          onClick={resetVoteCount}
          size="sm"
        >
          Reset Vote Count
        </Button>
        
        {bestAnswer && (
          <Button 
            size="sm" 
            variant={question.posted ? "outline" : "default"}
            onClick={() => postQuestion(question.id, bestAnswer.id)}
            disabled={question.posted}
          >
            {question.posted ? "Already Posted" : "Post to Creatomate"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default AdminControls;
