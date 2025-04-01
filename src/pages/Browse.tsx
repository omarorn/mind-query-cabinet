
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useQA } from "@/context/QAContext";
import QuestionCard from "@/components/QuestionCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Browse = () => {
  const navigate = useNavigate();
  const { questions, hasContributed, user } = useQA();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "popular">("newest");
  
  if (!hasContributed) {
    navigate("/contribute");
    return null;
  }
  
  const filteredQuestions = questions.filter(
    question => 
      question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.content.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    if (sortOrder === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
    }
  });
  
  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-qa-text">Browse Questions</h1>
          {user && (
            <Button onClick={() => navigate("/contribute")} className="whitespace-nowrap">
              Ask a Question
            </Button>
          )}
        </div>
        
        <div className="qa-card mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "newest" | "popular")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qa-primary"
              >
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>
        </div>
        
        {sortedQuestions.length > 0 ? (
          <div className="space-y-4">
            {sortedQuestions.map(question => (
              <QuestionCard key={question.id} question={question} />
            ))}
          </div>
        ) : (
          <div className="qa-card text-center py-12">
            <h2 className="text-xl font-semibold mb-2">No Questions Found</h2>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? "No questions match your search criteria" 
                : "Be the first to ask a question!"}
            </p>
            <Button onClick={() => navigate("/contribute")}>
              Ask a Question
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Browse;
