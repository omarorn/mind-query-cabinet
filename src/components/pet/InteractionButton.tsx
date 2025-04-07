
import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface InteractionButtonProps {
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
  iconSize: number;
  onClick: () => void;
}

const InteractionButton: React.FC<InteractionButtonProps> = ({
  icon: Icon,
  color,
  bgColor,
  borderColor,
  iconSize,
  onClick
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`${bgColor} p-2 rounded-full shadow-sm hover:shadow-md transition-all duration-200 border-2 ${borderColor}`}
    >
      <Icon size={iconSize} className={color} />
    </motion.button>
  );
};

export default InteractionButton;
