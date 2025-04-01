
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import NewsletterSignup from "@/components/NewsletterSignup";
import { useQA } from "@/context/QAContext";
import { QuestionCategory } from "@/types/qa";
import FilterControls from "@/components/browse/FilterControls";
import EasterEggToggle from "@/components/browse/EasterEggToggle";
import QuestionsContainer from "@/components/browse/QuestionsContainer";
import EasterEggNotification from "@/components/browse/EasterEggNotification";
import ContributionPrompt from "@/components/browse/ContributionPrompt";

const Browse = () => {
  const { questions, answers, hasContributed, resetVoteCount, user } = useQA();
  const [selectedSort, setSelectedSort] = useState<"recent" | "popular">("recent");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const navigate = useNavigate();
  const [easterEggMode, setEasterEggMode] = useState<boolean>(false);
  
  const categories: QuestionCategory[] = [
    'science',
    'history',
    'technology',
    'culture',
    'education',
    'nature',
    'sports',
    'entertainment',
    'food',
    'travel',
    'business',
    'health',
    'art',
    'language',
    'surprise'
  ];

  const filteredQuestions = questions.filter(q => 
    (!selectedCategory || selectedCategory === "all" || q.category === selectedCategory)
  );
  
  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    if (selectedSort === "recent") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      return b.upvotes - a.upvotes;
    }
  });
  
  const handleQuestionClick = (questionId: string) => {
    navigate(`/question/${questionId}`);
  };

  const toggleEasterEggMode = () => {
    setEasterEggMode(!easterEggMode);
    
    if (!easterEggMode) {
      const audio = new Audio("https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3");
      audio.volume = 0.2;
      audio.play().catch(err => console.log("Audio couldn't play: ", err));
    }
  };
  
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-qa-text flex items-center justify-between">
          Skoða spurningar
          <EasterEggToggle
            isEasterEggMode={easterEggMode}
            onToggle={toggleEasterEggMode}
          />
        </h1>
        
        {!hasContributed ? (
          <ContributionPrompt onContributeClick={() => navigate("/contribute")} />
        ) : (
          <>
            <FilterControls
              selectedSort={selectedSort}
              setSelectedSort={setSelectedSort}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              categories={categories}
              resetVoteCount={resetVoteCount}
              isAdmin={user?.isAdmin}
            />
            
            <QuestionsContainer
              questions={sortedQuestions}
              easterEggMode={easterEggMode}
              onQuestionClick={handleQuestionClick}
            />
            
            <div className="mt-12">
              <NewsletterSignup />
            </div>
            
            <EasterEggNotification isVisible={easterEggMode} />
          </>
        )}
      </div>
    </Layout>
  );
};

export default Browse;
