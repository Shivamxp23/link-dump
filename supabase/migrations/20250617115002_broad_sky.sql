/*
  # Create links table

  1. New Tables
    - `links`
      - `id` (uuid, primary key)
      - `url` (text, required)
      - `title` (text, required)
      - `description` (text, optional)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `links` table
    - Add policy for authenticated users to manage their own links
*/

CREATE TABLE IF NOT EXISTS links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own links"
  ON links
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);