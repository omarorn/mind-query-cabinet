import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { generateQuestionWithAI } from "@/utils/aiUtils";
import { useQA } from "@/context/QAContext";
import DualText from "./DualText";

interface AIQuestionButtonProps {
  onQuestionGenerated?: (title: string, content: string) => void;
}

const AIQuestionButton: React.FC<AIQuestionButtonProps> = ({ 
  onQuestionGenerated 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user, addQuestion } = useQA();

  const handleGenerateQuestion = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create AI-generated questions",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await generateQuestionWithAI();
      
      if (!result) {
        throw new Error("Failed to generate question");
      }
      
      const { title, content } = result;
      
      // If callback provided, use it
      if (onQuestionGenerated) {
        onQuestionGenerated(title, content);
      } else {
        // Otherwise add directly
        addQuestion(title, content);
      }
      
      toast({
        title: "Success",
        description: "AI-generated question created successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate question with AI",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleGenerateQuestion}
      disabled={isLoading || !user}
      className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <DualText textKey="generating" />
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          <DualText textKey="generateAIQuestion" />
        </>
      )}
    </Button>
  );
};

export default AIQuestionButton;
