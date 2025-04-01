
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface QuestionImageProps {
  src: string;
  alt: string;
  isEasterEgg: boolean;
  isHovered: boolean;
}

const QuestionImage: React.FC<QuestionImageProps> = ({ 
  src, 
  alt, 
  isEasterEgg, 
  isHovered 
}) => {
  return (
    <div className="my-2">
      <motion.img 
        src={src} 
        alt={alt} 
        className={cn(
          "rounded-md max-h-40 w-auto object-cover",
        )}
        animate={
          isEasterEgg && isHovered 
            ? { scale: [1, 1.02, 1], opacity: [1, 0.9, 1] } 
            : {}
        }
        transition={{ duration: 2, repeat: isEasterEgg && isHovered ? Infinity : 0 }}
      />
    </div>
  );
};

export default QuestionImage;
