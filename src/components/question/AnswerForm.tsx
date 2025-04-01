
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useQA } from "@/context/QAContext";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/components/ui/use-toast";
import DualText from "@/components/DualText";
import { Loader2, Check, BrainCircuit, Sparkles } from "lucide-react";
import { factCheckAnswer, simplifyForChildren } from "@/utils/simplifyUtils";
import { findCachedPrompt } from "@/utils/promptCache";
import TypewriterText from "@/components/TypewriterText";

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
  const [isMagicTyping, setIsMagicTyping] = useState(false);
  const [cachedAnswer, setCachedAnswer] = useState<string | null>(null);
  
  const question = questions.find(q => q.id === questionId);
  
  // Check cache for similar questions when the component mounts
  useEffect(() => {
    if (question) {
      const cached = findCachedPrompt(question.title);
      if (cached) {
        setCachedAnswer(cached);
      }
    }
  }, [question]);
  
  const handleMagicAnswer = () => {
    if (!cachedAnswer) return;
    
    setIsMagicTyping(true);
    setNewAnswer(""); // Reset existing answer
    
    // The TypewriterText component will handle the animation
  };
  
  const handleMagicComplete = () => {
    setIsMagicTyping(false);
    toast({
      title: "Töfrasvar tilbúið",
      description: "Svarið var búið til með töfrum!",
    });
  };
  
  const handleFactCheck = async () => {
    if (!question || !newAnswer.trim()) {
      toast({
        title: "Villa",
        description: t("enterAnswer").is,
        variant: "destructive"
      });
      return;
    }
    
    setIsFactChecking(true);
    try {
      const result = await factCheckAnswer(question.title, newAnswer.trim());
      setFactCheckResult(result);
      toast({
        title: "Staðreyndakönnun lokið",
        description: "Svarið hefur verið staðreyndaprófað",
      });
    } catch (error) {
      console.error("Error fact-checking:", error);
      toast({
        title: "Villa",
        description: "Ekki tókst að staðreyndaprófa svarið",
        variant: "destructive"
      });
    } finally {
      setIsFactChecking(false);
    }
  };
  
  const handleSimplify = async () => {
    if (!question || !newAnswer.trim()) {
      toast({
        title: "Villa",
        description: t("enterAnswer").is,
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
        title: "Einföldun lokið",
        description: "Spurningin og svarið hafa verið einfölduð fyrir börn",
      });
    } catch (error) {
      console.error("Error simplifying:", error);
      toast({
        title: "Villa",
        description: "Ekki tókst að einfalda textann",
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
        title: "Villa",
        description: t("mustBeLoggedIn").is,
        variant: "destructive"
      });
      return;
    }
    
    if (!newAnswer.trim()) {
      toast({
        title: "Villa",
        description: t("enterAnswer").is,
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
        {isMagicTyping && cachedAnswer ? (
          <div className="relative">
            <Textarea
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              placeholder={t("yourAnswerPlaceholder").is}
              rows={6}
              className="mb-4 invisible absolute"
            />
            <div className="min-h-[150px] p-3 border rounded-md mb-4 bg-white">
              <TypewriterText 
                text={cachedAnswer} 
                speed={40} 
                className="whitespace-pre-line"
                onComplete={handleMagicComplete} 
              />
            </div>
          </div>
        ) : (
          <Textarea
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            placeholder={t("yourAnswerPlaceholder").is}
            rows={6}
            className="mb-4"
            required
          />
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {cachedAnswer && (
            <div className="p-4 border rounded-md bg-gradient-to-r from-purple-50 to-pink-50">
              <h3 className="text-md font-medium mb-2">Töfrasvar</h3>
              <p className="text-sm text-gray-600 mb-3">
                Finndu töfrasvör við spurningunni með gervigreind.
              </p>
              <Button 
                type="button" 
                variant="outline"
                onClick={handleMagicAnswer}
                disabled={isMagicTyping}
                className="w-full bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200"
              >
                {isMagicTyping ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Vinnur töfra...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 text-purple-500" />
                    Nota töfrasvar
                  </>
                )}
              </Button>
            </div>
          )}
          
          <div className="p-4 border rounded-md bg-gray-50">
            <h3 className="text-md font-medium mb-2">Staðreyndakönnun</h3>
            
            {factCheckResult ? (
              <div className="bg-white p-3 rounded border mb-3 text-sm">
                <div className="flex items-center mb-1">
                  <Check className="h-4 w-4 text-green-500 mr-1" />
                  <span className="font-medium">Niðurstaða:</span>
                </div>
                <p>{factCheckResult}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-600 mb-3">
                Staðfestu nákvæmni svarsins með staðreyndakönnun.
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
                  Staðreyni...
                </>
              ) : (
                <>Staðreyndaprófa svar</>
              )}
            </Button>
          </div>
          
          <div className="p-4 border rounded-md bg-gray-50">
            <h3 className="text-md font-medium mb-2">Barnavæn útgáfa</h3>
            
            {simplifiedQuestion && simplifiedAnswer ? (
              <div className="bg-white p-3 rounded border mb-3 text-sm">
                <p className="font-medium">Fyrir börn:</p>
                <p className="mb-2 italic">{simplifiedQuestion}</p>
                <p>{simplifiedAnswer}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-600 mb-3">
                Einfaldaðu textann þannig að 7 ára barn skilji.
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
                  Einfalda...
                </>
              ) : (
                <>
                  <BrainCircuit className="mr-2 h-4 w-4" />
                  Einfalda fyrir börn
                </>
              )}
            </Button>
          </div>
        </div>
        
        {(simplifiedQuestion || factCheckResult) && (
          <div className="bg-purple-50 border border-purple-200 p-3 rounded-md mb-4">
            <p className="text-sm text-purple-700">
              Svarið þitt verður sent með viðbótarupplýsingunum sem þú hefur útbúið.
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
