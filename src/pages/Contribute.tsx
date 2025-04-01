
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useQA } from "@/context/QAContext";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/context/LanguageContext";
import MagicButton from "@/components/MagicButton";
import UserCreationForm from "@/components/contribute/UserCreationForm";
import ContributionStats from "@/components/contribute/ContributionStats";
import ContributionTabs from "@/components/contribute/ContributionTabs";
import APIKeyInput from "@/components/APIKeyInput";
import LoginForm from "@/components/LoginForm";
import { generateAnswerWithAI } from "@/utils/aiUtils";
import { hasGeminiKey } from "@/utils/keyUtils";

const Contribute = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const { 
    user, 
    createUser, 
    addQuestion, 
    addAnswer, 
    questions, 
    userQuestionCount, 
    userAnswerCount, 
    hasContributed 
  } = useQA();
  
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionContent, setQuestionContent] = useState("");
  const [selectedQuestionId, setSelectedQuestionId] = useState("");
  const [answerContent, setAnswerContent] = useState("");
  const [activeTab, setActiveTab] = useState("question");
  const [questionArticle, setQuestionArticle] = useState("");
  const [questionAttachment, setQuestionAttachment] = useState<{
    type: 'file' | 'video' | 'link';
    url: string;
    name?: string;
  } | null>(null);
  const [questionSource, setQuestionSource] = useState("");
  const [questionImageUrl, setQuestionImageUrl] = useState("");
  const [questionCategory, setQuestionCategory] = useState("");
  const [magicMode, setMagicMode] = useState(false);
  
  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionTitle.trim() || !questionContent.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    addQuestion(
      questionTitle.trim(), 
      questionContent.trim(), 
      questionArticle.trim() || undefined,
      questionAttachment,
      questionSource.trim() || undefined,
      questionImageUrl.trim() || undefined,
      questionCategory || undefined
    );
    
    setQuestionTitle("");
    setQuestionContent("");
    setQuestionArticle("");
    setQuestionAttachment(null);
    setQuestionSource("");
    setQuestionImageUrl("");
    setQuestionCategory("");
    
    if (userQuestionCount + userAnswerCount + 1 >= 3) {
      navigate("/browse");
    }
  };
  
  const handleAddAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuestionId || !answerContent.trim()) {
      toast({
        title: "Error",
        description: "Please select a question and enter your answer",
        variant: "destructive"
      });
      return;
    }
    
    addAnswer(selectedQuestionId, answerContent.trim());
    setSelectedQuestionId("");
    setAnswerContent("");
    
    if (userQuestionCount + userAnswerCount + 1 >= 3) {
      navigate("/browse");
    }
  };

  const handleAIQuestionGenerated = (title: string, content: string, source?: string, imageUrl?: string) => {
    setQuestionTitle(title);
    setQuestionContent(content);
    setQuestionSource(source || "");
    setQuestionImageUrl(imageUrl || "");
    
    // Randomly assign a category to AI-generated questions
    const categories = ['science', 'history', 'technology', 'culture', 'education'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    setQuestionCategory(randomCategory);
    
    setActiveTab("question");
  };

  const handleMagicMode = () => {
    setMagicMode(true);
    
    // Easter egg: Change the background color momentarily when magic mode is activated
    document.body.classList.add('magic-mode-transition');
    setTimeout(() => {
      document.body.classList.remove('magic-mode-transition');
    }, 1000);
  };

  const handleGenerateAnswer = async () => {
    if (!selectedQuestionId) {
      toast({
        title: "Error",
        description: "Please select a question first",
        variant: "destructive"
      });
      return;
    }

    const selectedQuestion = questions.find(q => q.id === selectedQuestionId);
    if (!selectedQuestion) return;

    try {
      const answer = await generateAnswerWithAI(selectedQuestion.title, selectedQuestion.content);
      if (answer) {
        setAnswerContent(answer);
        toast({
          title: "Magic Answer Generated!",
          description: "The AI has crafted a witty response for you.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate an answer",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Layout>
      <div className="max-w-3xl mx-auto relative">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-qa-text">
            <div className="grid grid-cols-2 gap-2 block">
              <div className="text-left">{t("contributeTitle").en}</div>
              <div className="text-left">{t("contributeTitle").is}</div>
            </div>
          </h1>
          <LoginForm />
        </div>
        
        {!hasGeminiKey() && (
          <APIKeyInput />
        )}
        
        {!user ? (
          <UserCreationForm createUser={createUser} />
        ) : (
          <>
            <ContributionStats
              userQuestionCount={userQuestionCount}
              userAnswerCount={userAnswerCount}
              hasContributed={hasContributed}
              onQuestionGenerated={handleAIQuestionGenerated}
              magicMode={magicMode}
            />
            
            <ContributionTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              questions={questions}
              questionTitle={questionTitle}
              questionContent={questionContent}
              questionArticle={questionArticle}
              selectedQuestionId={selectedQuestionId}
              answerContent={answerContent}
              magicMode={magicMode}
              onQuestionTitleChange={setQuestionTitle}
              onQuestionContentChange={setQuestionContent}
              onQuestionArticleChange={setQuestionArticle}
              onQuestionSelect={setSelectedQuestionId}
              onAnswerChange={setAnswerContent}
              onAttachmentChange={setQuestionAttachment}
              onGenerateAnswer={handleGenerateAnswer}
              onQuestionSubmit={handleAddQuestion}
              onAnswerSubmit={handleAddAnswer}
              questionSource={questionSource}
              questionImageUrl={questionImageUrl}
              questionCategory={questionCategory}
              onQuestionSourceChange={setQuestionSource}
              onQuestionImageUrlChange={setQuestionImageUrl}
              onQuestionCategoryChange={setQuestionCategory}
            />
          </>
        )}
        
        <MagicButton onClick={handleMagicMode} />
      </div>
    </Layout>
  );
};

export default Contribute;
