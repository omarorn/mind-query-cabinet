
import { useState } from "react";

export type PetType = 'cat' | 'dog';

export const usePetMessages = (initialPetType: PetType = 'cat') => {
  const [petType, setPetType] = useState<PetType>(initialPetType);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState<string | null>(null);
  
  const petMessages = {
    cat: [
      "Mjá! Sæll/sæl, get ég hjálpað þér?",
      "Kisi vill hjálpa þér að finna svar!",
      "Mjá! Hefurðu prófað að leita að spurningum?",
      "Kisi er tilbúin að hjálpa þér að læra!",
    ],
    dog: [
      "Voff! Get ég hjálpað þér?",
      "Hundurinn þinn er hér til að hjálpa!",
      "Voff voff! Viltu leggja til spurningu?",
      "Veistu að hundurinn þinn kann að svara spurningum?",
    ]
  };
  
  const emojis = ["✨", "💫", "🌟", "💕", "🎉", "🎊", "🌈"];
  
  const showRandomMessage = () => {
    const nextPet = petType === 'cat' ? 'dog' : 'cat';
    const messages = petMessages[nextPet];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setMessage(randomMessage);
    setShowMessage(true);
    
    setTimeout(() => {
      setShowMessage(false);
    }, 4000);
  };
  
  const togglePet = () => {
    setPetType(prev => prev === 'cat' ? 'dog' : 'cat');
    showRandomMessage();
    
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    setShowEmoji(randomEmoji);
    setTimeout(() => setShowEmoji(null), 1500);
  };
  
  const displayMessage = (customMessage: string, emojiToShow?: string) => {
    setMessage(customMessage);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
    
    if (emojiToShow) {
      setShowEmoji(emojiToShow);
      setTimeout(() => setShowEmoji(null), 1500);
    }
  };
  
  return {
    petType,
    showMessage,
    message,
    showEmoji,
    togglePet,
    showRandomMessage,
    displayMessage,
    setPetType
  };
};
