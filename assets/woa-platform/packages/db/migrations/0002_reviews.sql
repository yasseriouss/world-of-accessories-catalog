-- ============================================================================
-- WOA Platform — Migration 0002: Product Reviews & Automatic Rating Triggers
-- Serves: Store product reviews, Schema.org AggregateRating, and Admin moderation
-- ============================================================================

CREATE TABLE IF NOT EXISTS reviews (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id    UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  author_name   TEXT NOT NULL,
  author_phone  TEXT,
  rating        INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment       TEXT,
  is_approved   BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id) WHERE is_approved = TRUE;
CREATE INDEX IF NOT EXISTS idx_reviews_created ON reviews(created_at DESC);

-- ---------- Auto-recalculate rating_avg and rating_count ----------
CREATE OR REPLACE FUNCTION update_product_rating() RETURNS trigger AS $$
DECLARE
  target_product_id UUID;
BEGIN
  target_product_id := COALESCE(NEW.product_id, OLD.product_id);
  
  UPDATE products
  SET 
    rating_avg = COALESCE((
      SELECT ROUND(AVG(rating)::numeric, 1)
      FROM reviews
      WHERE product_id = target_product_id AND is_approved = TRUE
    ), 0),
    rating_count = (
      SELECT COUNT(*)::int
      FROM reviews
      WHERE product_id = target_product_id AND is_approved = TRUE
    )
  WHERE id = target_product_id;

  RETURN NULL;
END; $$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_review_rating_change') THEN
    CREATE TRIGGER trg_review_rating_change
    AFTER INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_product_rating();
  END IF;
END $$;

-- ---------- RLS ----------
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reviews' AND policyname = 'public read approved reviews') THEN
    CREATE POLICY "public read approved reviews" ON reviews FOR SELECT USING (is_approved = TRUE);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reviews' AND policyname = 'public insert reviews') THEN
    CREATE POLICY "public insert reviews" ON reviews FOR INSERT WITH CHECK (rating >= 1 AND rating <= 5 AND author_name IS NOT NULL);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reviews' AND policyname = 'admin all reviews') THEN
    CREATE POLICY "admin all reviews" ON reviews FOR ALL TO authenticated USING (TRUE);
  END IF;
END $$;
