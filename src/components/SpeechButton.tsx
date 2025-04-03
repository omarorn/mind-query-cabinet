
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { speakText, stopSpeaking, isSpeaking, VoiceOption } from '@/utils/textToSpeech';
import { useToast } from '@/hooks/use-toast';

interface SpeechButtonProps {
  text: string;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  voice?: VoiceOption;
}

const SpeechButton: React.FC<SpeechButtonProps> = ({ 
  text, 
  className = "", 
  variant = "outline",
  voice = "nova"
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (isPlaying) {
        stopSpeaking();
      }
    };
  }, [isPlaying]);
  
  // Check speech status periodically
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      if (!isSpeaking()) {
        setIsPlaying(false);
      }
    }, 500);
    
    return () => clearInterval(interval);
  }, [isPlaying]);
  
  const handleClick = async () => {
    if (isPlaying) {
      stopSpeaking();
      setIsPlaying(false);
      return;
    }
    
    try {
      setIsLoading(true);
      const success = await speakText(text, voice);
      
      if (success) {
        setIsPlaying(true);
      } else {
        toast({
          title: "Villa við upplestur",
          description: "Ekki tókst að lesa textann upp",
        });
      }
    } catch (error) {
      console.error('Speech error:', error);
      toast({
        title: "Villa við upplestur",
        description: "Óvænt villa kom upp við upplestur",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Button 
      onClick={handleClick}
      variant={variant}
      size="sm"
      className={`flex items-center gap-1 text-xs ${className}`}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : isPlaying ? (
        <VolumeX className="h-3.5 w-3.5" />
      ) : (
        <Volume2 className="h-3.5 w-3.5" />
      )}
      {isPlaying ? "Stöðva upplestur" : "Hlusta á upplestur"}
    </Button>
  );
};

export default SpeechButton;
