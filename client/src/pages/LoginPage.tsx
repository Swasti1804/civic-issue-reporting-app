import React, { useState, useEffect } from 'react';
import AuthForm from '../components/auth/AuthForm';
import GoogleSignInButton from '../components/auth/GoogleSignInButton';
import { Box, Container, Typography, Paper, CssBaseline, keyframes, styled, Divider } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Enhanced animations
const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-30px) rotate(5deg); }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.7; }
  50% { transform: scale(1.2); opacity: 0.9; }
  100% { transform: scale(1); opacity: 0.7; }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const gradientFlow = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const travelPath = keyframes`
  0% { transform: translate(0, 0); }
  25% { transform: translate(50vw, -20vh); }
  50% { transform: translate(30vw, 30vh); }
  75% { transform: translate(-40vw, 10vh); }
  100% { transform: translate(0, 0); }
`;

const FloatingShape = styled(Box)(({ theme }) => ({
  position: 'absolute',
  borderRadius: '50%',
  filter: 'blur(40px)',
  opacity: 0,
  zIndex: 0,
  animation: `${float} 8s ease-in-out infinite, ${pulse} 6s ease-in-out infinite`,
}));

const TravelingShape = styled(Box)(({ theme }) => ({
  position: 'absolute',
  borderRadius: '50%',
  filter: 'blur(30px)',
  opacity: 0.6,
  zIndex: 0,
  animation: `${travelPath} 30s linear infinite, ${pulse} 8s ease-in-out infinite`,
}));

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF4D4D',
      contrastText: '#fff',
    },
    secondary: {
      main: '#00E0FF',
    },
    background: {
      default: '#1A1A2E',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Helvetica", sans-serif',
    h2: {
      fontWeight: 800,
      background: 'linear-gradient(45deg, #FF4D4D, #00E0FF, #FF4D4D)',
      backgroundSize: '300% 300%',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      animation: `${gradientFlow} 6s ease infinite`,
      textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          borderRadius: 50,
          padding: '12px 28px',
          textTransform: 'none',
          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
          '&:hover': {
            transform: 'translateY(-5px) scale(1.05)',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 50,
            transition: 'all 0.3s',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
            '&:hover fieldset': {
              borderColor: '#00E0FF',
              boxShadow: '0 0 10px rgba(0, 224, 255, 0.2)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#FF4D4D',
              boxShadow: '0 0 15px rgba(255, 77, 77, 0.3)',
            },
          },
        },
      },
    },
  },
});

const LoginPage: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Generate random positions for floating shapes
  const generateShapes = (count: number, sizeRange: [number, number]) => {
    return Array.from({ length: count }).map((_, i) => ({
      size: Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0],
      top: Math.random() * 100,
      left: Math.random() * 100,
      color: i % 3 === 0 ? '#FF4D4D' : i % 3 === 1 ? '#00E0FF' : '#FFE45E',
      delay: Math.random() * 5,
      duration: 6 + Math.random() * 6,
    }));
  };

  const floatingShapes = generateShapes(8, [100, 300]);
  const travelingShapes = generateShapes(4, [50, 150]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          background: `
            linear-gradient(135deg, rgba(26, 26, 46, 0.9) 0%, rgba(26, 26, 46, 0.7) 100%),
            url('https://www.worldatlas.com/r/w1200/upload/e4/b9/5a/shutterstock-149304008.jpg')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at 20% 50%, rgba(255, 77, 77, 0.15) 0%, transparent 40%)',
            animation: `${pulse} 8s ease infinite`,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at 80% 50%, rgba(0, 224, 255, 0.15) 0%, transparent 40%)',
            animation: `${pulse} 10s ease infinite 2s`,
          },
        }}
      >
        {/* Animated background elements */}
        {floatingShapes.map((shape, i) => (
          <FloatingShape
            key={`float-${i}`}
            sx={{
              width: shape.size,
              height: shape.size,
              background: `radial-gradient(circle, ${shape.color}, transparent 70%)`,
              top: `${shape.top}%`,
              left: `${shape.left}%`,
              animationDelay: `${shape.delay}s`,
              animationDuration: `${shape.duration}s`,
            }}
          />
        ))}

        {travelingShapes.map((shape, i) => (
          <TravelingShape
            key={`travel-${i}`}
            sx={{
              width: shape.size,
              height: shape.size,
              background: `radial-gradient(circle, ${shape.color}, transparent 70%)`,
              animationDelay: `${shape.delay}s`,
              animationDuration: `${shape.duration * 2}s`,
            }}
          />
        ))}

        {/* Rotating geometric shapes */}
        <Box
          sx={{
            position: 'absolute',
            width: 400,
            height: 400,
            top: '10%',
            right: '5%',
            backgroundImage: 'radial-gradient(circle, transparent 60%, rgba(255, 228, 94, 0.1) 60%)',
            animation: `${rotate} 60s linear infinite`,
            opacity: 0.3,
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            width: 500,
            height: 500,
            bottom: '5%',
            left: '5%',
            backgroundImage: 'repeating-radial-gradient(circle, transparent 0%, transparent 10%, rgba(0, 224, 255, 0.1) 10%, rgba(0, 224, 255, 0.1) 20%)',
            backgroundSize: '30px 30px',
            animation: `${rotate} 80s linear infinite reverse`,
            opacity: 0.3,
          }}
        />

        <Container maxWidth="sm">
          <Paper
            elevation={24}
            sx={{
              position: 'relative',
              padding: { xs: 3, sm: 4, md: 5 },
              borderRadius: 4,
              background: 'rgba(26, 26, 46, 0.7)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: `
                0 8px 32px rgba(0, 0, 0, 0.4),
                inset 0 0 20px rgba(255, 255, 255, 0.1),
                0 0 30px rgba(255, 77, 77, 0.2),
                0 0 30px rgba(0, 224, 255, 0.2)
              `,
              transform: mounted ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
              opacity: mounted ? 1 : 0,
              transition: 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              '&:hover': {
                transform: 'translateY(-5px) scale(1.01)',
                boxShadow: `
                  0 12px 40px rgba(0, 0, 0, 0.5),
                  inset 0 0 20px rgba(255, 255, 255, 0.15),
                  0 0 40px rgba(255, 77, 77, 0.3),
                  0 0 40px rgba(0, 224, 255, 0.3)
                `,
              },
            }}
          >
            <Box textAlign="center" mb={4}>
              <Typography 
                variant="h2" 
                component="h1" 
                gutterBottom
                sx={{
                  mb: 3,
                  fontSize: { xs: '2rem', sm: '2.8rem', md: '3rem' },
                }}
              >
                Global Explorer
              </Typography>
              <Typography 
                variant="body1" 
                sx={{
                  color: 'rgba(255, 255, 255, 0.85)',
                  fontWeight: 500,
                  fontSize: '1.1rem',
                  maxWidth: 400,
                  mx: 'auto',
                  textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
                }}
              >
                Sign in to chart your course across the world's wonders
              </Typography>
            </Box>
            
            <AuthForm type="login" />
            
            <Box mt={4} mb={3}>
              <Divider sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>OR</Divider>
            </Box>

            <Box mb={2}>
              <GoogleSignInButton type="login" />
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default LoginPage;
