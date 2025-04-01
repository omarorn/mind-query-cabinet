
import React from 'react';
import { useToast } from '@/components/ui/use-toast';
import DualText from '@/components/DualText';
import AIQuestionButton from '@/components/AIQuestionButton';

interface ContributionStatsProps {
  userQuestionCount: number;
  userAnswerCount: number;
  hasContributed: boolean;
  onQuestionGenerated: (title: string, content: string) => void;
  magicMode: boolean;
}

const ContributionStats: React.FC<ContributionStatsProps> = ({ 
  userQuestionCount, 
  userAnswerCount, 
  hasContributed,
  onQuestionGenerated,
  magicMode
}) => {
  return (
    <div className="qa-card mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">
          <DualText textKey="yourContributions" />
        </h2>
        <div className="text-sm bg-qa-primary/10 text-qa-primary px-3 py-1 rounded-full">
          {userQuestionCount + userAnswerCount}/3 <DualText textKey="required" />
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 p-4 border rounded-md bg-gray-50">
          <div className="text-2xl font-bold text-qa-primary">{userQuestionCount}</div>
          <DualText textKey="questions" className="text-gray-600" />
        </div>
        <div className="flex-1 p-4 border rounded-md bg-gray-50">
          <div className="text-2xl font-bold text-qa-secondary">{userAnswerCount}</div>
          <DualText textKey="answers" className="text-gray-600" />
        </div>
        <div className="flex-1 p-4 border rounded-md bg-gray-50">
          <div className="text-2xl font-bold text-qa-accent">
            <DualText textKey={hasContributed ? "yes" : "notYet"} />
          </div>
          <DualText textKey="fullAccess" className="text-gray-600" />
        </div>
      </div>
      
      {hasContributed && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md text-green-800">
          <p className="font-medium">
            <DualText textKey="congratulations" />
          </p>
          <p>
            <DualText textKey="contributionComplete" />
          </p>
        </div>
      )}

      <div className="mt-6">
        <AIQuestionButton onQuestionGenerated={onQuestionGenerated} magicMode={magicMode} />
      </div>
    </div>
  );
};

export default ContributionStats;
