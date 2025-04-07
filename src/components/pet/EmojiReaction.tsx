
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface EmojiReactionProps {
  emoji: string | null;
}

const EmojiReaction: React.FC<EmojiReactionProps> = ({ emoji }) => {
  return (
    <AnimatePresence>
      {emoji && (
        <motion.div
          initial={{ opacity: 0, y: 0, scale: 0.5 }}
          animate={{ opacity: 1, y: -30, scale: 1.2 }}
          exit={{ opacity: 0, scale: 0.5, y: -40 }}
          transition={{ duration: 0.5 }}
          className="absolute -top-6 left-0 right-0 text-center text-2xl"
        >
          {emoji}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EmojiReaction;
