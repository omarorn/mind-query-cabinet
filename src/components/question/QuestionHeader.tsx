
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import DualText from "@/components/DualText";

const QuestionHeader = () => {
  const navigate = useNavigate();
  
  return (
    <Button 
      variant="outline" 
      onClick={() => navigate("/browse")}
      className="mb-6"
    >
      <DualText textKey="backToQuestions" />
    </Button>
  );
};

export default QuestionHeader;
