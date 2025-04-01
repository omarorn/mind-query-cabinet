
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useQA } from "@/context/QAContext";
import AdminControls from "@/components/AdminControls";
import QuestionHeader from "@/components/question/QuestionHeader";
import QuestionContent from "@/components/question/QuestionContent";
import AnswerList from "@/components/question/AnswerList";
import NewsletterSignup from "@/components/question/NewsletterSignup";
import AnswerForm from "@/components/question/AnswerForm";
import DualText from "@/components/DualText";

const QuestionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { questions, answers, user, hasContributed } = useQA();
  
  if (!hasContributed) {
    navigate("/contribute");
    return null;
  }
  
  const question = questions.find(q => q.id === id);
  
  if (!question) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">
            <DualText textKey="questionNotFound" />
          </h1>
          <p className="text-gray-600 mb-6">
            <DualText textKey="questionNotFoundDesc" />
          </p>
          <QuestionHeader />
        </div>
      </Layout>
    );
  }
  
  const questionAnswers = answers.filter(a => a.questionId === id)
    .sort((a, b) => b.upvotes - a.upvotes);
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <QuestionHeader />
        <QuestionContent question={question} />
        <AnswerList answers={questionAnswers} />
        <NewsletterSignup />
        <AnswerForm questionId={question.id} />
        
        {user?.isAdmin && (
          <AdminControls question={question} answers={questionAnswers} />
        )}
      </div>
    </Layout>
  );
};

export default QuestionDetail;
