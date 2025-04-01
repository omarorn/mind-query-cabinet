
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import QuestionCard from "@/components/QuestionCard";
import { useQA } from "@/context/QAContext";
import { Button } from "@/components/ui/button";
import DualText from "@/components/DualText";
import { useLanguage } from "@/context/LanguageContext";

const Browse = () => {
  const { questions, answers, hasContributed, resetVoteCount, postQuestion, user } = useQA();
  const [selectedSort, setSelectedSort] = useState<"recent" | "popular">("recent");
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  // Filter questions if needed based on hasContributed
  const sortedQuestions = [...questions].sort((a, b) => {
    if (selectedSort === "recent") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      // Sort by upvotes only
      return b.upvotes - a.upvotes;
    }
  });
  
  const handleQuestionClick = (questionId: string) => {
    navigate(`/question/${questionId}`);
  };
  
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-qa-text">
          <DualText textKey="browseQuestions" className="block" />
        </h1>
        
        {!hasContributed ? (
          <div className="qa-card text-center py-8">
            <h2 className="text-xl font-semibold mb-2">
              <DualText textKey="contributionRequired" />
            </h2>
            <p className="mb-4 text-gray-600">
              <DualText textKey="contributionRequiredDesc" />
            </p>
            <Button onClick={() => navigate("/contribute")}>
              <DualText textKey="startContributing" />
            </Button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-4">
                <Button
                  variant={selectedSort === "recent" ? "default" : "outline"}
                  onClick={() => setSelectedSort("recent")}
                >
                  <DualText textKey="recent" />
                </Button>
                <Button
                  variant={selectedSort === "popular" ? "default" : "outline"}
                  onClick={() => setSelectedSort("popular")}
                >
                  <DualText textKey="popular" />
                </Button>
              </div>
              
              {user?.isAdmin && (
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={resetVoteCount}
                  >
                    Reset Vote Count
                  </Button>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              {sortedQuestions.length > 0 ? (
                sortedQuestions.map((question) => (
                  <div key={question.id} onClick={() => handleQuestionClick(question.id)} className="cursor-pointer">
                    <QuestionCard question={question} showContent={false} />
                    
                    {user?.isAdmin && (
                      <div className="mt-2 flex justify-end">
                        {answers.some(a => a.questionId === question.id) && (
                          <Button 
                            size="sm" 
                            variant={question.posted ? "outline" : "default"} 
                            onClick={(e) => {
                              e.stopPropagation();
                              const answer = answers.find(a => a.questionId === question.id);
                              if (answer) {
                                postQuestion(question.id, answer.id);
                              }
                            }}
                            disabled={question.posted}
                          >
                            {question.posted ? "Already Posted" : "Post to Creatomate"}
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="qa-card text-center py-8">
                  <p className="text-gray-600">
                    <DualText textKey="noQuestionsFound" />
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Browse;
