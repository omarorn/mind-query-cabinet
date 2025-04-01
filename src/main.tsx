import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { storeGeminiKey } from "./utils/keyUtils";

// Initialize the Gemini API key if provided
const initialGeminiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (initialGeminiKey) {
  storeGeminiKey(initialGeminiKey);
} else {
  // For development only - automatically set the provided key
  // In production, this should be removed
  storeGeminiKey("AIzaSyDRBeMpT4sirFBqXA5uvj4gcT1mFctFeqw");
}

createRoot(document.getElementById("root")!).render(<App />);
