
import React from 'react';
import { useQA } from '@/context/QAContext';
import { Button } from '@/components/ui/button';
import { Question, Answer } from '@/types/qa';
import { ThumbsUp, Trash2, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface AdminControlsProps {
  question: Question;
  answers: Answer[];
}

const AdminControls: React.FC<AdminControlsProps> = ({ question, answers }) => {
  const { user, resetVoteCount, postQuestion, deleteQuestion, addQuestionVotes } = useQA();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  if (!user?.isAdmin) return null;
  
  const bestAnswer = answers.length > 0 
    ? answers.sort((a, b) => b.upvotes - a.upvotes)[0] 
    : null;
  
  const handleDelete = () => {
    if (window.confirm('Ertu viss um að þú viljir eyða þessari spurningu?')) {
      deleteQuestion(question.id);
      toast({
        title: 'Spurningu eytt',
        description: 'Spurningin var eytt með árangri',
      });
      navigate('/browse');
    }
  };
  
  const handleAddVotes = () => {
    addQuestionVotes(question.id, 5);
    toast({
      title: '+5 atkvæði',
      description: 'Bætt við 5 atkvæðum við spurninguna',
    });
  };
  
  return (
    <div className="mt-6 p-4 border rounded-md bg-gray-50">
      <h3 className="text-lg font-semibold mb-3">Stjórnendavalmöguleikar</h3>
      
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          onClick={resetVoteCount}
          size="sm"
        >
          Endurstilla atkvæði
        </Button>
        
        <Button
          variant="outline"
          onClick={handleAddVotes}
          size="sm"
        >
          <ThumbsUp className="mr-1 h-4 w-4" /> +5 atkvæði
        </Button>
        
        <Button
          variant="destructive"
          onClick={handleDelete}
          size="sm"
        >
          <Trash2 className="mr-1 h-4 w-4" /> Eyða spurningu
        </Button>
        
        {bestAnswer && (
          <Button 
            size="sm" 
            variant={question.posted ? "outline" : "default"}
            onClick={() => postQuestion(question.id, bestAnswer.id)}
            disabled={question.posted}
          >
            <ExternalLink className="mr-1 h-4 w-4" />
            {question.posted ? "Þegar birt" : "Birta á Creatomate"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default AdminControls;
