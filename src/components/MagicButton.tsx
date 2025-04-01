
import React, { useState } from 'react';
import { Laugh } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

interface MagicButtonProps {
  onClick: () => void;
}

const MagicButton: React.FC<MagicButtonProps> = ({ onClick }) => {
  const [hovered, setHovered] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [activated, setActivated] = useState(false);
  const { toast } = useToast();

  const handleClick = () => {
    const newClicks = clicks + 1;
    setClicks(newClicks);
    
    if (newClicks === 3 && !activated) {
      setActivated(true);
      toast({
        title: "Magic Mode Activated!",
        description: "You've found the secret button! Magic mode is now available.",
      });
      onClick();
    } else if (activated) {
      onClick();
    }
  };

  return (
    <motion.div 
      className="absolute bottom-4 right-4 opacity-30 hover:opacity-100 transition-opacity"
      initial={{ opacity: 0.3 }}
      whileHover={{ scale: 1.1, opacity: 1 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <button
        onClick={handleClick}
        className={`rounded-full p-2 ${activated ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-500'}`}
        aria-label="Magic Button"
      >
        <Laugh className="h-5 w-5" />
      </button>
      {hovered && !activated && (
        <div className="absolute bottom-full right-0 mb-2 p-2 bg-white rounded shadow-md text-xs whitespace-nowrap">
          {clicks === 0 ? "What's this?" : clicks === 1 ? "Click again..." : "One more time!"}
        </div>
      )}
    </motion.div>
  );
};

export default MagicButton;
