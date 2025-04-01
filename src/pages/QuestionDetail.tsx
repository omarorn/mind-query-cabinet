import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useQA } from "@/context/QAContext";
import AnswerCard from "@/components/AnswerCard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ThumbsUp, File, FileVideo, Link, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import DualText from "@/components/DualText";
import { useLanguage } from "@/context/LanguageContext";
import AdminControls from "@/components/AdminControls";

const QuestionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    questions, 
    answers, 
    user, 
    hasContributed, 
    addAnswer, 
    voteQuestion 
  } = useQA();
  const { t } = useLanguage();
  
  const [newAnswer, setNewAnswer] = useState("");
  
  if (!hasContributed) {
    navigate("/contribute");
    return null;
  }
  
  const question = questions.find(q => q.id === id);
  
  if (!question) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">
            <DualText textKey="questionNotFound" />
          </h1>
          <p className="text-gray-600 mb-6">
            <DualText textKey="questionNotFoundDesc" />
          </p>
          <Button onClick={() => navigate("/browse")}>
            <DualText textKey="backToQuestions" />
          </Button>
        </div>
      </Layout>
    );
  }
  
  const questionAnswers = answers.filter(a => a.questionId === id)
    .sort((a, b) => b.upvotes - a.upvotes);
  
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
    
    addAnswer(question.id, newAnswer.trim());
    setNewAnswer("");
  };
  
  const handleVote = () => {
    if (!user) return;
    voteQuestion(question.id, 'up');
  };
  
  const formattedDate = new Date(question.createdAt).toLocaleDateString();
  
  const renderAttachment = () => {
    if (!question.attachment) return null;
    
    const { type, url, name } = question.attachment;
    const displayName = name || url;
    
    return (
      <div className="mt-4 p-3 bg-gray-50 border rounded-md">
        <div className="flex items-center mb-2">
          {type === 'file' && <File className="h-5 w-5 mr-2 text-blue-500" />}
          {type === 'video' && <FileVideo className="h-5 w-5 mr-2 text-red-500" />}
          {type === 'link' && <Link className="h-5 w-5 mr-2 text-green-500" />}
          <span className="font-medium">
            <DualText textKey={type === 'file' ? "fileAttachment" : type === 'video' ? "videoAttachment" : "linkAttachment"} />
          </span>
        </div>
        
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center text-qa-primary hover:underline"
        >
          <span className="truncate">{displayName}</span>
          <ExternalLink className="h-4 w-4 ml-1" />
        </a>
      </div>
    );
  };
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="outline" 
          onClick={() => navigate("/browse")}
          className="mb-6"
        >
          <DualText textKey="backToQuestions" />
        </Button>
        
        <div className="qa-card mb-8">
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center space-y-1">
              <button
                onClick={handleVote}
                disabled={!user}
                className={cn(
                  "p-1 rounded hover:bg-gray-100 transition-colors", 
                  question.userVote === 'up' && "text-qa-primary"
                )}
              >
                <ThumbsUp size={20} />
              </button>
              <span className="text-lg font-medium">
                {question.upvotes}
              </span>
            </div>
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-3">{question.title}</h1>
              <p className="text-gray-700 mb-4 whitespace-pre-line">{question.content}</p>
              
              {renderAttachment()}
              
              {question.article && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <h3 className="text-lg font-semibold mb-2 text-blue-800">
                    <DualText textKey="articleFacts" />
                  </h3>
                  <p className="text-gray-800 whitespace-pre-line">{question.article}</p>
                </div>
              )}
              
              <div className="text-sm text-gray-500 mt-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    {t("askedBy").en} <span className="font-medium">{question.authorName}</span> {t("on").en} {formattedDate}
                  </div>
                  <div>
                    {t("askedBy").is} <span className="font-medium">{question.authorName}</span> {t("on").is} {formattedDate}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {questionAnswers.length} <DualText textKey={questionAnswers.length === 1 ? "answer" : "answers"} />
          </h2>
          
          {questionAnswers.length > 0 ? (
            <div className="space-y-4">
              {questionAnswers.map(answer => (
                <AnswerCard key={answer.id} answer={answer} />
              ))}
            </div>
          ) : (
            <div className="qa-card text-center py-8">
              <p className="text-gray-600">
                <DualText textKey="noAnswersYet" />
              </p>
            </div>
          )}
        </div>
        
        {user && (
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
        )}
        
        {user?.isAdmin && (
          <AdminControls question={question} answers={questionAnswers} />
        )}
      </div>
    </Layout>
  );
};

export default QuestionDetail;
