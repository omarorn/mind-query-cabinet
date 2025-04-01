
import React, { useState } from 'react';
import { useQA } from '@/context/QAContext';
import { Button } from '@/components/ui/button';
import { Question, Answer, QuestionCategory } from '@/types/qa';
import { ThumbsUp, Trash2, ExternalLink, Tag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import DualText from '@/components/DualText';

interface AdminControlsProps {
  question: Question;
  answers: Answer[];
}

const AdminControls: React.FC<AdminControlsProps> = ({ question, answers }) => {
  const { user, resetVoteCount, postQuestion, deleteQuestion, addQuestionVotes, updateQuestionCategory } = useQA();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>(question.category || '');
  
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

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    updateQuestionCategory(question.id, value);
    toast({
      title: 'Flokkur uppfærður',
      description: 'Flokkur spurningar hefur verið uppfærður',
    });
  };

  const categories: QuestionCategory[] = [
    'animals',
    'space',
    'nature',
    'science',
    'history',
    'art',
    'music',
    'food',
    'books',
    'games',
    'puzzles',
    'funnyFacts',
    'magic',
    'rainbow',
    'surprise'
  ];
  
  return (
    <div className="mt-6 p-4 border rounded-md bg-gray-50">
      <h3 className="text-lg font-semibold mb-3">Stjórnendavalmöguleikar</h3>
      
      <div className="flex flex-wrap gap-2 mb-3">
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

      <div className="flex items-center gap-2">
        <Tag className="h-4 w-4" />
        <label htmlFor="categorySelect" className="text-sm font-medium">
          Breyta flokki:
        </label>
        <Select
          value={selectedCategory}
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Veldu flokk" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Flokkar</SelectLabel>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  <DualText textKey={`category${category.charAt(0).toUpperCase() + category.slice(1)}`} />
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default AdminControls;
