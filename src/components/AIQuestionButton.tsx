
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
        title: "Villa",
        description: "Þú þarft að vera skráður inn til að búa til gervigreindar spurningar",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const prompt = magicMode 
        ? "Búðu til fyndna, aðeins absúrda spurningu fyrir spurningasíðu. Gerðu hana húmorística en samt að einhverju leyti fræðandi. Hver hluti þarf að vera vel aðgreindur með 'Titill:', 'Spurning:', 'Heimild:' og 'Mynd:' merkingum."
        : "Búðu til áhugaverða spurningu fyrir spurningasíðu. Hver hluti þarf að vera vel aðgreindur með 'Titill:', 'Spurning:', 'Heimild:' og 'Mynd:' merkingum.";
      
      const result = await generateQuestionWithAI(prompt);
      
      if (!result) {
        throw new Error("Tókst ekki að búa til spurningu");
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
        title: magicMode ? "Húrra fyrir galdri!" : "Vel gert!",
        description: magicMode 
          ? "Töfrakennda, fyndin spurning hefur birst!" 
          : "Gervigreindar spurning búin til!",
      });
    } catch (error) {
      toast({
        title: "Villa",
        description: "Mistókst að búa til spurningu með gervigreind",
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
