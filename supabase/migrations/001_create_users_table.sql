-- Create users table in public schema
CREATE TABLE IF NOT EXISTS public.users (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    street_address TEXT,
    city TEXT,
    country TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
-- CREATE INDEX IF NOT EXISTS idx_users_uuid ON public.users(uuid);
-- CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = uuid);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = uuid);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = uuid);

-- Users can view other users' profiles (for the messaging app)
CREATE POLICY "Users can view other profiles" ON public.users
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER handle_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create function to get user info (replaces the RPC function)
CREATE OR REPLACE FUNCTION public.get_user_info(input_uuid_id UUID)
RETURNS TABLE (
    id BIGINT,
    uuid UUID,
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    street_address TEXT,
    city TEXT,
    country TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.uuid,
        u.email,
        u.first_name,
        u.last_name,
        u.phone,
        u.avatar_url,
        u.street_address,
        u.city,
        u.country,
        u.created_at,
        u.updated_at
    FROM public.users u
    WHERE u.uuid = input_uuid_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.users TO authenticated;
