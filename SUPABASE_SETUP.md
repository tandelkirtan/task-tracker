# Supabase Integration Setup Guide

This guide will help you set up Supabase as the backend for your Task Manager application with email/password authentication and Google OAuth.

## Prerequisites

- A Supabase account (free tier works)
- Google Cloud Console account for OAuth setup (optional, for Google login)

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose a name (e.g., "task-manager")
4. Set a database password (save this securely)
5. Choose a region closest to your users
6. Click "Create new project"

## Step 2: Configure Email Authentication

### Disable Email Confirmation (For Development)

1. In Supabase dashboard, go to "Authentication" > "Providers"
2. Click on "Email"
3. Disable "Confirm email" toggle (for easier testing)
4. Enable "Enable email provider" if not already enabled

### Enable Email Confirmation (For Production)

For production, keep email confirmation enabled to verify user email addresses.

## Step 3: Set Up Google OAuth (Optional)

### In Google Cloud Console:

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Go to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Application type: "Web application"
6. Name: "Task Manager"
7. Authorized redirect URIs:
   - Add your local development URL: `http://localhost:5173/auth/callback`
   - Add your production URL when deployed
8. Click "Create"
9. Copy the **Client ID** and **Client Secret**

### In Supabase Dashboard:

1. Go to your project dashboard
2. Navigate to "Authentication" > "Providers"
3. Click on "Google"
4. Enable the Google provider
5. Paste the Google Client ID and Client Secret
6. Save the configuration

## Step 4: Set Up Database Table

1. In Supabase dashboard, go to "SQL Editor"
2. Click "New Query"
3. Copy and paste the contents of `supabase-setup.sql`
4. Click "Run" to execute the SQL

This will create:
- A `tasks` table with proper schema
- Row Level Security (RLS) policies
- Indexes for performance

## Step 5: Configure Environment Variables

1. In Supabase dashboard, go to "Project Settings" > "API"
2. Copy the following values:
   - **Project URL** (starts with https://)
   - **anon public** key (starts with eyJ...)

3. Add these to your `.env` file in the project root:
```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## Step 6: Install Dependencies

The required package has already been installed:
```bash
npm install @supabase/supabase-js
```

## Step 7: Run the Application

1. Start the development server:
```bash
npm run dev
```

2. Open your browser to `http://localhost:5173`

3. You'll see the Login/Register page with:
   - **Email/Password Login**: Sign in with your email and password
   - **Email/Password Registration**: Create a new account
   - **Google OAuth**: Sign in with Google (if configured)

4. After authentication, you'll be redirected to the Task Manager dashboard

## Authentication Features

### Email/Password Authentication
- **Sign Up**: Users can register with email, password, and full name
- **Sign In**: Users can log in with email and password
- **Email Verification**: Can be enabled for production (disabled for development)
- **Password Requirements**: Minimum 6 characters

### Google OAuth (Optional)
- One-click authentication with Google account
- Automatic profile data (name, email, avatar) retrieval
- Seamless integration with existing auth system

### Session Management
- Automatic session persistence
- Session refresh on page reload
- Secure logout functionality

## How It Works

### Authentication Flow
- User lands on Login/Register page
- Can choose between email/password or Google OAuth
- Email/Password: Direct authentication with Supabase Auth
- Google OAuth: Redirected to Google, then back with session
- Supabase manages the session automatically
- User profile data is stored in Supabase Auth

### Data Security
- Row Level Security (RLS) ensures users can only access their own tasks
- All database operations are filtered by `user_id`
- Tasks are automatically associated with the authenticated user
- Secure API calls using Supabase anon key

### Task Operations
- **Create**: Tasks are inserted with the current user's ID
- **Read**: Only tasks belonging to the current user are fetched
- **Update**: Users can only modify their own tasks
- **Delete**: Users can only delete their own tasks

## Troubleshooting

### "Invalid JWT" Error
- Make sure your Supabase URL and anon key are correct in `.env`
- Check that email provider is enabled in Supabase

### Email Confirmation Required
- For development: Disable email confirmation in Supabase Auth settings
- For production: Keep it enabled for security

### Tasks Not Saving
- Verify the SQL setup was executed successfully
- Check the Supabase logs for any errors
- Ensure RLS policies are enabled
- Verify user is authenticated

### Google OAuth Not Working
- Verify redirect URI matches exactly (including trailing slashes)
- Check that Google Client ID and Secret are correct
- Make sure Google OAuth provider is enabled in Supabase
- Ensure Google Cloud Console has correct redirect URIs

### "User not found" Error
- Check if user registration was successful
- Verify email confirmation (if enabled)
- Check Supabase Auth logs for registration errors

## Production Deployment

When deploying to production:

1. **Email Confirmation**: Enable email confirmation for security
2. **Google OAuth**: Update redirect URIs to production domain
3. **Environment Variables**: Add production credentials to hosting platform
4. **Domain Security**: Add production domain to Supabase allowed domains
5. **SSL/TLS**: Ensure HTTPS is enabled for secure authentication

## Database Schema Reference

### Tasks Table
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY,
  created_at TIMESTAMP,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT CHECK (priority IN ('High', 'Medium', 'Low')),
  status TEXT CHECK (status IN ('TODO', 'IN-PROGRESS', 'DONE')),
  date TEXT NOT NULL,
  category TEXT DEFAULT 'General'
);
```

### RLS Policies
- Users can SELECT their own tasks
- Users can INSERT their own tasks
- Users can UPDATE their own tasks
- Users can DELETE their own tasks

## Security Best Practices

1. **Never expose service role keys** - Only use anon/public keys in frontend
2. **Enable RLS** - Always enable Row Level Security on user data
3. **Email verification** - Enable for production to prevent fake accounts
4. **Strong passwords** - Enforce minimum password requirements
5. **HTTPS only** - Always use HTTPS in production
6. **Rate limiting** - Configure rate limiting in Supabase to prevent abuse
