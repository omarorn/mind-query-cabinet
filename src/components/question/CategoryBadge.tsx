
import React from "react";
import { Tag } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
  category?: string;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  if (!category) return null;
  
  const getCategoryColor = (category: string) => {
    const categoryColors: Record<string, string> = {
      animals: "bg-amber-100 text-amber-700",
      space: "bg-indigo-100 text-indigo-700",
      nature: "bg-emerald-100 text-emerald-700",
      science: "bg-blue-100 text-blue-700",
      history: "bg-amber-100 text-amber-700",
      art: "bg-pink-100 text-pink-700",
      music: "bg-purple-100 text-purple-700",
      food: "bg-rose-100 text-rose-700",
      books: "bg-cyan-100 text-cyan-700",
      games: "bg-orange-100 text-orange-700",
      puzzles: "bg-indigo-100 text-indigo-700",
      funnyFacts: "bg-violet-100 text-violet-700",
      magic: "bg-fuchsia-100 text-fuchsia-700",
      rainbow: "bg-teal-100 text-teal-700",
      surprise: "bg-gradient-to-r from-purple-100 via-pink-100 to-red-100 text-purple-700"
    };
    
    return categoryColors[category] || "bg-gray-100 text-gray-700";
  };

  return (
    <motion.div 
      className={cn(
        "inline-flex items-center px-2 py-1 rounded-full text-xs",
        getCategoryColor(category)
      )}
      whileHover={{ scale: 1.05 }}
    >
      <Tag className="w-3 h-3 mr-1" />
      {category}
    </motion.div>
  );
};

export default CategoryBadge;
