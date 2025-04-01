
import React, { useState, useEffect } from 'react';
import { Laugh, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

interface MagicButtonProps {
  onClick: () => void;
}

const MagicButton: React.FC<MagicButtonProps> = ({ onClick }) => {
  const [hovered, setHovered] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [activated, setActivated] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { toast } = useToast();

  const handleClick = () => {
    const newClicks = clicks + 1;
    setClicks(newClicks);
    
    if (newClicks === 3 && !activated) {
      setActivated(true);
      setShowConfetti(true);
      
      toast({
        title: "Magic Mode Activated! ✨",
        description: "You've found the secret button! Magic mode is now available.",
      });
      
      // Play a fun sound effect
      const audio = new Audio("https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3");
      audio.volume = 0.2;
      audio.play().catch(err => console.log("Audio couldn't play: ", err));
      
      // Add a class to the body for magic mode styling
      document.body.classList.add('magic-mode-transition');
      
      setTimeout(() => {
        document.body.classList.remove('magic-mode-transition');
      }, 1000);
      
      onClick();
    } else if (activated) {
      // Show mini confetti on subsequent clicks when already activated
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1500);
      onClick();
    }
  };
  
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  return (
    <motion.div 
      className={`absolute bottom-4 right-4 ${activated ? 'opacity-80' : 'opacity-40'} hover:opacity-100 transition-opacity`}
      initial={{ opacity: activated ? 0.8 : 0.4 }}
      whileHover={{ scale: 1.1, opacity: 1 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <motion.button
        onClick={handleClick}
        className={`rounded-full p-3 shadow-lg ${activated 
          ? 'bg-gradient-to-r from-pink-400 to-purple-500 text-white' 
          : 'bg-gray-200 text-gray-500 hover:bg-gray-100'}`}
        aria-label="Magic Button"
        whileTap={{ scale: 0.9 }}
        animate={{ 
          rotate: activated ? [0, 5, -5, 5, 0] : 0 
        }}
        transition={{ 
          duration: activated ? 0.5 : 0.2,
          repeat: activated ? 0 : 0,
          repeatType: "loop" as const
        }}
      >
        {activated ? (
          <Sparkles className="h-6 w-6" />
        ) : (
          <Laugh className="h-5 w-5" />
        )}
      </motion.button>
      
      <AnimatePresence>
        {hovered && !activated && (
          <motion.div 
            className="absolute bottom-full right-0 mb-2 p-2 bg-white rounded shadow-md text-xs whitespace-nowrap"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            {clicks === 0 ? "What's this?" : clicks === 1 ? "Click again..." : "One more time!"}
          </motion.div>
        )}
      </AnimatePresence>
      
      {showConfetti && (
        <div className="confetti-container">
          {[...Array(20)].map((_, i) => (
            <Confetti key={i} />
          ))}
        </div>
      )}
    </motion.div>
  );
};

// Confetti component
const Confetti: React.FC = () => {
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
  const shapes = ['square', 'circle', 'triangle'];
  
  const randomLeft = Math.random() * 100;
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
  const randomSize = Math.random() * 10 + 5;
  const randomDuration = Math.random() * 2 + 1;
  const randomRotation = Math.random() * 360;
  
  return (
    <motion.div
      className={`confetti ${randomShape}`}
      style={{
        left: `${randomLeft}%`,
        backgroundColor: randomColor,
        width: `${randomSize}px`,
        height: `${randomSize}px`,
      }}
      initial={{ 
        y: -20, 
        opacity: 1, 
        rotate: 0 
      }}
      animate={{ 
        y: window.innerHeight, 
        opacity: 0,
        rotate: randomRotation,
        x: (randomLeft - 50) * 2
      }}
      transition={{ 
        duration: randomDuration, 
        ease: "easeOut" 
      }}
    />
  );
};

export default MagicButton;
