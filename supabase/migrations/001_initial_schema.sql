-- ============================================
-- RentBasket CXOS - Supabase Migration (MVP)
-- ============================================

-- 1) Enum types
DO $$ BEGIN
  CREATE TYPE public.sentiment_tag AS ENUM ('promoter', 'passive', 'detractor', 'unknown');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'escalated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.assignee AS ENUM ('care', 'hardik');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2) Reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id TEXT NULL,
  is_non_customer BOOLEAN NOT NULL DEFAULT FALSE,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  nps INT NULL CHECK (nps BETWEEN 0 AND 10),
  review_text TEXT NOT NULL,
  sentiment public.sentiment_tag NOT NULL DEFAULT 'unknown',
  non_customer_meta JSONB NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.reviews (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_customer_id ON public.reviews (customer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_sentiment ON public.reviews (sentiment);

-- 3) Review eligibility cache (optional but recommended for speed)
CREATE TABLE IF NOT EXISTS public.review_eligibility_cache (
  customer_id TEXT PRIMARY KEY,
  last_review_date TIMESTAMPTZ NULL,
  next_allowed_date TIMESTAMPTZ NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4) Support tickets table (CXOS-local, used for war-room + SLA + escalation)
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  customer_id TEXT NULL,
  status public.ticket_status NOT NULL DEFAULT 'open',
  assigned_to public.assignee NOT NULL DEFAULT 'care',
  sla_deadline TIMESTAMPTZ NOT NULL,
  resolution_notes TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tickets_status ON public.support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_sla_deadline ON public.support_tickets(sla_deadline);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON public.support_tickets(created_at DESC);

-- 5) Config table (for n% discount and other knobs)
CREATE TABLE IF NOT EXISTS public.cxos_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Default discount percent = 5 (change anytime)
INSERT INTO public.cxos_config (key, value)
VALUES ('coupon_discount_percent', jsonb_build_object('n', 5))
ON CONFLICT (key) DO NOTHING;

-- Review frequency = 6 months
INSERT INTO public.cxos_config (key, value)
VALUES ('review_frequency_months', jsonb_build_object('months', 6))
ON CONFLICT (key) DO NOTHING;

-- SLA hours = 24
INSERT INTO public.cxos_config (key, value)
VALUES ('sla_hours', jsonb_build_object('hours', 24))
ON CONFLICT (key) DO NOTHING;

-- 6) Updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_support_tickets_updated_at ON public.support_tickets;
CREATE TRIGGER trg_support_tickets_updated_at
BEFORE UPDATE ON public.support_tickets
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_config_updated_at ON public.cxos_config;
CREATE TRIGGER trg_config_updated_at
BEFORE UPDATE ON public.cxos_config
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 7) Helpful views for Admin War-room

-- Recent reviews
CREATE OR REPLACE VIEW public.v_recent_reviews AS
SELECT
  id, customer_id, is_non_customer, rating, nps, review_text, sentiment, created_at
FROM public.reviews
ORDER BY created_at DESC;

-- SLA risk: tickets with <= 4 hours remaining and not resolved
CREATE OR REPLACE VIEW public.v_sla_risk_tickets AS
SELECT
  t.*,
  EXTRACT(EPOCH FROM (t.sla_deadline - NOW()))/3600 AS hours_left
FROM public.support_tickets t
WHERE t.status IN ('open', 'in_progress', 'escalated')
  AND t.sla_deadline <= NOW() + INTERVAL '4 hours'
ORDER BY t.sla_deadline ASC;

-- Metrics view: last 7 days
CREATE OR REPLACE VIEW public.v_metrics_7d AS
SELECT
  COUNT(*)::INT AS total_reviews,
  AVG(rating)::FLOAT AS avg_rating,
  (100.0 * SUM(CASE WHEN sentiment='promoter' THEN 1 ELSE 0 END) / NULLIF(COUNT(*),0))::FLOAT AS promoters_pct,
  (100.0 * SUM(CASE WHEN sentiment='detractor' THEN 1 ELSE 0 END) / NULLIF(COUNT(*),0))::FLOAT AS detractors_pct
FROM public.reviews
WHERE created_at >= NOW() - INTERVAL '7 days';

-- 8) Row Level Security (basic, enable as needed)
-- ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
