# Supabase Database Migrations

This directory contains SQL migrations for the Real-Time Messages application.

## Users Table Migration

The `001_create_users_table.sql` migration creates a comprehensive users table in the public schema with the following features:

### Table Structure

```sql
CREATE TABLE public.users (
    id BIGSERIAL PRIMARY KEY,           -- Auto-incrementing primary key
    uuid UUID NOT NULL UNIQUE,          -- References auth.users(id)
    email TEXT NOT NULL,                -- User's email address
    first_name TEXT NOT NULL,           -- User's first name
    last_name TEXT NOT NULL,            -- User's last name
    phone TEXT,                         -- User's phone number
    avatar_url TEXT,                    -- URL to user's avatar image
    street_address TEXT,                -- User's street address
    city TEXT,                          -- User's city
    country TEXT,                       -- User's country
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Key Features

1. **Foreign Key Relationship**: Links to Supabase Auth users via `uuid`
2. **Row Level Security (RLS)**: Enabled with appropriate policies
3. **Indexes**: Optimized for common queries
4. **Auto-updating Timestamps**: `updated_at` automatically updates on record changes
5. **Helper Function**: `get_user_info()` function for easy profile retrieval

### RLS Policies

- Users can view their own profile
- Users can update their own profile  
- Users can insert their own profile
- Users can view other users' profiles (for messaging functionality)

### How to Apply

1. **Using Supabase CLI**:
   ```bash
   supabase db push
   ```

2. **Using Supabase Dashboard**:
   - Copy the SQL from `001_create_users_table.sql`
   - Paste it into the SQL Editor in your Supabase dashboard
   - Execute the migration

### Verification

After applying the migration, verify the table was created correctly:

```sql
-- Check table structure
\d public.users

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'users';

-- Test the get_user_info function
SELECT * FROM public.get_user_info('your-uuid-here');
```

### Application Integration

The migration is designed to work seamlessly with your existing application code:

- `authSlice.ts` uses the `get_user_info()` function
- `usersSlice.ts` queries the `users` table directly
- `RegisterUserDetails.tsx` inserts data into this table structure
- All existing functionality should work without code changes

### Data Migration (if needed)

If you have existing user data in a different table, you can migrate it using:

```sql
-- Example migration from old table (adjust as needed)
INSERT INTO public.users (uuid, email, first_name, last_name, phone, avatar_url, street_address, city, country)
SELECT 
    auth_uuid,
    email,
    first_name,
    last_name,
    phone,
    avatar_url,
    street_address,
    city,
    country
FROM old_users_table;
```
