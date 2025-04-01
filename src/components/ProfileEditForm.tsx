
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useQA } from '@/context/QAContext';
import { useToast } from '@/components/ui/use-toast';
import DualText from '@/components/DualText';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/context/LanguageContext';

const ProfileEditForm: React.FC = () => {
  const { user, updateUser, logout } = useQA();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) {
    navigate('/');
    return null;
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Name is required",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    updateUser(name, email)
      .then(() => {
        toast({
          title: "Success",
          description: "Your profile has been updated",
        });
        navigate('/');
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: error.message || "Failed to update profile",
          variant: "destructive"
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center"><DualText textKey="editProfile" fallback="Edit Profile" /></CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name"><DualText textKey="name" fallback="Name" /></Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("enterName")?.en || "Enter your name"}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email"><DualText textKey="email" fallback="Email" /></Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("enterEmail")?.en || "Enter your email"}
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/')}
              disabled={isSubmitting}
            >
              <DualText textKey="cancel" fallback="Cancel" />
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 
                <DualText textKey="saving" fallback="Saving..." /> : 
                <DualText textKey="saveChanges" fallback="Save Changes" />
              }
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col space-y-4">
        <div className="w-full border-t pt-4">
          <Button 
            variant="destructive" 
            className="w-full" 
            onClick={logout}
          >
            <DualText textKey="logout" fallback="Log Out" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProfileEditForm;
