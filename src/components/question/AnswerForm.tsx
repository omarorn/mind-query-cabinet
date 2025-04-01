
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useQA } from "@/context/QAContext";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/components/ui/use-toast";
import DualText from "@/components/DualText";
import { Loader2, Check, BrainCircuit } from "lucide-react";
import { factCheckAnswer, simplifyForChildren } from "@/utils/simplifyUtils";

interface AnswerFormProps {
  questionId: string;
}

const AnswerForm: React.FC<AnswerFormProps> = ({ questionId }) => {
  const { user, addAnswer, questions } = useQA();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [newAnswer, setNewAnswer] = useState("");
  const [isFactChecking, setIsFactChecking] = useState(false);
  const [factCheckResult, setFactCheckResult] = useState<string | null>(null);
  const [isSimplifying, setIsSimplifying] = useState(false);
  const [simplifiedQuestion, setSimplifiedQuestion] = useState<string | null>(null);
  const [simplifiedAnswer, setSimplifiedAnswer] = useState<string | null>(null);
  
  const question = questions.find(q => q.id === questionId);
  
  const handleFactCheck = async () => {
    if (!question || !newAnswer.trim()) {
      toast({
        title: "Error",
        description: t("enterAnswer").en,
        variant: "destructive"
      });
      return;
    }
    
    setIsFactChecking(true);
    try {
      const result = await factCheckAnswer(question.title, newAnswer.trim());
      setFactCheckResult(result);
      toast({
        title: "Fact Check Complete",
        description: "The answer has been fact-checked",
      });
    } catch (error) {
      console.error("Error fact-checking:", error);
      toast({
        title: "Error",
        description: "Failed to fact-check the answer",
        variant: "destructive"
      });
    } finally {
      setIsFactChecking(false);
    }
  };
  
  const handleSimplify = async () => {
    if (!question || !newAnswer.trim()) {
      toast({
        title: "Error",
        description: t("enterAnswer").en,
        variant: "destructive"
      });
      return;
    }
    
    setIsSimplifying(true);
    try {
      const [simplifiedQ, simplifiedA] = await Promise.all([
        simplifyForChildren(question.title),
        simplifyForChildren(newAnswer.trim())
      ]);
      
      setSimplifiedQuestion(simplifiedQ);
      setSimplifiedAnswer(simplifiedA);
      
      toast({
        title: "Simplification Complete",
        description: "The question and answer have been simplified for children",
      });
    } catch (error) {
      console.error("Error simplifying:", error);
      toast({
        title: "Error",
        description: "Failed to simplify the text",
        variant: "destructive"
      });
    } finally {
      setIsSimplifying(false);
    }
  };
  
  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Error",
        description: t("mustBeLoggedIn").en,
        variant: "destructive"
      });
      return;
    }
    
    if (!newAnswer.trim()) {
      toast({
        title: "Error",
        description: t("enterAnswer").en,
        variant: "destructive"
      });
      return;
    }
    
    // Add metadata to the answer if available
    const metadata = {
      factCheck: factCheckResult,
      simplifiedQuestion,
      simplifiedAnswer
    };
    
    addAnswer(questionId, newAnswer.trim(), metadata);
    setNewAnswer("");
    setFactCheckResult(null);
    setSimplifiedQuestion(null);
    setSimplifiedAnswer(null);
  };

  if (!user) return null;

  return (
    <div className="qa-card">
      <h2 className="text-xl font-semibold mb-4">
        <DualText textKey="yourAnswer" />
      </h2>
      <form onSubmit={handleSubmitAnswer}>
        <Textarea
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
          placeholder={t("yourAnswerPlaceholder").en}
          rows={6}
          className="mb-4"
          required
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="p-4 border rounded-md bg-gray-50">
            <h3 className="text-md font-medium mb-2">Fact Check</h3>
            
            {factCheckResult ? (
              <div className="bg-white p-3 rounded border mb-3 text-sm">
                <div className="flex items-center mb-1">
                  <Check className="h-4 w-4 text-green-500 mr-1" />
                  <span className="font-medium">Fact Check Result:</span>
                </div>
                <p>{factCheckResult}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-600 mb-3">
                Verify the accuracy of your answer with AI fact-checking.
              </p>
            )}
            
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleFactCheck}
              disabled={isFactChecking || !newAnswer.trim()}
              className="w-full"
            >
              {isFactChecking ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking Facts...
                </>
              ) : (
                <>Fact Check Answer</>
              )}
            </Button>
          </div>
          
          <div className="p-4 border rounded-md bg-gray-50">
            <h3 className="text-md font-medium mb-2">Child-Friendly Version</h3>
            
            {simplifiedQuestion && simplifiedAnswer ? (
              <div className="bg-white p-3 rounded border mb-3 text-sm">
                <p className="font-medium">For Kids:</p>
                <p className="mb-2 italic">{simplifiedQuestion}</p>
                <p>{simplifiedAnswer}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-600 mb-3">
                Create a simplified version that a 7-year-old can understand.
              </p>
            )}
            
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleSimplify}
              disabled={isSimplifying || !newAnswer.trim()}
              className="w-full"
            >
              {isSimplifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Simplifying...
                </>
              ) : (
                <>
                  <BrainCircuit className="mr-2 h-4 w-4" />
                  Simplify for Kids
                </>
              )}
            </Button>
          </div>
        </div>
        
        {(simplifiedQuestion || factCheckResult) && (
          <div className="bg-purple-50 border border-purple-200 p-3 rounded-md mb-4">
            <p className="text-sm text-purple-700">
              Your answer will be submitted with the additional information you've generated.
            </p>
          </div>
        )}
        
        <Button type="submit">
          <DualText textKey="submitAnswer" />
        </Button>
      </form>
    </div>
  );
};

export default AnswerForm;
