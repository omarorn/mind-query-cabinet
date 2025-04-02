
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { storeGeminiKey, hasGeminiKey, clearGeminiKey } from "@/utils/keyUtils";
import DualText from "./DualText";

const APIKeyInput: React.FC = () => {
  const [key, setKey] = useState("");
  const [isKeySet, setIsKeySet] = useState(hasGeminiKey());
  const [isLoading, setIsLoading] = useState(false);
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

  // Check for server-side key when component mounts
  const checkForServerKey = async () => {
    if (isKeySet) return; // Skip if we already have a key
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/get-gemini-key', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.key) {
          storeGeminiKey(data.key);
          setIsKeySet(true);
          toast({
            title: "Server API Key",
            description: "Using API key provided by the server",
          });
        }
      }
    } catch (error) {
      console.error('Failed to check for server key:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // React effect to check for server key when component mounts
  React.useEffect(() => {
    checkForServerKey();
  }, []);

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
          disabled={isLoading}
        />
        <Button onClick={handleSaveKey} disabled={isLoading}>
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Checking...</span>
            </span>
          ) : (
            <DualText textKey="saveKey" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default APIKeyInput;
