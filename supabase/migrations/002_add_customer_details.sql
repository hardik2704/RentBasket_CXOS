-- Add customer details columns to reviews table
ALTER TABLE public.reviews 
ADD COLUMN IF NOT EXISTS customer_name TEXT NULL,
ADD COLUMN IF NOT EXISTS customer_phone TEXT NULL;

-- Update the view to include these columns
DROP VIEW IF EXISTS public.v_recent_reviews;
CREATE OR REPLACE VIEW public.v_recent_reviews AS
SELECT
  id, 
  customer_id, 
  is_non_customer, 
  rating, 
  nps, 
  review_text, 
  sentiment, 
  created_at,
  customer_name,
  customer_phone
FROM public.reviews
ORDER BY created_at DESC;
