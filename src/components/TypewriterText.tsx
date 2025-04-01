
import { useEffect, useState, useRef } from 'react';
import { isSpeaking } from '@/utils/textToSpeech';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
  delay?: number;
  pauseDuringAudio?: boolean;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({ 
  text, 
  speed = 30, 
  onComplete,
  className = "",
  delay = 0,
  pauseDuringAudio = true
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const isCompleted = useRef(false);
  
  // Check if audio is playing and pause if necessary
  useEffect(() => {
    if (!pauseDuringAudio) return;
    
    const checkAudio = () => {
      const speaking = isSpeaking();
      setIsPaused(speaking);
    };
    
    const intervalId = setInterval(checkAudio, 500);
    return () => clearInterval(intervalId);
  }, [pauseDuringAudio]);
  
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
    
    // Main typing animation - only proceed if not paused
    if (isTyping && currentIndex < text.length && !isPaused) {
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
  }, [text, currentIndex, displayedText, speed, onComplete, delay, isTyping, isPaused]);

  return (
    <div className={className}>
      {displayedText}
      {isTyping && currentIndex < text.length && !isPaused && (
        <span className="inline-block w-2 h-4 bg-qa-primary animate-pulse ml-0.5"></span>
      )}
    </div>
  );
};

export default TypewriterText;
