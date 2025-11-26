# Google OAuth Integration Setup Guide

## Overview
Google Sign-In/Sign-Up OAuth has been successfully integrated into your Hamara Shehar application. Users can now sign up and log in using their Google accounts.

## What's Changed

### 1. **Dependencies Added**
```bash
npm install @react-oauth/google jwt-decode
```

### 2. **Files Modified**
- `client/src/store/authStore.ts` - Added two new methods:
  - `googleSignUp(credentialResponse)` - Handles Google sign-up
  - `googleLogin(credentialResponse)` - Handles Google login
  
- `client/src/main.tsx` - Wrapped app with `GoogleOAuthProvider`

- `client/src/pages/RegisterPage.tsx` - Added Google Sign-In button with divider

- `client/src/pages/LoginPage.tsx` - Added Google Sign-In button with divider

### 3. **New Component Created**
- `client/src/components/auth/GoogleSignInButton.tsx` - Reusable Google Sign-In button component

## Setup Instructions

### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the "Google+ API" and "Identity and Access Management (IAM) API"
4. Go to **Credentials** → **Create Credentials** → **OAuth Client ID**
5. Choose **Web application**
6. Add authorized redirect URIs:
   - `http://localhost:5173` (for local development with Vite)
   - `http://localhost:3000` (if using different port)
   - Your production domain (when deploying)
7. Copy the **Client ID**

### Step 2: Set Environment Variables

Create a `.env.local` file in the `client/` directory:

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

Replace `your_google_client_id_here` with your actual Client ID from Google Cloud Console.

**Note**: Vite requires environment variables to be prefixed with `VITE_` to be exposed to the client-side code.

### Step 3: Restart Development Server

After adding the `.env.local` file, restart your development server:

```bash
npm run dev
# or
npm run start-client
```

## How It Works

### Sign Up Flow
1. User clicks "Sign up with Google" button on RegisterPage
2. Google Sign-In popup appears
3. User authenticates with their Google account
4. JWT token is received and decoded
5. User data (email, name, picture) is extracted from the token
6. New user is created with role "citizen" by default
7. User is automatically logged in and redirected to homepage

### Login Flow
1. User clicks "Sign in with Google" button on LoginPage
2. Google Sign-In popup appears
3. User authenticates with their Google account
4. JWT token is received and decoded
5. Existing user is found by email
6. User is logged in and redirected to homepage
7. If user doesn't exist, error message is shown prompting to sign up

## User Data Mapping

When a user signs up with Google, the following data is extracted:

```typescript
{
  id: 'google-{timestamp}',
  name: decoded.name,           // From Google profile
  email: decoded.email,         // From Google profile
  role: 'citizen',              // Default role for Google sign-ups
  avatar: decoded.picture,      // From Google profile (optional)
  createdAt: new Date()
}
```

## Features

✅ **Google Sign-Up** - Create new accounts using Google credentials
✅ **Google Login** - Sign in with existing Google account
✅ **Auto-logout** - Secure session management
✅ **Error Handling** - User-friendly error messages
✅ **Loading States** - Visual feedback during authentication
✅ **JWT Decoding** - Secure token handling
✅ **Role Assignment** - Default role for new users
✅ **Existing User Recognition** - Sign up with existing Google email logs in existing user

## Testing

### Test Sign-Up
1. Navigate to http://localhost:5173/register
2. Click "Sign up with Google"
3. Use a test Google account to sign up
4. You should be redirected to the homepage

### Test Login
1. Navigate to http://localhost:5173/login
2. Click "Sign in with Google"
3. Use the same Google account from sign-up
4. You should be logged in and redirected to homepage

### Test Non-Existent Account
1. Navigate to http://localhost:5173/login
2. Click "Sign in with Google"
3. Use a different Google account (not used for sign-up)
4. You should see an error: "No account found with this Google email. Please sign up first."

## Troubleshooting

### "Invalid Google account data" error
- This means the JWT token couldn't be decoded properly
- Check that your Google Client ID is correct
- Clear browser cache and try again

### Google button not appearing
- Verify that your `.env.local` file has the correct `VITE_GOOGLE_CLIENT_ID`
- Check browser console for errors
- Make sure development server was restarted after adding `.env.local`

### CORS errors
- If you see CORS errors, add your current URL to the authorized origins in Google Cloud Console
- For development: http://localhost:5173
- For production: your actual domain

### "No account found" on login
- This is expected if you haven't signed up with that Google email yet
- Click "Create Account" and sign up with the same Google email

## Future Enhancements

1. **Social Account Linking** - Allow linking Google account with existing email/password accounts
2. **Email Verification** - Verify email ownership when linking
3. **Additional OAuth Providers** - Add GitHub, Facebook, etc.
4. **Role Selection for Google Users** - Allow users to select role during Google sign-up
5. **Profile Picture Sync** - Automatically sync Google profile picture
6. **Refresh Token Handling** - Implement token refresh for longer sessions

## Security Considerations

- ✅ JWT tokens are decoded client-side using `jwt-decode`
- ✅ No sensitive data is stored in localStorage (implement if needed)
- ✅ Google handles the authentication security
- ✅ Always use HTTPS in production
- ✅ Keep your Google Client ID secret (only for web/client-side use)
- ✅ Never expose your Google Client Secret in frontend code

## Questions?

If you have any issues:
1. Check the browser console for error messages
2. Verify your Google Cloud Console setup
3. Ensure `.env.local` is in the `client/` directory
4. Make sure development server was restarted

Happy coding! 🚀
