
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { storeGeminiKey, hasGeminiKey, clearGeminiKey } from "@/utils/keyUtils";
import DualText from "./DualText";

const APIKeyInput: React.FC = () => {
  const [key, setKey] = useState("");
  const [isKeySet, setIsKeySet] = useState(hasGeminiKey());
  const { toast } = useToast();

  const handleSaveKey = () => {
    if (!key.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive"
      });
      return;
    }

    storeGeminiKey(key.trim());
    setIsKeySet(true);
    setKey("");
    
    toast({
      title: "Success",
      description: "API key saved successfully",
    });
  };

  const handleClearKey = () => {
    clearGeminiKey();
    setIsKeySet(false);
    
    toast({
      title: "API Key Removed",
      description: "Your API key has been removed",
    });
  };

  if (isKeySet) {
    return (
      <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
        <div className="flex justify-between items-center">
          <p className="text-green-700">
            <DualText textKey="apiKeySet" />
          </p>
          <Button variant="outline" size="sm" onClick={handleClearKey}>
            <DualText textKey="removeKey" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-md">
      <p className="text-amber-700 mb-2">
        <DualText textKey="needGeminiKey" />
      </p>
      <div className="flex gap-2">
        <Input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Enter your Gemini API key"
          className="flex-1"
        />
        <Button onClick={handleSaveKey}>
          <DualText textKey="saveKey" />
        </Button>
      </div>
    </div>
  );
};

export default APIKeyInput;
