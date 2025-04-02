
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { storeGeminiKey } from "./utils/keyUtils";

// Initialize the Gemini API key if provided
const initialGeminiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (initialGeminiKey) {
  storeGeminiKey(initialGeminiKey);
}

createRoot(document.getElementById("root")!).render(<App />);
