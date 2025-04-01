
import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const SparkleEffect: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{ 
            scale: 0,
            opacity: 1,
            x: '50%',
            y: '50%',
          }}
          animate={{ 
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
            x: [`50%`, `${30 + Math.random() * 40}%`],
            y: [`50%`, `${30 + Math.random() * 40}%`],
          }}
          transition={{ 
            duration: 1 + Math.random(),
            delay: Math.random() * 0.3,
            ease: "easeOut" 
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        >
          <Sparkles 
            className="text-pink-400" 
            size={10 + Math.random() * 15} 
          />
        </motion.div>
      ))}
    </div>
  );
};

export default SparkleEffect;
