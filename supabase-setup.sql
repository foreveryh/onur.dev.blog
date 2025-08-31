-- Create the raindrop_tokens table for storing encrypted OAuth tokens
CREATE TABLE IF NOT EXISTS raindrop_tokens (
    id TEXT PRIMARY KEY,
    encrypted_data TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_raindrop_tokens_updated_at ON raindrop_tokens(updated_at);

-- Enable Row Level Security (RLS)
ALTER TABLE raindrop_tokens ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (since this is a server-side only table)
-- In production, you might want to restrict this further based on your security requirements
CREATE POLICY "Allow all operations on raindrop_tokens" ON raindrop_tokens
FOR ALL USING (true) WITH CHECK (true);

-- Grant necessary permissions to authenticated role
GRANT ALL ON raindrop_tokens TO authenticated;
GRANT ALL ON raindrop_tokens TO service_role;