/*
  # Fix RLS policies for anonymous users

  1. Security Changes
    - Drop existing restrictive policies that only allow authenticated users
    - Add new policies that allow anonymous users to manage links with user_id IS NULL
    - Maintain security by ensuring users can only access links where user_id matches their auth status

  2. Policy Details
    - Anonymous users can only access links where user_id IS NULL
    - Authenticated users can access links where user_id matches their auth.uid()
    - This maintains data isolation while allowing the current app functionality
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Public delete access for authenticated users" ON links;
DROP POLICY IF EXISTS "Public insert access for authenticated users" ON links;
DROP POLICY IF EXISTS "Public update access for authenticated users" ON links;
DROP POLICY IF EXISTS "Public view access for authenticated users" ON links;

-- Create new policies for anonymous users (user_id IS NULL)
CREATE POLICY "Anonymous users can view public links"
  ON links
  FOR SELECT
  TO anon
  USING (user_id IS NULL);

CREATE POLICY "Anonymous users can insert public links"
  ON links
  FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);

CREATE POLICY "Anonymous users can update public links"
  ON links
  FOR UPDATE
  TO anon
  USING (user_id IS NULL)
  WITH CHECK (user_id IS NULL);

CREATE POLICY "Anonymous users can delete public links"
  ON links
  FOR DELETE
  TO anon
  USING (user_id IS NULL);

-- Create policies for authenticated users (user_id matches auth.uid())
CREATE POLICY "Authenticated users can view their own links"
  ON links
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Authenticated users can insert their own links"
  ON links
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Authenticated users can update their own links"
  ON links
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Authenticated users can delete their own links"
  ON links
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());