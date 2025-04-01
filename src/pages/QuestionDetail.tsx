
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useQA } from "@/context/QAContext";
import AnswerCard from "@/components/AnswerCard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";

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
          <h1 className="text-3xl font-bold mb-4">Question Not Found</h1>
          <p className="text-gray-600 mb-6">
            The question you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/browse")}>
            Back to Questions
          </Button>
        </div>
      </Layout>
    );
  }
  
  const questionAnswers = answers.filter(a => a.questionId === id)
    .sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
  
  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to answer questions",
        variant: "destructive"
      });
      return;
    }
    
    if (!newAnswer.trim()) {
      toast({
        title: "Error",
        description: "Please enter an answer",
        variant: "destructive"
      });
      return;
    }
    
    addAnswer(question.id, newAnswer.trim());
    setNewAnswer("");
  };
  
  const handleVote = (voteType: 'up' | 'down') => {
    if (!user) return;
    voteQuestion(question.id, voteType);
  };
  
  const formattedDate = new Date(question.createdAt).toLocaleDateString();
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="outline" 
          onClick={() => navigate("/browse")}
          className="mb-6"
        >
          Back to Questions
        </Button>
        
        <div className="qa-card mb-8">
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center space-y-1">
              <button
                onClick={() => handleVote('up')}
                disabled={!user}
                className={cn(
                  "p-1 rounded hover:bg-gray-100 transition-colors", 
                  question.userVote === 'up' && "text-qa-primary"
                )}
              >
                <ThumbsUp size={20} />
              </button>
              <span className="text-lg font-medium">
                {question.upvotes - question.downvotes}
              </span>
              <button
                onClick={() => handleVote('down')}
                disabled={!user}
                className={cn(
                  "p-1 rounded hover:bg-gray-100 transition-colors", 
                  question.userVote === 'down' && "text-qa-secondary"
                )}
              >
                <ThumbsDown size={20} />
              </button>
            </div>
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-3">{question.title}</h1>
              <p className="text-gray-700 mb-6 whitespace-pre-line">{question.content}</p>
              <div className="text-sm text-gray-500">
                Asked by <span className="font-medium">{question.authorName}</span> on {formattedDate}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {questionAnswers.length} {questionAnswers.length === 1 ? "Answer" : "Answers"}
          </h2>
          
          {questionAnswers.length > 0 ? (
            <div className="space-y-4">
              {questionAnswers.map(answer => (
                <AnswerCard key={answer.id} answer={answer} />
              ))}
            </div>
          ) : (
            <div className="qa-card text-center py-8">
              <p className="text-gray-600">No answers yet. Be the first to answer!</p>
            </div>
          )}
        </div>
        
        {user && (
          <div className="qa-card">
            <h2 className="text-xl font-semibold mb-4">Your Answer</h2>
            <form onSubmit={handleSubmitAnswer}>
              <Textarea
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                placeholder="Write your answer here..."
                rows={6}
                className="mb-4"
                required
              />
              <Button type="submit">Submit Answer</Button>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default QuestionDetail;
