
import React, { useState } from 'react';
import { useQA } from '@/context/QAContext';
import { Button } from '@/components/ui/button';
import { Question, Answer, QuestionCategory } from '@/types/qa';
import { ThumbsUp, Trash2, ExternalLink, Tag } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import DualText from '@/components/DualText';
import { motion } from 'framer-motion';

interface AdminControlsProps {
  question: Question;
  answers: Answer[];
}

const AdminControls: React.FC<AdminControlsProps> = ({ question, answers }) => {
  const { user, resetVoteCount, postQuestion, deleteQuestion, addQuestionVotes, updateQuestionCategory } = useQA();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>(question.category || '');
  const [isPosting, setIsPosting] = useState(false);
  
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
  
  const handlePostQuestion = async () => {
    if (!bestAnswer) return;
    
    setIsPosting(true);
    try {
      await postQuestion(question.id, bestAnswer.id);
      setIsPosting(false);
    } catch (error) {
      setIsPosting(false);
      toast({
        title: "Villa",
        description: "Tókst ekki að birta spurningu á Creatomate",
        variant: "destructive"
      });
    }
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
    <motion.div 
      className="mt-6 p-4 border rounded-md bg-gray-50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
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
            onClick={handlePostQuestion}
            disabled={question.posted || isPosting}
          >
            {isPosting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Birting í vinnslu...
              </span>
            ) : (
              <>
                <ExternalLink className="mr-1 h-4 w-4" />
                {question.posted ? "Þegar birt" : "Birta á Creatomate"}
              </>
            )}
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
      
      {question.category === 'surprise' && (
        <div className="mt-3 p-2 border border-pink-300 bg-pink-50 rounded-md">
          <p className="text-sm text-pink-700">
            🎉 Þetta er sérstök galdra-spurning! Hún mun fá aukna athygli og skemmtilegar hreyfingar.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default AdminControls;
