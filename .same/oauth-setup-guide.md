# 🚀 Production OAuth & API Credentials Setup Guide

## Overview
This guide will help you set up production credentials for:
- **hCaptcha** - Security verification
- **Spotify OAuth** - Artist authentication
- **Instagram OAuth** - Creator authentication

## 1. 🔒 hCaptcha Production Setup

### Step 1: Create hCaptcha Account
1. Go to [hCaptcha.com](https://www.hcaptcha.com/)
2. Click "Sign Up" and create your account
3. Verify your email address

### Step 2: Create New Site
1. Login to hCaptcha dashboard
2. Click "New Site"
3. Enter your site details:
   - **Site Name**: WinningDistro Platform
   - **Hostname**: `your-domain.com` (add your actual domain)
   - **Hostname**: `localhost` (for development)
   - **Hostname**: `same-*.netlify.app` (for Netlify deployment)

### Step 3: Get Your Keys
1. Copy your **Site Key** and **Secret Key**
2. Update your `.env` file:
```bash
VITE_HCAPTCHA_SITE_KEY=your_actual_site_key_here
VITE_HCAPTCHA_SECRET_KEY=your_actual_secret_key_here
```

## 2. 🎵 Spotify OAuth Setup

### Step 1: Create Spotify App
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Login with your Spotify account
3. Click "Create App"
4. Fill in app details:
   - **App Name**: WinningDistro Platform
   - **App Description**: Music distribution platform for artists
   - **Website**: `https://your-domain.com`
   - **Redirect URI**: `https://your-domain.com/auth/spotify/callback`
   - **Redirect URI**: `http://localhost:5173/auth/spotify/callback` (for development)

### Step 2: Configure App Settings
1. Select **Web API** as the API to use
2. Add these redirect URIs:
   - `https://your-domain.com/auth/spotify/callback`
   - `https://your-netlify-url.netlify.app/auth/spotify/callback`
   - `http://localhost:5173/auth/spotify/callback`

### Step 3: Get Your Credentials
1. Copy your **Client ID** and **Client Secret**
2. Update your `.env` file:
```bash
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id_here
VITE_SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
VITE_SPOTIFY_REDIRECT_URI=https://your-domain.com/auth/spotify/callback
```

### Step 4: Request Extended Quota (Optional)
- For production apps with >25 users, submit for extended quota mode
- Provide screenshots, app description, and use case

## 3. 📸 Instagram OAuth Setup

### Step 1: Create Facebook App
1. Go to [Facebook Developers](https://developers.facebook.com/apps/)
2. Click "Create App"
3. Select "Consumer" as app type
4. Fill in app details:
   - **App Name**: WinningDistro Platform
   - **App Contact Email**: your-email@domain.com

### Step 2: Add Instagram Basic Display
1. In your app dashboard, click "Add Product"
2. Find "Instagram Basic Display" and click "Set Up"
3. Click "Create New App" when prompted

### Step 3: Configure Basic Display
1. Go to Instagram Basic Display > Basic Display
2. Add Instagram App ID to your app
3. Configure redirect URIs:
   - `https://your-domain.com/auth/instagram/callback`
   - `https://your-netlify-url.netlify.app/auth/instagram/callback`
   - `http://localhost:5173/auth/instagram/callback`

### Step 4: Get Your Credentials
1. Copy your **Instagram App ID** and **Instagram App Secret**
2. Update your `.env` file:
```bash
VITE_INSTAGRAM_APP_ID=your_instagram_app_id_here
VITE_INSTAGRAM_APP_SECRET=your_instagram_app_secret_here
VITE_INSTAGRAM_REDIRECT_URI=https://your-domain.com/auth/instagram/callback
```

### Step 5: Add Test Users (Development)
1. Go to Instagram Basic Display > Basic Display
2. Scroll to "User Token Generator"
3. Add Instagram test users for development

## 4. 🔧 Environment Variables Summary

Update your `.env` file with all production credentials:

```bash
# hCaptcha Configuration
VITE_HCAPTCHA_SITE_KEY=your_actual_site_key_here
VITE_HCAPTCHA_SECRET_KEY=your_actual_secret_key_here

# Spotify OAuth Configuration
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id_here
VITE_SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
VITE_SPOTIFY_REDIRECT_URI=https://your-domain.com/auth/spotify/callback

# Instagram OAuth Configuration
VITE_INSTAGRAM_APP_ID=your_instagram_app_id_here
VITE_INSTAGRAM_APP_SECRET=your_instagram_app_secret_here
VITE_INSTAGRAM_REDIRECT_URI=https://your-domain.com/auth/instagram/callback

# Database Configuration
DATABASE_URL=postgresql://username:password@your-neon-endpoint.neon.tech/database_name?sslmode=require
```

## 5. 🚀 Deployment Configuration

### Netlify Environment Variables
1. Go to your Netlify dashboard
2. Select your site > Site Settings > Environment Variables
3. Add all the environment variables above (without `VITE_` prefix for server-side vars)

### Domain Configuration
1. Update all OAuth redirect URIs with your actual domain
2. Update hCaptcha hostname settings
3. Test all integrations on staging before production

## 6. 🧪 Testing Checklist

### hCaptcha Testing
- [ ] Test captcha loads on signup page
- [ ] Verify dark theme compatibility
- [ ] Test form submission with captcha token
- [ ] Check error handling for failed captcha

### Spotify OAuth Testing
- [ ] Test "Sign in with Spotify" button
- [ ] Verify OAuth redirect flow
- [ ] Test artist profile fetching
- [ ] Check error handling for denied permissions

### Instagram OAuth Testing
- [ ] Test "Sign in with Instagram" button
- [ ] Verify OAuth redirect flow
- [ ] Test profile data fetching
- [ ] Check error handling for private accounts

## 7. 🔐 Security Best Practices

1. **Never expose secrets in frontend code**
2. **Use HTTPS in production**
3. **Implement proper CORS headers**
4. **Validate all OAuth tokens server-side**
5. **Store tokens securely (encrypted)**
6. **Implement token refresh logic**
7. **Add rate limiting for API calls**

## 8. 📞 Support Contacts

- **hCaptcha Support**: [support@hcaptcha.com](mailto:support@hcaptcha.com)
- **Spotify Developer Support**: [Spotify Developer Community](https://community.spotify.com/t5/Spotify-for-Developers/bd-p/Spotify_Developer)
- **Instagram API Support**: [Facebook Developer Support](https://developers.facebook.com/support/)

---

## Quick Start Commands

After setting up all credentials:

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Test production build
bun run build
bun run preview
```

**⚠️ Important**: Never commit your `.env` file. Add it to `.gitignore` and use environment variables in production.
