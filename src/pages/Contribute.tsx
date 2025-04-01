import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useQA } from "@/context/QAContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import AttachmentInput from "@/components/AttachmentInput";
import DualText from "@/components/DualText";
import AIQuestionButton from "@/components/AIQuestionButton";
import MagicButton from "@/components/MagicButton";
import { generateAnswerWithAI } from "@/utils/aiUtils";

const Contribute = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
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
  const { t } = useLanguage();
  
  const [name, setName] = useState("");
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
  const [magicMode, setMagicMode] = useState(false);
  
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter your name",
        variant: "destructive"
      });
      return;
    }
    createUser(name.trim());
  };
  
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
      questionAttachment
    );
    
    setQuestionTitle("");
    setQuestionContent("");
    setQuestionArticle("");
    setQuestionAttachment(null);
    
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

  const handleAIQuestionGenerated = (title: string, content: string) => {
    setQuestionTitle(title);
    setQuestionContent(content);
    setActiveTab("question");
  };

  const handleMagicMode = () => {
    setMagicMode(true);
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
        <h1 className="text-3xl font-bold mb-6 text-qa-text">
          <DualText textKey="contributeTitle" className="block" />
        </h1>
        
        {!user ? (
          <div className="qa-card">
            <h2 className="text-xl font-semibold mb-4">
              <DualText textKey="getStarted" />
            </h2>
            <form onSubmit={handleCreateUser}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  <DualText textKey="yourName" />
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("enterYourName").en}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                <DualText textKey="createAccount" />
              </Button>
            </form>
          </div>
        ) : (
          <>
            <div className="qa-card mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">
                  <DualText textKey="yourContributions" />
                </h2>
                <div className="text-sm bg-qa-primary/10 text-qa-primary px-3 py-1 rounded-full">
                  {userQuestionCount + userAnswerCount}/3 <DualText textKey="required" />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 p-4 border rounded-md bg-gray-50">
                  <div className="text-2xl font-bold text-qa-primary">{userQuestionCount}</div>
                  <DualText textKey="questions" className="text-gray-600" />
                </div>
                <div className="flex-1 p-4 border rounded-md bg-gray-50">
                  <div className="text-2xl font-bold text-qa-secondary">{userAnswerCount}</div>
                  <DualText textKey="answers" className="text-gray-600" />
                </div>
                <div className="flex-1 p-4 border rounded-md bg-gray-50">
                  <div className="text-2xl font-bold text-qa-accent">
                    <DualText textKey={hasContributed ? "yes" : "notYet"} />
                  </div>
                  <DualText textKey="fullAccess" className="text-gray-600" />
                </div>
              </div>
              
              {hasContributed && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md text-green-800">
                  <p className="font-medium">
                    <DualText textKey="congratulations" />
                  </p>
                  <p>
                    <DualText textKey="contributionComplete" />
                  </p>
                </div>
              )}

              <div className="mt-6">
                <AIQuestionButton onQuestionGenerated={handleAIQuestionGenerated} magicMode={magicMode} />
              </div>
            </div>
            
            <div className="qa-card">
              <div className="flex border-b mb-6">
                <button
                  className={`px-4 py-2 font-medium ${
                    activeTab === "question" 
                      ? "border-b-2 border-qa-primary text-qa-primary" 
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("question")}
                >
                  <DualText textKey="askQuestion" />
                </button>
                <button
                  className={`px-4 py-2 font-medium ${
                    activeTab === "answer" 
                      ? "border-b-2 border-qa-primary text-qa-primary" 
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("answer")}
                >
                  <DualText textKey="answerQuestion" />
                </button>
              </div>
              
              {activeTab === "question" ? (
                <form onSubmit={handleAddQuestion}>
                  <div className="mb-4">
                    <label htmlFor="questionTitle" className="block text-sm font-medium text-gray-700 mb-1">
                      <DualText textKey="questionTitle" />
                    </label>
                    <Input
                      id="questionTitle"
                      value={questionTitle}
                      onChange={(e) => setQuestionTitle(e.target.value)}
                      placeholder={t("questionTitlePlaceholder").en}
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="questionContent" className="block text-sm font-medium text-gray-700 mb-1">
                      <DualText textKey="questionDetails" />
                    </label>
                    <Textarea
                      id="questionContent"
                      value={questionContent}
                      onChange={(e) => setQuestionContent(e.target.value)}
                      placeholder={t("questionDetailsPlaceholder").en}
                      rows={5}
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="questionArticle" className="block text-sm font-medium text-gray-700 mb-1">
                      <DualText textKey="articleFacts" />
                    </label>
                    <Textarea
                      id="questionArticle"
                      value={questionArticle}
                      onChange={(e) => setQuestionArticle(e.target.value)}
                      placeholder={t("articleFactsPlaceholder").en}
                      rows={3}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      <DualText textKey="articleFactsHelp" />
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <DualText textKey="attachments" />
                    </label>
                    <AttachmentInput 
                      onAttachmentChange={setQuestionAttachment} 
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    <DualText textKey="submitQuestion" />
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleAddAnswer}>
                  <div className="mb-4">
                    <label htmlFor="questionSelect" className="block text-sm font-medium text-gray-700 mb-1">
                      <DualText textKey="selectQuestion" />
                    </label>
                    <select
                      id="questionSelect"
                      value={selectedQuestionId}
                      onChange={(e) => setSelectedQuestionId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qa-primary"
                      required
                    >
                      <option value="">{t("selectQuestionPlaceholder").en}</option>
                      {questions.map(question => (
                        <option key={question.id} value={question.id}>
                          {question.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {magicMode && selectedQuestionId && (
                    <div className="mb-4">
                      <Button 
                        type="button" 
                        onClick={handleGenerateAnswer}
                        className="w-full mb-4 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
                      >
                        <Laugh className="mr-2 h-4 w-4" />
                        <DualText textKey="generateMagicAnswer" />
                      </Button>
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <label htmlFor="answerContent" className="block text-sm font-medium text-gray-700 mb-1">
                      <DualText textKey="yourAnswer" />
                    </label>
                    <Textarea
                      id="answerContent"
                      value={answerContent}
                      onChange={(e) => setAnswerContent(e.target.value)}
                      placeholder={t("yourAnswerPlaceholder").en}
                      rows={5}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    <DualText textKey="submitAnswer" />
                  </Button>
                </form>
              )}
            </div>
          </>
        )}
        
        <MagicButton onClick={handleMagicMode} />
      </div>
    </Layout>
  );
};

export default Contribute;
