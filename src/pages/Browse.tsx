import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import QuestionCard from "@/components/QuestionCard";
import NewsletterSignup from "@/components/NewsletterSignup";
import { useQA } from "@/context/QAContext";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QuestionCategory } from "@/types/qa";
import { motion } from "framer-motion";
import { Egg, Gift, Trash2 } from "lucide-react";

const Browse = () => {
  const { questions, answers, hasContributed, resetVoteCount, postQuestion, deleteQuestion, user } = useQA();
  const [selectedSort, setSelectedSort] = useState<"recent" | "popular">("recent");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const navigate = useNavigate();
  const [easterEggMode, setEasterEggMode] = useState<boolean>(false);
  const [eggClicks, setEggClicks] = useState(0);
  
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

  const handleEggClick = () => {
    const newCount = eggClicks + 1;
    setEggClicks(newCount);
    
    if (newCount >= 3) {
      setEasterEggMode(!easterEggMode);
      setEggClicks(0);
      
      if (!easterEggMode) {
        const audio = new Audio("https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3");
        audio.volume = 0.2;
        audio.play().catch(err => console.log("Audio couldn't play: ", err));
      }
    }
  };

  const handleDeleteQuestion = (e: React.MouseEvent, questionId: string) => {
    e.stopPropagation();
    if (window.confirm('Ertu viss um að þú viljir eyða þessari spurningu?')) {
      deleteQuestion(questionId);
    }
  };
  
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-qa-text flex items-center justify-between">
          Skoða spurningar
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="cursor-pointer" 
            onClick={handleEggClick}
          >
            {easterEggMode ? (
              <Gift className="h-6 w-6 text-pink-500" />
            ) : (
              <Egg className="h-6 w-6 text-gray-300 opacity-50 hover:opacity-100" />
            )}
          </motion.div>
        </h1>
        
        {!hasContributed ? (
          <div className="qa-card text-center py-8">
            <h2 className="text-xl font-semibold mb-2">
              Þú þarft að leggja þitt af mörkum
            </h2>
            <p className="mb-4 text-gray-600">
              Til að fá aðgang að öllum spurningum þarftu að leggja þitt af mörkum með því að bæta við spurningum eða svörum.
            </p>
            <Button onClick={() => navigate("/contribute")}>
              Byrja að leggja til
            </Button>
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
              <div className="flex items-center space-x-4">
                <Button
                  variant={selectedSort === "recent" ? "default" : "outline"}
                  onClick={() => setSelectedSort("recent")}
                >
                  Nýjast
                </Button>
                <Button
                  variant={selectedSort === "popular" ? "default" : "outline"}
                  onClick={() => setSelectedSort("popular")}
                >
                  Vinsælast
                </Button>
              </div>
              
              <div className="w-full md:w-auto">
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Allir flokkar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Allir flokkar</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {user?.isAdmin && (
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={resetVoteCount}
                  >
                    Endurstilla atkvæði
                  </Button>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              {sortedQuestions.length > 0 ? (
                sortedQuestions.map((question) => (
                  <div key={question.id} onClick={() => handleQuestionClick(question.id)} className="cursor-pointer">
                    <QuestionCard 
                      question={{
                        ...question,
                        isEasterEgg: easterEggMode && Math.random() > 0.8 ? true : question.isEasterEgg
                      }} 
                      showContent={true} 
                    />
                    
                    {user?.isAdmin && (
                      <div className="mt-2 flex justify-end gap-2">
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
                            {question.posted ? "Þegar birt" : "Birta á Creatomate"}
                          </Button>
                        )}
                        
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={(e) => handleDeleteQuestion(e, question.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="qa-card text-center py-8">
                  <p className="text-gray-600">
                    Engar spurningar fundust
                  </p>
                </div>
              )}
            </div>
            
            <div className="mt-12">
              <NewsletterSignup />
            </div>
            
            {easterEggMode && (
              <motion.div 
                className="fixed bottom-4 right-4 p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                Töfrahamur virkjaður! 🎉
              </motion.div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Browse;
