import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { useQA } from "@/context/QAContext";
import QuestionCard from "@/components/QuestionCard";

const Index = () => {
  const { hasContributed, questions } = useQA();
  
  // Get top 3 questions based on votes
  const topQuestions = [...questions]
    .sort((a, b) => b.upvotes - a.upvotes)
    .slice(0, 3);
  
  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-qa-text">Welcome to Q&A Exchange</h1>
          <p className="text-xl text-gray-600 mb-8">
            Contribute 3 questions or answers to unlock full access to our knowledge base.
          </p>
          <Link to="/contribute" className="qa-button">
            Start Contributing
          </Link>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="qa-card">
            <h2 className="text-2xl font-semibold mb-4 text-qa-primary">How It Works</h2>
            <ol className="space-y-4 list-decimal list-inside text-gray-700">
              <li>Create an account with your name</li>
              <li>Contribute 3 questions or answers</li>
              <li>Gain full access to all content</li>
              <li>Vote on the best questions and answers</li>
            </ol>
          </div>
          
          <div className="qa-card">
            <h2 className="text-2xl font-semibold mb-4 text-qa-secondary">Why Contribute?</h2>
            <ul className="space-y-4 list-disc list-inside text-gray-700">
              <li>Share your knowledge with others</li>
              <li>Help build a valuable resource</li>
              <li>Learn from a diverse community</li>
              <li>Earn recognition for quality content</li>
            </ul>
          </div>
        </div>
        
        {topQuestions.length > 0 && (
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Top Questions</h2>
              {hasContributed && (
                <Link to="/browse" className="text-qa-primary hover:underline">
                  View All Questions
                </Link>
              )}
            </div>
            
            <div className="space-y-4">
              {topQuestions.map(question => (
                <QuestionCard key={question.id} question={question} />
              ))}
            </div>
            
            {!hasContributed && (
              <div className="mt-6 text-center">
                <p className="text-gray-600 mb-4">
                  Want to see more questions? Contribute to unlock all content!
                </p>
                <Link to="/contribute" className="qa-button">
                  Contribute Now
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Index;
