-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT NOT NULL CHECK (priority IN ('High', 'Medium', 'Low')),
  status TEXT NOT NULL CHECK (status IN ('TODO', 'IN-PROGRESS', 'DONE')),
  date TEXT NOT NULL,
  category TEXT DEFAULT 'General'
);

-- Enable Row Level Security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can insert own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can update own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can delete own tasks" ON tasks;

-- Create policy to allow users to see only their own tasks
CREATE POLICY "Users can view own tasks"
ON tasks FOR SELECT
USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own tasks
CREATE POLICY "Users can insert own tasks"
ON tasks FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own tasks
CREATE POLICY "Users can update own tasks"
ON tasks FOR UPDATE
USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own tasks
CREATE POLICY "Users can delete own tasks"
ON tasks FOR DELETE
USING (auth.uid() = user_id);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);

