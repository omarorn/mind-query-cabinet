
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cat, Dog, Heart, HelpCircle, Sparkles, Star, Gift } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface PetCompanionProps {
  initialPet?: 'cat' | 'dog';
}

const PetCompanion: React.FC<PetCompanionProps> = ({ initialPet = 'cat' }) => {
  const [petType, setPetType] = useState<'cat' | 'dog'>(initialPet);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [isWiggling, setIsWiggling] = useState(false);
  const [showEmoji, setShowEmoji] = useState<string | null>(null);
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
  
  const emojis = ["✨", "💫", "🌟", "💕", "🎉", "🎊", "🌈"];
  
  const togglePet = () => {
    setPetType(prev => prev === 'cat' ? 'dog' : 'cat');
    showRandomMessage();
    setIsWiggling(true);
    setTimeout(() => setIsWiggling(false), 1000);
    
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    setShowEmoji(randomEmoji);
    setTimeout(() => setShowEmoji(null), 1500);
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
  
  // Periodically wiggle the pet to draw attention
  useEffect(() => {
    const wiggleInterval = setInterval(() => {
      setIsWiggling(true);
      setTimeout(() => setIsWiggling(false), 800);
    }, 15000);
    
    return () => clearInterval(wiggleInterval);
  }, []);
  
  const petSize = isMobile ? 30 : 38;
  const buttonSize = isMobile ? 40 : 48;
  const iconSize = isMobile ? 16 : 20;
  
  return (
    <div className={`fixed ${isMobile ? 'bottom-3 right-3' : 'bottom-4 right-4'} z-50`}>
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className={`absolute ${isMobile ? '-top-14 right-0 w-44' : '-top-16 right-0 w-48'} 
              bg-white p-3 rounded-2xl shadow-md text-sm mb-2 border-2 border-purple-200
              bg-gradient-to-br from-white to-purple-50`}
          >
            <p className="text-gray-700 font-medium">{message}</p>
            <div className="absolute -bottom-3 right-4 w-0 h-0 
              border-l-8 border-l-transparent 
              border-t-8 border-white 
              border-r-8 border-r-transparent"></div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div 
        className="flex flex-col items-end space-y-2"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {!isMobile && (
          <>
            <motion.button
              whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setMessage("Ég elska að hjálpa!");
                setShowMessage(true);
                setTimeout(() => setShowMessage(false), 3000);
                setShowEmoji("💕");
                setTimeout(() => setShowEmoji(null), 1500);
              }}
              className="bg-pink-100 p-2 rounded-full shadow-sm hover:shadow-md transition-all duration-200 border-2 border-pink-200"
            >
              <Heart size={iconSize} className="text-pink-500" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1, rotate: [0, 5, -5, 0] }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setMessage("Spyrðu mig um hvað sem er!");
                setShowMessage(true);
                setTimeout(() => setShowMessage(false), 3000);
                setShowEmoji("❓");
                setTimeout(() => setShowEmoji(null), 1500);
              }}
              className="bg-blue-100 p-2 rounded-full shadow-sm hover:shadow-md transition-all duration-200 border-2 border-blue-200"
            >
              <HelpCircle size={iconSize} className="text-blue-500" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setMessage("Það er gaman að leika sér!");
                setShowMessage(true);
                setTimeout(() => setShowMessage(false), 3000);
                setShowEmoji("🎁");
                setTimeout(() => setShowEmoji(null), 1500);
              }}
              className="bg-yellow-100 p-2 rounded-full shadow-sm hover:shadow-md transition-all duration-200 border-2 border-yellow-200"
            >
              <Gift size={iconSize} className="text-yellow-500" />
            </motion.button>
          </>
        )}
        
        <motion.div className="relative">
          <AnimatePresence>
            {showEmoji && (
              <motion.div
                initial={{ opacity: 0, y: 0, scale: 0.5 }}
                animate={{ opacity: 1, y: -30, scale: 1.2 }}
                exit={{ opacity: 0, scale: 0.5, y: -40 }}
                transition={{ duration: 0.5 }}
                className="absolute -top-6 left-0 right-0 text-center text-2xl"
              >
                {showEmoji}
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.button
            animate={
              isWiggling 
                ? { rotate: [0, -10, 10, -5, 5, 0], scale: [1, 1.05, 1] }
                : {}
            }
            transition={{ duration: 0.8 }}
            onClick={togglePet}
            className={`relative rounded-full shadow-lg hover:shadow-xl 
              transition-all duration-200 overflow-hidden
              ${isMobile ? 'p-2' : 'p-3'}
              bg-gradient-to-br from-purple-400 to-indigo-500
              border-4 border-white`}
            style={{ 
              width: buttonSize, 
              height: buttonSize,
              boxShadow: '0 0 15px rgba(139, 92, 246, 0.3)'
            }}
            whileHover={{ 
              scale: 1.1,
              boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)' 
            }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-purple-300/30 to-transparent"
              animate={{ 
                opacity: [0.3, 0.7, 0.3],
                rotate: [0, 360]
              }}
              transition={{ 
                opacity: { duration: 2, repeat: Infinity },
                rotate: { duration: 10, repeat: Infinity, ease: "linear" }
              }}
            />
            
            {petType === 'cat' ? (
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }} 
                transition={{ duration: 2, repeat: Infinity }}
                className="relative z-10 flex items-center justify-center"
              >
                <Cat 
                  size={petSize} 
                  className="text-white drop-shadow-md" 
                  strokeWidth={1.5}
                />
              </motion.div>
            ) : (
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }} 
                transition={{ duration: 2, repeat: Infinity }}
                className="relative z-10 flex items-center justify-center"
              >
                <Dog 
                  size={petSize} 
                  className="text-white drop-shadow-md" 
                  strokeWidth={1.5}
                />
              </motion.div>
            )}
            
            <motion.div
              className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1 z-20
                flex items-center justify-center"
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
              <Star size={isMobile ? 10 : 12} className="text-white" fill="white" />
            </motion.div>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PetCompanion;
