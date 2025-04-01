import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, Laugh } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { generateQuestionWithAI } from "@/utils/aiUtils";
import { useQA } from "@/context/QAContext";
import { useLanguage } from "@/context/LanguageContext";
import DualText from "./DualText";

interface AIQuestionButtonProps {
  onQuestionGenerated?: (title: string, content: string, source?: string, imageUrl?: string) => void;
  magicMode?: boolean;
}

const AIQuestionButton: React.FC<AIQuestionButtonProps> = ({ 
  onQuestionGenerated,
  magicMode = false
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
      const prompt = magicMode 
        ? "Generate a funny, slightly absurd question for a Q&A platform. Make it humorous but still somewhat educational. Include both a catchy title and detailed content."
        : "Generate an interesting question for a Q&A platform";
      
      const result = await generateQuestionWithAI(prompt);
      
      if (!result) {
        throw new Error("Failed to generate question");
      }
      
      const { title, content, source, imageUrl } = result;
      
      // If callback provided, use it
      if (onQuestionGenerated) {
        onQuestionGenerated(title, content, source, imageUrl);
      } else {
        // Otherwise add directly
        addQuestion(title, content, undefined, null, source, imageUrl);
      }
      
      toast({
        title: magicMode ? "Magic Success!" : "Success",
        description: magicMode 
          ? "A magical, funny question has appeared!" 
          : "AI-generated question created successfully!",
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
      className={`w-full ${magicMode 
        ? "bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600" 
        : "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"}`}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <DualText textKey="generating" />
        </>
      ) : (
        <>
          {magicMode ? (
            <Laugh className="mr-2 h-4 w-4" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          <DualText textKey={magicMode ? "magicQuestion" : "generateAIQuestion"} />
        </>
      )}
    </Button>
  );
};

export default AIQuestionButton;
