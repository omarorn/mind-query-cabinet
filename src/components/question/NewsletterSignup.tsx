
import { ExternalLink } from "lucide-react";

const NewsletterSignup = () => {
  return (
    <div className="qa-card bg-blue-50 border border-blue-200 mb-8">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-3 text-blue-800">Skráðu þig fyrir nýjustu AI uppfærslum</h2>
        <p className="text-gray-700 mb-4">Fáðu fréttir og tilkynningar um nýjustu tækni í gervigreind beint í pósthólfið þitt.</p>
        <a 
          href="https://airtable.com/embed/appHGt4X3jagV6Xqx/pagC2KX2lWIpvTcEr/form" 
          target="_blank"
          rel="noopener noreferrer" 
          className="inline-flex items-center gap-2 qa-button bg-blue-600 hover:bg-blue-700"
        >
          Skráðu þig núna <ExternalLink size={16} />
        </a>
      </div>
    </div>
  );
};

export default NewsletterSignup;
