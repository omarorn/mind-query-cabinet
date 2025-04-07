
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PetMessageProps {
  showMessage: boolean;
  message: string;
  isMobile: boolean;
}

const PetMessage: React.FC<PetMessageProps> = ({ showMessage, message, isMobile }) => {
  return (
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
  );
};

export default PetMessage;
