/*
  # Update links table policies for user-specific access

  1. Security Changes
    - Drop existing broad policy
    - Add user-specific policies for CRUD operations
    - Ensure users can only access their own links

  2. Notes
    - Links are now tied to the authenticated user's ID
    - Each user will only see and manage their own links
*/

-- Drop the existing broad policy
DROP POLICY IF EXISTS "Users can manage their own links" ON links;

-- Add user_id column to links table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'links' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE links ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create user-specific policies
CREATE POLICY "Users can view own links"
  ON links
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own links"
  ON links
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own links"
  ON links
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own links"
  ON links
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);