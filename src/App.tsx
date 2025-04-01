
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QAProvider } from "./context/QAContext";
import Index from "./pages/Index";
import Browse from "./pages/Browse";
import QuestionDetail from "./pages/QuestionDetail";
import Contribute from "./pages/Contribute";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <QAProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/question/:id" element={<QuestionDetail />} />
            <Route path="/contribute" element={<Contribute />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QAProvider>
  </QueryClientProvider>
);

export default App;
