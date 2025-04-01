
import React from 'react';
import Layout from '@/components/Layout';
import ProfileEditForm from '@/components/ProfileEditForm';
import { useQA } from '@/context/QAContext';
import { Navigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user } = useQA();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <ProfileEditForm />
      </div>
    </Layout>
  );
};

export default Profile;
