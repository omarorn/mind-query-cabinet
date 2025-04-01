
import { Button } from "../ui/button";

interface ContributionPromptProps {
  onContributeClick: () => void;
}

const ContributionPrompt = ({ onContributeClick }: ContributionPromptProps) => {
  return (
    <div className="qa-card text-center py-8">
      <h2 className="text-xl font-semibold mb-2">
        Þú þarft að leggja þitt af mörkum
      </h2>
      <p className="mb-4 text-gray-600">
        Til að fá aðgang að öllum spurningum þarftu að leggja þitt af mörkum með því að bæta við spurningum eða svörum.
      </p>
      <Button onClick={onContributeClick}>
        Byrja að leggja til
      </Button>
    </div>
  );
};

export default ContributionPrompt;
