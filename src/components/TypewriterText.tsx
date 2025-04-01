
import { useEffect, useState, useRef } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
  delay?: number;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({ 
  text, 
  speed = 30, 
  onComplete,
  className = "",
  delay = 0
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const isCompleted = useRef(false);
  
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    
    // Reset if text changes
    if (text !== displayedText && currentIndex === displayedText.length) {
      setDisplayedText('');
      setCurrentIndex(0);
      isCompleted.current = false;
    }
    
    // Start with delay
    if (currentIndex === 0 && !isTyping) {
      timer = setTimeout(() => {
        setIsTyping(true);
      }, delay);
      return () => clearTimeout(timer);
    }
    
    // Main typing animation
    if (isTyping && currentIndex < text.length) {
      timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      
      return () => clearTimeout(timer);
    }
    
    // On complete callback
    if (currentIndex === text.length && !isCompleted.current) {
      isCompleted.current = true;
      if (onComplete) onComplete();
    }
  }, [text, currentIndex, displayedText, speed, onComplete, delay, isTyping]);

  return (
    <div className={className}>
      {displayedText}
      {isTyping && currentIndex < text.length && (
        <span className="inline-block w-2 h-4 bg-qa-primary animate-pulse ml-0.5"></span>
      )}
    </div>
  );
};

export default TypewriterText;
