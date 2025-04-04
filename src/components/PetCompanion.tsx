
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cat, Dog, Heart, HelpCircle, Sparkles } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface PetCompanionProps {
  initialPet?: 'cat' | 'dog';
}

const PetCompanion: React.FC<PetCompanionProps> = ({ initialPet = 'cat' }) => {
  const [petType, setPetType] = useState<'cat' | 'dog'>(initialPet);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const isMobile = useIsMobile();
  
  const petMessages = {
    cat: [
      "Mjá! Sæll/sæl, get ég hjálpað þér?",
      "Kisi vill hjálpa þér að finna svar!",
      "Mjá! Hefurðu prófað að leita að spurningum?",
      "Kisi er tilbúin að hjálpa þér að læra!",
    ],
    dog: [
      "Voff! Get ég hjálpað þér?",
      "Hundurinn þinn er hér til að hjálpa!",
      "Voff voff! Viltu leggja til spurningu?",
      "Veistu að hundurinn þinn kann að svara spurningum?",
    ]
  };
  
  const togglePet = () => {
    setPetType(prev => prev === 'cat' ? 'dog' : 'cat');
    showRandomMessage();
  };
  
  const showRandomMessage = () => {
    const nextPet = petType === 'cat' ? 'dog' : 'cat';
    const messages = petMessages[nextPet];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setMessage(randomMessage);
    setShowMessage(true);
    
    setTimeout(() => {
      setShowMessage(false);
    }, 4000);
  };
  
  useEffect(() => {
    // Show a random message when the component first loads
    const timeout = setTimeout(() => {
      showRandomMessage();
    }, 3000);
    
    return () => clearTimeout(timeout);
  }, []);
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute -top-16 right-0 bg-white p-3 rounded-lg shadow-md text-sm w-48 mb-2 border border-purple-100"
          >
            <p className="text-gray-700">{message}</p>
            <div className="absolute -bottom-2 right-4 w-0 h-0 border-l-8 border-l-transparent border-t-8 border-white border-r-8 border-r-transparent"></div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div 
        className="flex flex-col items-end space-y-2"
        whileHover={{ scale: 1.05 }}
      >
        <button
          onClick={() => {
            setMessage("Ég elska að hjálpa!");
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 3000);
          }}
          className="bg-pink-100 p-2 rounded-full shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <Heart size={isMobile ? 18 : 20} className="text-pink-500" />
        </button>
        
        <button
          onClick={() => {
            setMessage("Spyrðu mig um hvað sem er!");
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 3000);
          }}
          className="bg-blue-100 p-2 rounded-full shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <HelpCircle size={isMobile ? 18 : 20} className="text-blue-500" />
        </button>
        
        <motion.button
          onClick={togglePet}
          className="bg-purple-100 p-3 rounded-full shadow-md hover:shadow-lg transition-shadow duration-200 relative ai-glow"
          whileTap={{ scale: 0.95 }}
        >
          {petType === 'cat' ? (
            <Cat size={isMobile ? 24 : 32} className="text-purple-600" />
          ) : (
            <Dog size={isMobile ? 24 : 32} className="text-purple-600" />
          )}
          <motion.div
            className="absolute -top-1 -right-1 bg-yellow-100 rounded-full p-1"
            animate={{ 
              rotate: [0, 10, -10, 10, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3
            }}
          >
            <Sparkles size={isMobile ? 10 : 12} className="text-yellow-500" />
          </motion.div>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default PetCompanion;
