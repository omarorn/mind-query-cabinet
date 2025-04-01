
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import DualText from '@/components/DualText';
import { useLanguage } from '@/context/LanguageContext';

interface UserCreationFormProps {
  createUser: (name: string, email?: string) => void;
}

const UserCreationForm: React.FC<UserCreationFormProps> = ({ createUser }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
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
    
    if (email && !email.includes('@')) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }
    
    createUser(name.trim(), email.trim());
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
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            <DualText textKey="yourEmail" />
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("enterYourEmail").en || "Enter your email"}
          />
          <p className="text-xs text-gray-500 mt-1">
            <DualText textKey="emailHelp" />
          </p>
        </div>
        <Button type="submit" className="w-full">
          <DualText textKey="createAccount" />
        </Button>
      </form>
    </div>
  );
};

export default UserCreationForm;
