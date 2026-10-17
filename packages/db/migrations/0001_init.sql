-- ============================================================================
-- WOA Platform — PostgreSQL Schema (Supabase-compatible, UUID v7 via gen_random_uuid)
-- Serves: Landing (web) + Store + Admin from ONE database
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------- 1. CATEGORIES (product categories: worlds) ----------
CREATE TABLE categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT UNIQUE NOT NULL,               -- e.g. 'kitchen-hinges', 'dressing-rails'
  name_ar     TEXT NOT NULL,
  name_en     TEXT,
  parent_id   UUID REFERENCES categories(id) ON DELETE SET NULL,  -- hierarchy: world -> sub
  image_url   TEXT,
  sort_order  INT DEFAULT 0,
  is_active   BOOLEAN DEFAULT TRUE,
  seo_title_ar   TEXT, seo_title_en TEXT,
  seo_desc_ar    TEXT, seo_desc_en  TEXT,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_categories_parent ON categories(parent_id) WHERE parent_id IS NOT NULL;

-- ---------- 2. PRODUCTS ----------
CREATE TABLE products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT UNIQUE NOT NULL,               -- SEO clean URL: /product/soft-close-hinge-3d
  code        TEXT UNIQUE NOT NULL,               -- showroom code: WOA-1042
  name_ar     TEXT NOT NULL,
  name_en     TEXT,
  desc_ar     TEXT,
  desc_en     TEXT,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  price_egp   NUMERIC(10,2) NOT NULL CHECK (price_egp >= 0),
  sale_price  NUMERIC(10,2) CHECK (sale_price IS NULL OR sale_price < price_egp),
  currency    TEXT DEFAULT 'EGP',
  stock       INT DEFAULT 0,
  low_stock_at INT DEFAULT 5,                     -- alert threshold
  brand       TEXT,
  material    TEXT,                               -- stainless / aluminium / zinc
  weight_kg   NUMERIC(6,2),
  load_kg     NUMERIC(6,1),                       -- e.g. 45kg rail
  dimensions  JSONB,                              -- {w:80, h:120, d:40, unit:'mm'}
  colors      JSONB,                              -- ['matte-gold','matte-black']
  images      JSONB NOT NULL DEFAULT '[]',        -- [{url, alt_ar, alt_en, sort}]
  is_featured BOOLEAN DEFAULT FALSE,
  is_active   BOOLEAN DEFAULT TRUE,
  sold_count  INT DEFAULT 0,                      -- for "best sellers"
  rating_avg  NUMERIC(2,1) DEFAULT 0,
  rating_count INT DEFAULT 0,
  seo_title_ar   TEXT, seo_title_en TEXT,
  seo_desc_ar    TEXT, seo_desc_en  TEXT,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_products_category ON products(category_id) WHERE is_active;
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured AND is_active;
CREATE INDEX idx_products_code      ON products(code);
CREATE INDEX idx_products_name_ar   ON products USING gin (to_tsvector('simple', name_ar || ' ' || COALESCE(desc_ar,'')));

-- ---------- 3. CUSTOMERS ----------
CREATE TABLE customers (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone       TEXT UNIQUE NOT NULL,               -- Egyptian mobile 01xxxxxxxxx (login via OTP)
  name        TEXT,
  email       TEXT,
  governorate TEXT,                               -- e.g. 'الجيزة'
  city        TEXT,
  address     TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_customers_phone ON customers(phone);

-- ---------- 4. ORDERS ----------
CREATE TABLE orders (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_no    TEXT UNIQUE NOT NULL,               -- e.g. WOA-2026-000431
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  customer_name  TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  governorate TEXT NOT NULL,
  city        TEXT,
  address     TEXT NOT NULL,
  subtotal_egp  NUMERIC(10,2) NOT NULL,
  shipping_egp  NUMERIC(10,2) DEFAULT 0,
  discount_egp  NUMERIC(10,2) DEFAULT 0,
  total_egp     NUMERIC(10,2) NOT NULL,
  payment     TEXT DEFAULT 'cash_on_delivery' CHECK (payment IN ('cash_on_delivery','bank_transfer','vodafone_cash','instapay')),
  status      TEXT DEFAULT 'new' CHECK (status IN ('new','confirmed','packed','shipped','delivered','cancelled')),
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_orders_status   ON orders(status);
CREATE INDEX idx_orders_created  ON orders(created_at DESC);

CREATE TABLE order_items (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id   UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  code       TEXT NOT NULL,          -- snapshot (product may change later)
  name_ar    TEXT NOT NULL,          -- snapshot
  qty        INT NOT NULL CHECK (qty > 0),
  unit_price NUMERIC(10,2) NOT NULL
);
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- ---------- 5. COUPONS ----------
CREATE TABLE coupons (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code      TEXT UNIQUE NOT NULL,               -- 'RAMADAN15'
  type      TEXT DEFAULT 'percent' CHECK (type IN ('percent','fixed')),
  value     NUMERIC(10,2) NOT NULL,             -- 15 (%) or 100 (EGP)
  min_order NUMERIC(10,2) DEFAULT 0,
  max_uses  INT,                                -- NULL = unlimited
  used_count INT DEFAULT 0,
  starts_at TIMESTAMPTZ, ends_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE
);

-- ---------- 6. BLOG (CMS for landing) ----------
CREATE TABLE authors (
  id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar TEXT NOT NULL, name_en TEXT,
  avatar_url TEXT,
  bio_ar TEXT
);

CREATE TABLE posts (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug      TEXT UNIQUE NOT NULL,               -- 'best-hydraulic-hinges-egypt'
  title_ar  TEXT NOT NULL, title_en TEXT,
  excerpt_ar TEXT, excerpt_en TEXT,             -- ~155 chars for SEO
  content_ar TEXT NOT NULL,                      -- MDX/HTML from editor
  content_en TEXT,
  cover_url TEXT,
  category_slug TEXT REFERENCES categories(slug) ON DELETE SET NULL, -- link to world
  author_id UUID REFERENCES authors(id) ON DELETE SET NULL,
  tags      JSONB DEFAULT '[]',
  related_product_ids JSONB DEFAULT '[]',       -- cross-sell: links in article
  status    TEXT DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  views     INT DEFAULT 0,
  seo_title_ar TEXT, seo_title_en TEXT,
  seo_desc_ar  TEXT, seo_desc_en  TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_posts_status_pub ON posts(status, published_at DESC);
CREATE INDEX idx_posts_slug_cat   ON posts(category_slug);

CREATE TABLE post_sections (                    -- reusable FAQ / spec blocks
  id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id  UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  type     TEXT DEFAULT 'faq' CHECK (type IN ('faq','specs','tips')),
  content  JSONB NOT NULL,                      -- [{q,a}] or [{label,value}]
  sort     INT DEFAULT 0
);

-- ---------- 7. BANNERS (ads strip + hero offers) ----------
CREATE TABLE banners (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text_ar   TEXT NOT NULL, text_en TEXT,
  tag_ar    TEXT, tag_en TEXT,                  -- 'عرض خاص' / 'خصم 20%'
  link_url  TEXT,                                -- whatsapp / /product/x / #contact
  placement TEXT DEFAULT 'store_top' CHECK (placement IN ('store_top','store_hero','web_hero','web_popup')),
  image_url TEXT,
  sort_order INT DEFAULT 0,
  starts_at TIMESTAMPTZ, ends_at TIMESTAMPTZ,    -- scheduling
  is_active BOOLEAN DEFAULT FALSE,
  clicks    INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_banners_active ON banners(placement, is_active, sort_order);

-- ---------- 8. B2B QUOTES (landing form -> admin) ----------
CREATE TABLE b2b_quotes (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company    TEXT NOT NULL,
  contact    TEXT NOT NULL,
  phone      TEXT NOT NULL,
  email      TEXT,
  governorate TEXT,
  details    TEXT,                               -- what they need
  qty_estimate TEXT,                             -- '500-1000 قطعة'
  status     TEXT DEFAULT 'new' CHECK (status IN ('new','contacted','quoted','won','lost')),
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_b2b_status ON b2b_quotes(status);

-- ---------- 9. SHIPPING (Egypt governorates) ----------
CREATE TABLE shipping_zones (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  governorate TEXT UNIQUE NOT NULL,
  fee_egp   NUMERIC(8,2) NOT NULL,
  days      INT DEFAULT 2,
  cod_extra NUMERIC(8,2) DEFAULT 0               -- cash-on-delivery extra fee
);

-- ---------- 10. ADMIN USERS & AUDIT ----------
CREATE TABLE admin_users (
  id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email    TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role     TEXT DEFAULT 'editor' CHECK (role IN ('super','editor','viewer')),
  last_login TIMESTAMPTZ
);

CREATE TABLE audit_log (
  id        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  admin_id  UUID REFERENCES admin_users(id),
  action    TEXT NOT NULL,                        -- 'product.update', 'order.status'
  entity    TEXT, entity_id TEXT,
  diff      JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ---------- updated_at trigger ----------
CREATE OR REPLACE FUNCTION touch_updated_at() RETURNS trigger AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql;

DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['categories','products','orders','posts','banners']
  LOOP
    EXECUTE format('CREATE TRIGGER trg_touch_%I BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION touch_updated_at()', t, t);
  END LOOP;
END $$;

-- ---------- order number generator ----------
CREATE SEQUENCE order_seq START 1;
CREATE OR REPLACE FUNCTION next_order_no() RETURNS TEXT AS $$
BEGIN
  RETURN 'WOA-' || to_char(now(),'YYYY') || '-' || lpad(nextval('order_seq')::text, 5, '0');
END; $$ LANGUAGE plpgsql;

-- ---------- decrement stock on order confirm ----------
CREATE OR REPLACE FUNCTION confirm_order_stock() RETURNS trigger AS $$
BEGIN
  IF NEW.status = 'confirmed' AND OLD.status = 'new' THEN
    UPDATE products p SET stock = stock - oi.qty, sold_count = sold_count + oi.qty
    FROM order_items oi WHERE oi.order_id = NEW.id AND oi.product_id = p.id;
  END IF;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;
CREATE TRIGGER trg_order_confirm AFTER UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION confirm_order_stock();

-- ============================================================================
-- ROW LEVEL SECURITY (Supabase): admin full access, public read-only on catalog
-- ============================================================================
ALTER TABLE products    ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories  ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts       ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners     ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers   ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders      ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read catalog" ON products   FOR SELECT USING (is_active = TRUE);
CREATE POLICY "public read catalog" ON categories FOR SELECT USING (is_active = TRUE);
CREATE POLICY "public read published" ON posts    FOR SELECT USING (status = 'published');
CREATE POLICY "public read active banners" ON banners FOR SELECT USING (is_active = TRUE);

-- orders: customer can read own by phone (via API, not direct), no direct anon write
CREATE POLICY "admin all orders" ON orders FOR ALL TO authenticated USING (TRUE);
