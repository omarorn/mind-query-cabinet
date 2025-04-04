
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQA } from "@/context/QAContext";
import DualText from "./DualText";
import { Menu, X, Sparkles } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import PetCompanion from "./PetCompanion";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, hasContributed, userQuestionCount, userAnswerCount } = useQA();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-purple-50">
      <header className="bg-white border-b sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto py-3 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-nunito font-bold">
              <span className="crayon-style">
                <DualText textKey="appTitle" fallback="Spurninga og Svara Vefurinn" />
              </span>
            </Link>
            
            <div className="md:hidden">
              <button 
                onClick={toggleMobileMenu}
                className="p-2 text-qa-primary hover:bg-purple-50 rounded-lg"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="font-medium hover:text-qa-primary transition-colors">
                <DualText textKey="home" />
              </Link>
              {hasContributed && (
                <Link to="/browse" className="font-medium hover:text-qa-primary transition-colors">
                  <DualText textKey="browse" />
                </Link>
              )}
              <Link to="/contribute" className="font-medium hover:text-qa-primary transition-colors">
                <DualText textKey="contribute" />
              </Link>
            </nav>
            
            <div className="hidden md:flex items-center">
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-500">
                    <span className="font-medium text-qa-text">{user.name}</span>
                    <div className="text-xs">
                      Spurningar: {userQuestionCount}, Svör: {userAnswerCount}
                    </div>
                  </div>
                  <div className="relative">
                    <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white flex items-center justify-center font-semibold animate-pulse-glow">
                      {user.name.charAt(0)}
                    </span>
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-green-400 border-2 border-white"></span>
                  </div>
                </div>
              ) : (
                <Link 
                  to="/contribute"
                  className="qa-button"
                >
                  <DualText textKey="getStarted" />
                </Link>
              )}
            </div>
          </div>
        </div>
        
        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleMobileMenu}>
            <div className="h-full w-64 bg-white p-4 transform transition-transform duration-300" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <Link to="/" className="text-xl font-bold text-qa-primary" onClick={toggleMobileMenu}>
                  <DualText textKey="appTitle" fallback="Q&A" />
                </Link>
                <button onClick={toggleMobileMenu} className="p-2 text-qa-primary">
                  <X size={20} />
                </button>
              </div>
              
              <nav className="flex flex-col space-y-4 mb-6">
                <Link to="/" className="font-medium py-2 hover:text-qa-primary" onClick={toggleMobileMenu}>
                  <DualText textKey="home" />
                </Link>
                {hasContributed && (
                  <Link to="/browse" className="font-medium py-2 hover:text-qa-primary" onClick={toggleMobileMenu}>
                    <DualText textKey="browse" />
                  </Link>
                )}
                <Link to="/contribute" className="font-medium py-2 hover:text-qa-primary" onClick={toggleMobileMenu}>
                  <DualText textKey="contribute" />
                </Link>
              </nav>
              
              {user && (
                <div className="pt-4 border-t">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="flex h-8 w-8 shrink-0 overflow-hidden rounded-full bg-qa-primary text-white items-center justify-center font-semibold">
                      {user.name.charAt(0)}
                    </span>
                    <span className="font-medium">{user.name}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Spurningar: {userQuestionCount}, Svör: {userAnswerCount}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
      
      <main className="flex-grow container mx-auto py-4 px-4 sm:px-6 lg:px-8 pb-16">
        {children}
      </main>
      
      {/* Pet companion */}
      <PetCompanion initialPet={Math.random() > 0.5 ? 'cat' : 'dog'} />
      
      <footer className="bg-white border-t py-4 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-center text-gray-500 text-sm mb-3 md:mb-0">
              &copy; {new Date().getFullYear()} Spurningar og Svör - Þekkingarsköpun byrjar með þátttöku.
            </p>
            <div className="flex items-center space-x-2">
              <Sparkles size={16} className="text-qa-accent" />
              <span className="text-xs text-gray-500">Tölvuvinir þínir eru alltaf tilbúnir að hjálpa</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
