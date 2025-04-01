
import { motion } from "framer-motion";

interface EasterEggNotificationProps {
  isVisible: boolean;
}

const EasterEggNotification = ({ isVisible }: EasterEggNotificationProps) => {
  if (!isVisible) return null;
  
  return (
    <motion.div 
      className="fixed bottom-4 right-4 p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white shadow-lg"
      initial={{ scale: 0 }}
      animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
      transition={{ duration: 0.5 }}
    >
      Töfrahamur virkjaður! 🎉
    </motion.div>
  );
};

export default EasterEggNotification;
