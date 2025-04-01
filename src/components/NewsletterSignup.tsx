
import { ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const NewsletterSignup = () => {
  return (
    <Card className="mb-8 overflow-hidden border-0 shadow-lg">
      <div className="bg-gradient-to-r from-purple-500 via-purple-400 to-blue-500 p-1">
        <CardContent className="bg-white p-6 rounded-sm">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
              Skráðu þig fyrir nýjustu AI uppfærslum
            </h2>
            <p className="text-gray-700 mb-6">
              Fáðu fréttir og tilkynningar um nýjustu tækni í gervigreind beint í pósthólfið þitt.
            </p>
            <Button
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium px-6 py-2"
              asChild
            >
              <a 
                href="https://airtable.com/embed/appHGt4X3jagV6Xqx/pagC2KX2lWIpvTcEr/form" 
                target="_blank"
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2"
              >
                Skráðu þig núna <ExternalLink size={16} />
              </a>
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default NewsletterSignup;
