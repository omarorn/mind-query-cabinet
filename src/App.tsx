
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QAProvider } from "./context/QAContext";
import { LanguageProvider } from "./context/LanguageContext";
import Index from "./pages/Index";
import Browse from "./pages/Browse";
import QuestionDetail from "./pages/QuestionDetail";
import Contribute from "./pages/Contribute";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import "./easterEggs.css";

// Create a new QueryClient instance with custom settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Don't refetch when window gains focus
      staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <QAProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <div className="font-crayon min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/browse" element={<Browse />} />
                <Route path="/question/:id" element={<QuestionDetail />} />
                <Route path="/contribute" element={<Contribute />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </div>
        </TooltipProvider>
      </QAProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
