import { createClient } from '@supabase/supabase-js';

// Grab the environment keys we configured in the .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a single, reusable Supabase client instance for your React app
export const supabase = createClient(supabaseUrl, supabaseAnonKey);