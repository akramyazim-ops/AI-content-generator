-- 1. Create the generations table
CREATE TABLE IF NOT EXISTS public.generations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    business_type TEXT NOT NULL,
    content_type TEXT NOT NULL,
    generated_content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS) on the table
ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;

-- 3. Create security policies for total isolation
-- Users can only SELECT their own rows
CREATE POLICY "Users can view their own generations"
ON public.generations
FOR SELECT
USING (auth.uid() = user_id);

-- Users can only INSERT rows where the user_id matches their own token
CREATE POLICY "Users can insert their own generations"
ON public.generations
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can only UPDATE their own rows (optional)
CREATE POLICY "Users can update their own generations"
ON public.generations
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can only DELETE their own rows (optional)
CREATE POLICY "Users can delete their own generations"
ON public.generations
FOR DELETE
USING (auth.uid() = user_id);
