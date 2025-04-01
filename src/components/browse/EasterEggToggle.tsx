
import { motion } from "framer-motion";
import { Egg, Gift } from "lucide-react";
import { useState } from "react";

interface EasterEggToggleProps {
  isEasterEggMode: boolean;
  onToggle: () => void;
}

const EasterEggToggle = ({ isEasterEggMode, onToggle }: EasterEggToggleProps) => {
  const [clicks, setClicks] = useState(0);
  
  const handleClick = () => {
    const newCount = clicks + 1;
    setClicks(newCount);
    
    if (newCount >= 3) {
      onToggle();
      setClicks(0);
    }
  };
  
  return (
    <motion.div 
      whileHover={{ scale: 1.1, rotate: 5 }}
      className="cursor-pointer" 
      onClick={handleClick}
    >
      {isEasterEggMode ? (
        <Gift className="h-6 w-6 text-pink-500" />
      ) : (
        <Egg className="h-6 w-6 text-gray-300 opacity-50 hover:opacity-100" />
      )}
    </motion.div>
  );
};

export default EasterEggToggle;
