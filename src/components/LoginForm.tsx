
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import DualText from '@/components/DualText';
import { useQA } from '@/context/QAContext';
import { useLanguage } from '@/context/LanguageContext';
import { Link } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const { t } = useLanguage();
  const { user, login, logout } = useQA();
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }
    
    login(email.trim());
  };
  
  if (user?.email) {
    return (
      <div className="flex items-center gap-2">
        <Link to="/profile" className="text-sm hover:underline">
          {user.email}
        </Link>
        <Button variant="outline" size="sm" onClick={logout}>
          <DualText textKey="logout" />
        </Button>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleLogin} className="flex gap-2 items-end">
      <div>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("enterEmail").en || "Enter your email"}
          required
        />
      </div>
      <Button type="submit" size="sm">
        <DualText textKey="login" />
      </Button>
    </form>
  );
};

export default LoginForm;
