
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useQA } from "@/context/QAContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

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
  
  const [name, setName] = useState("");
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionContent, setQuestionContent] = useState("");
  const [selectedQuestionId, setSelectedQuestionId] = useState("");
  const [answerContent, setAnswerContent] = useState("");
  const [activeTab, setActiveTab] = useState("question");
  
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
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    addQuestion(questionTitle.trim(), questionContent.trim());
    setQuestionTitle("");
    setQuestionContent("");
    
    if (userQuestionCount + userAnswerCount + 1 >= 3) {
      navigate("/browse");
    }
  };
  
  const handleAddAnswer = (e: React.FormEvent) => {
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
  
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-qa-text">Contribute to Q&A Exchange</h1>
        
        {!user ? (
          <div className="qa-card">
            <h2 className="text-xl font-semibold mb-4">Get Started</h2>
            <form onSubmit={handleCreateUser}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                />
              </div>
              <Button type="submit" className="w-full">Create Account</Button>
            </form>
          </div>
        ) : (
          <>
            <div className="qa-card mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Your Contributions</h2>
                <div className="text-sm bg-qa-primary/10 text-qa-primary px-3 py-1 rounded-full">
                  {userQuestionCount + userAnswerCount}/3 Required
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 p-4 border rounded-md bg-gray-50">
                  <div className="text-2xl font-bold text-qa-primary">{userQuestionCount}</div>
                  <div className="text-gray-600">Questions</div>
                </div>
                <div className="flex-1 p-4 border rounded-md bg-gray-50">
                  <div className="text-2xl font-bold text-qa-secondary">{userAnswerCount}</div>
                  <div className="text-gray-600">Answers</div>
                </div>
                <div className="flex-1 p-4 border rounded-md bg-gray-50">
                  <div className="text-2xl font-bold text-qa-accent">
                    {hasContributed ? "Yes" : "Not Yet"}
                  </div>
                  <div className="text-gray-600">Full Access</div>
                </div>
              </div>
              
              {hasContributed && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md text-green-800">
                  <p className="font-medium">Congratulations!</p>
                  <p>You've contributed enough to gain full access to all Q&A content.</p>
                </div>
              )}
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
                  Ask a Question
                </button>
                <button
                  className={`px-4 py-2 font-medium ${
                    activeTab === "answer" 
                      ? "border-b-2 border-qa-primary text-qa-primary" 
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("answer")}
                >
                  Answer a Question
                </button>
              </div>
              
              {activeTab === "question" ? (
                <form onSubmit={handleAddQuestion}>
                  <div className="mb-4">
                    <label htmlFor="questionTitle" className="block text-sm font-medium text-gray-700 mb-1">
                      Question Title
                    </label>
                    <Input
                      id="questionTitle"
                      value={questionTitle}
                      onChange={(e) => setQuestionTitle(e.target.value)}
                      placeholder="e.g. How do I improve my programming skills?"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="questionContent" className="block text-sm font-medium text-gray-700 mb-1">
                      Question Details
                    </label>
                    <Textarea
                      id="questionContent"
                      value={questionContent}
                      onChange={(e) => setQuestionContent(e.target.value)}
                      placeholder="Provide more details about your question..."
                      rows={5}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">Submit Question</Button>
                </form>
              ) : (
                <form onSubmit={handleAddAnswer}>
                  <div className="mb-4">
                    <label htmlFor="questionSelect" className="block text-sm font-medium text-gray-700 mb-1">
                      Select a Question
                    </label>
                    <select
                      id="questionSelect"
                      value={selectedQuestionId}
                      onChange={(e) => setSelectedQuestionId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qa-primary"
                      required
                    >
                      <option value="">Select a question to answer</option>
                      {questions.map(question => (
                        <option key={question.id} value={question.id}>
                          {question.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="answerContent" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Answer
                    </label>
                    <Textarea
                      id="answerContent"
                      value={answerContent}
                      onChange={(e) => setAnswerContent(e.target.value)}
                      placeholder="Write your answer here..."
                      rows={5}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">Submit Answer</Button>
                </form>
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Contribute;
