
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { useQA } from "@/context/QAContext";
import QuestionCard from "@/components/QuestionCard";
import { ExternalLink } from "lucide-react";

const Index = () => {
  const { hasContributed, questions } = useQA();
  
  // Get top 3 questions based on votes if any exist
  const topQuestions = [...questions]
    .sort((a, b) => b.upvotes - a.upvotes)
    .slice(0, 3);
  
  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-qa-text">Velkomin á Spurninga og Svara vefinn</h1>
          <p className="text-xl text-gray-600 mb-8">
            Leggðu til 3 spurningar eða svör til að fá fullan aðgang að þekkingargrunninum.
          </p>
          <Link to="/contribute" className="qa-button">
            Byrja að leggja til
          </Link>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="qa-card">
            <h2 className="text-2xl font-semibold mb-4 text-qa-primary">Hvernig virkar þetta?</h2>
            <ol className="space-y-4 list-decimal list-inside text-gray-700">
              <li>Búðu til aðgang með nafninu þínu</li>
              <li>Leggðu til 3 spurningar eða svör</li>
              <li>Fáðu fullan aðgang að öllu efni</li>
              <li>Kjóstu bestu spurningarnar og svörin</li>
            </ol>
          </div>
          
          <div className="qa-card">
            <h2 className="text-2xl font-semibold mb-4 text-qa-secondary">Af hverju að taka þátt?</h2>
            <ul className="space-y-4 list-disc list-inside text-gray-700">
              <li>Deildu þekkingu þinni með öðrum</li>
              <li>Hjálpaðu við að byggja upp verðmætan þekkingargrunn</li>
              <li>Lærðu frá fjölbreyttu samfélagi</li>
              <li>Fáðu viðurkenningu fyrir gæðaefni</li>
            </ul>
          </div>
        </div>
        
        {topQuestions.length > 0 && (
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Vinsælustu spurningarnar</h2>
              {hasContributed && (
                <Link to="/browse" className="text-qa-primary hover:underline">
                  Skoða allar spurningar
                </Link>
              )}
            </div>
            
            <div className="space-y-4">
              {topQuestions.map(question => (
                <QuestionCard key={question.id} question={question} />
              ))}
            </div>
            
            {!hasContributed && (
              <div className="mt-6 text-center">
                <p className="text-gray-600 mb-4">
                  Viltu sjá fleiri spurningar? Leggðu til til að opna fyrir allt efnið!
                </p>
                <Link to="/contribute" className="qa-button">
                  Leggja til núna
                </Link>
              </div>
            )}
          </div>
        )}
        
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
      </div>
    </Layout>
  );
};

export default Index;
