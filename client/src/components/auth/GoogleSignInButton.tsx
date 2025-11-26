import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

interface GoogleSignInButtonProps {
  type: 'login' | 'signup';
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ type }) => {
  const { googleLogin, googleSignUp, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse: any) => {
    try {
      if (type === 'login') {
        await googleLogin(credentialResponse);
      } else {
        await googleSignUp(credentialResponse);
      }
      // Navigate after successful auth (wait for auth state to update)
      setTimeout(() => {
        const { isAuthenticated } = useAuthStore.getState();
        if (isAuthenticated) {
          navigate('/');
        }
      }, 500);
    } catch (error) {
      console.error('Google auth error:', error);
    }
  };

  const handleError = () => {
    console.error('Google Sign-In failed');
  };

  return (
    <div className="w-full">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        type={type === 'login' ? 'standard' : 'standard'}
        theme="outline"
        size="large"
        text={type === 'login' ? 'signin_with' : 'signup_with'}
        locale="en_US"
      />
    </div>
  );
};

export default GoogleSignInButton;
