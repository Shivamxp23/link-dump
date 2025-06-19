/*
  # Update links table policies for public access

  1. Changes
    - Remove user-specific policies that restrict access to own links only
    - Add public policies that allow all authenticated users to access all links
    - Enable shared link collection across all users

  2. Security
    - Maintain RLS protection
    - Allow all authenticated users to view, insert, update, and delete any links
    - Remove user_id restrictions for shared access
*/

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can view own links" ON links;
DROP POLICY IF EXISTS "Users can insert own links" ON links;
DROP POLICY IF EXISTS "Users can update own links" ON links;
DROP POLICY IF EXISTS "Users can delete own links" ON links;
DROP POLICY IF EXISTS "Allow authenticated users to view all links" ON links;
DROP POLICY IF EXISTS "Allow authenticated users to insert links" ON links;
DROP POLICY IF EXISTS "Allow authenticated users to update links" ON links;
DROP POLICY IF EXISTS "Allow authenticated users to delete links" ON links;
DROP POLICY IF EXISTS "Users can manage their own links" ON links;
DROP POLICY IF EXISTS "Allow authenticated users to select links" ON links;
DROP POLICY IF EXISTS "Allow authenticated users to delete links" ON links;

-- Create new public access policies with unique names
CREATE POLICY "Public view access for authenticated users"
  ON links
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Public insert access for authenticated users"
  ON links
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Public update access for authenticated users"
  ON links
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public delete access for authenticated users"
  ON links
  FOR DELETE
  TO authenticated
  USING (true);