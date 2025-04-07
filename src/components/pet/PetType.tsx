
import React from "react";
import { motion } from "framer-motion";
import { Cat, Dog, Star } from "lucide-react";

interface PetTypeProps {
  type: 'cat' | 'dog';
  size: number;
  isMobile: boolean;
}

const PetType: React.FC<PetTypeProps> = ({ type, size, isMobile }) => {
  return (
    <>
      <motion.div 
        animate={{ scale: [1, 1.05, 1] }} 
        transition={{ duration: 2, repeat: Infinity }}
        className="relative z-10 flex items-center justify-center"
      >
        {type === 'cat' ? (
          <Cat 
            size={size} 
            className="text-white drop-shadow-md" 
            strokeWidth={1.5}
          />
        ) : (
          <Dog 
            size={size} 
            className="text-white drop-shadow-md" 
            strokeWidth={1.5}
          />
        )}
      </motion.div>
      
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
    </>
  );
};

export default PetType;
