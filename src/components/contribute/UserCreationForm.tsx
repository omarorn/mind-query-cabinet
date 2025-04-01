
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import DualText from '@/components/DualText';
import { useLanguage } from '@/context/LanguageContext';

interface UserCreationFormProps {
  createUser: (name: string) => void;
}

const UserCreationForm: React.FC<UserCreationFormProps> = ({ createUser }) => {
  const [name, setName] = useState("");
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter your name",
        variant: "destructive"
      });
      return;
    }
    createUser(name.trim());
  };
  
  return (
    <div className="qa-card">
      <h2 className="text-xl font-semibold mb-4">
        <DualText textKey="getStarted" />
      </h2>
      <form onSubmit={handleCreateUser}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            <DualText textKey="yourName" />
          </label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("enterYourName").en}
            required
          />
        </div>
        <Button type="submit" className="w-full">
          <DualText textKey="createAccount" />
        </Button>
      </form>
    </div>
  );
};

export default UserCreationForm;
