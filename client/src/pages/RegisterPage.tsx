import GoogleSignInButton from '../components/auth/GoogleSignInButton';
import { Divider } from '@mui/material';
import React from 'react';
import AuthForm from '../components/auth/AuthForm';
import { Box, Typography, Link } from '@mui/material';
import { styled } from '@mui/material/styles';

const GradientBackground = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
}));

const AuthCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[4],
  padding: theme.spacing(4),
  maxWidth: '500px',
  width: '100%',
  margin: theme.spacing(2),
}));

const RegisterPage: React.FC = () => {
  return (
    <GradientBackground>
      <AuthCard>
        <Box mb={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            Create Account
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Already have an account?{' '}
            <Link href="/login" color="primary" underline="hover">
              Sign in
            </Link>
          </Typography>
        </Box>
        
        <AuthForm type="register" />
        
        <Box mt={4} mb={3}>
          <Divider>OR</Divider>
        </Box>

        <Box mb={4}>
          <GoogleSignInButton type="signup" />
        </Box>
        
        <Box mt={3} textAlign="center">
          <Typography variant="caption" color="textSecondary">
            By registering, you agree to our{' '}
            <Link href="/terms" color="primary" underline="hover">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" color="primary" underline="hover">
              Privacy Policy
            </Link>
          </Typography>
        </Box>
      </AuthCard>
    </GradientBackground>
  );
};

export default RegisterPage;