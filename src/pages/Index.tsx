
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { useQA } from "@/context/QAContext";
import QuestionCard from "@/components/QuestionCard";
import NewsletterSignup from "@/components/NewsletterSignup";
import { Sparkles, Brain, Lightbulb, GraduationCap, Rocket, Award } from "lucide-react";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const { hasContributed, questions } = useQA();
  const isMobile = useIsMobile();
  
  // Get top 3 questions based on votes if any exist
  const topQuestions = [...questions]
    .sort((a, b) => b.upvotes - a.upvotes)
    .slice(0, 3);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2
      } 
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  
  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <motion.div 
          className="text-center mb-8 md:mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative inline-block mb-2">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-qa-text font-nunito">
              Velkomin á Spurninga og Svara vefinn
            </h1>
            <motion.div
              className="absolute -top-2 -right-2 md:top-0 md:right-0"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 4
              }}
            >
              <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-yellow-400" />
            </motion.div>
          </div>
          
          <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8 max-w-3xl mx-auto">
            Leggðu til 3 spurningar eða svör til að fá fullan aðgang að þekkingargrunninum.
          </p>
          
          <Link to="/contribute" className="qa-button group">
            <span>Byrja að leggja til</span>
            <Rocket className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
        
        <motion.div 
          className="grid md:grid-cols-2 gap-4 md:gap-8 mb-8 md:mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="qa-card glass-card" variants={itemVariants}>
            <div className="flex items-start md:items-center gap-4 mb-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <Brain className="h-5 w-5 md:h-6 md:w-6 text-qa-primary" />
              </div>
              <h2 className="text-xl md:text-2xl font-semibold text-qa-primary font-nunito">Hvernig virkar þetta?</h2>
            </div>
            <ol className="space-y-3 list-decimal list-inside text-gray-700 ml-2">
              <li className="flex items-center gap-2">
                <span className="font-medium text-qa-text">Búðu til aðgang með nafninu þínu</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="font-medium text-qa-text">Leggðu til 3 spurningar eða svör</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="font-medium text-qa-text">Fáðu fullan aðgang að öllu efni</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="font-medium text-qa-text">Kjóstu bestu spurningarnar og svörin</span>
              </li>
            </ol>
          </motion.div>
          
          <motion.div className="qa-card glass-card" variants={itemVariants}>
            <div className="flex items-start md:items-center gap-4 mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Lightbulb className="h-5 w-5 md:h-6 md:w-6 text-qa-secondary" />
              </div>
              <h2 className="text-xl md:text-2xl font-semibold text-qa-secondary font-nunito">Af hverju að taka þátt?</h2>
            </div>
            <ul className="space-y-3 list-disc list-inside text-gray-700 ml-2">
              <li className="flex items-center gap-2">
                <span className="font-medium text-qa-text">Deildu þekkingu þinni með öðrum</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="font-medium text-qa-text">Hjálpaðu við að byggja upp verðmætan þekkingargrunn</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="font-medium text-qa-text">Lærðu frá fjölbreyttu samfélagi</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="font-medium text-qa-text">Fáðu viðurkenningu fyrir gæðaefni</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>
        
        {topQuestions.length > 0 && (
          <motion.div 
            className="mb-8 md:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 md:h-6 md:w-6 text-qa-primary hidden sm:inline-block" />
                <h2 className="text-xl md:text-2xl font-semibold font-nunito">Vinsælustu spurningarnar</h2>
              </div>
              {hasContributed && (
                <Link to="/browse" className="text-qa-primary hover:underline flex items-center">
                  <span>Skoða allar spurningar</span>
                  <Award className="ml-1 h-4 w-4" />
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
                <motion.div 
                  className="p-4 bg-purple-50 rounded-lg border border-purple-100 max-w-md mx-auto"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <p className="text-gray-600 mb-4">
                    Viltu sjá fleiri spurningar? Leggðu til til að opna fyrir allt efnið!
                  </p>
                  <Link to="/contribute" className="qa-button">
                    Leggja til núna
                  </Link>
                </motion.div>
              </div>
            )}
          </motion.div>
        )}
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <NewsletterSignup />
        </motion.div>
      </div>
    </Layout>
  );
};

export default Index;
