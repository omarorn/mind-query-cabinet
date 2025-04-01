
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useQA } from "@/context/QAContext";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/components/ui/use-toast";
import DualText from "@/components/DualText";

interface AnswerFormProps {
  questionId: string;
}

const AnswerForm: React.FC<AnswerFormProps> = ({ questionId }) => {
  const { user, addAnswer } = useQA();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [newAnswer, setNewAnswer] = useState("");
  
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
    
    addAnswer(questionId, newAnswer.trim());
    setNewAnswer("");
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
        <Button type="submit">
          <DualText textKey="submitAnswer" />
        </Button>
      </form>
    </div>
  );
};

export default AnswerForm;
