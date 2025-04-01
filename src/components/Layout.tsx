
import { Link } from "react-router-dom";
import { useQA } from "@/context/QAContext";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, hasContributed, userQuestionCount, userAnswerCount } = useQA();
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-qa-primary">
              Q&A Exchange
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="hover:text-qa-primary">Home</Link>
              {hasContributed && (
                <Link to="/browse" className="hover:text-qa-primary">Browse Q&A</Link>
              )}
              <Link to="/contribute" className="hover:text-qa-primary">Contribute</Link>
            </nav>
            <div className="flex items-center">
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="hidden md:block text-sm text-gray-500">
                    <span className="font-medium text-qa-text">{user.name}</span>
                    <div className="text-xs">
                      Questions: {userQuestionCount}, Answers: {userAnswerCount}
                    </div>
                  </div>
                  <span className="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full bg-qa-primary text-white flex items-center justify-center font-semibold">
                    {user.name.charAt(0)}
                  </span>
                </div>
              ) : (
                <Link 
                  to="/contribute"
                  className="qa-button"
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>
          <nav className="md:hidden mt-4 flex items-center space-x-4">
            <Link to="/" className="hover:text-qa-primary">Home</Link>
            {hasContributed && (
              <Link to="/browse" className="hover:text-qa-primary">Browse Q&A</Link>
            )}
            <Link to="/contribute" className="hover:text-qa-primary">Contribute</Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
      
      <footer className="bg-white border-t py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Q&A Exchange - Where knowledge sharing begins with contribution.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
