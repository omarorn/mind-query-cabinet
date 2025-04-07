
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, HelpCircle, Gift } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePetMessages, PetType } from "@/hooks/usePetMessages";
import PetMessage from "./pet/PetMessage";
import PetType from "./pet/PetType";
import InteractionButton from "./pet/InteractionButton";
import EmojiReaction from "./pet/EmojiReaction";

interface PetCompanionProps {
  initialPet?: PetType;
}

const PetCompanion: React.FC<PetCompanionProps> = ({ initialPet = 'cat' }) => {
  const [isWiggling, setIsWiggling] = useState(false);
  const isMobile = useIsMobile();
  
  const {
    petType,
    showMessage,
    message,
    showEmoji,
    togglePet,
    showRandomMessage,
    displayMessage
  } = usePetMessages(initialPet);
  
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
      <PetMessage 
        showMessage={showMessage} 
        message={message} 
        isMobile={isMobile} 
      />
      
      <motion.div 
        className="flex flex-col items-end space-y-2"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {!isMobile && (
          <>
            <InteractionButton 
              icon={Heart}
              color="text-pink-500"
              bgColor="bg-pink-100"
              borderColor="border-pink-200"
              iconSize={iconSize}
              onClick={() => displayMessage("Ég elska að hjálpa!", "💕")}
            />
            
            <InteractionButton 
              icon={HelpCircle}
              color="text-blue-500"
              bgColor="bg-blue-100"
              borderColor="border-blue-200"
              iconSize={iconSize}
              onClick={() => displayMessage("Spyrðu mig um hvað sem er!", "❓")}
            />
            
            <InteractionButton 
              icon={Gift}
              color="text-yellow-500"
              bgColor="bg-yellow-100"
              borderColor="border-yellow-200"
              iconSize={iconSize}
              onClick={() => displayMessage("Það er gaman að leika sér!", "🎁")}
            />
          </>
        )}
        
        <motion.div className="relative">
          <EmojiReaction emoji={showEmoji} />
          
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
            
            <PetType 
              type={petType} 
              size={petSize}
              isMobile={isMobile}
            />
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PetCompanion;
