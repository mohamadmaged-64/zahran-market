-- ========================================
-- Zahran Market - Row Level Security Policies
-- ========================================

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Categories: public read, anon write (for admin)
CREATE POLICY "Allow public read categories"
  ON categories FOR SELECT USING (TRUE);

CREATE POLICY "Allow all insert categories"
  ON categories FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Allow all update categories"
  ON categories FOR UPDATE USING (TRUE);

CREATE POLICY "Allow all delete categories"
  ON categories FOR DELETE USING (TRUE);

-- Products: public read, anon write (for admin)
CREATE POLICY "Allow public read products"
  ON products FOR SELECT USING (TRUE);

CREATE POLICY "Allow all insert products"
  ON products FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Allow all update products"
  ON products FOR UPDATE USING (TRUE);

CREATE POLICY "Allow all delete products"
  ON products FOR DELETE USING (TRUE);

-- Orders: anon read/write (for checkout flow)
CREATE POLICY "Allow all read orders"
  ON orders FOR SELECT USING (TRUE);

CREATE POLICY "Allow all insert orders"
  ON orders FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Allow all update orders"
  ON orders FOR UPDATE USING (TRUE);

CREATE POLICY "Allow all delete orders"
  ON orders FOR DELETE USING (TRUE);

-- Offers: public read, anon write
CREATE POLICY "Allow public read offers"
  ON offers FOR SELECT USING (TRUE);

CREATE POLICY "Allow all insert offers"
  ON offers FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Allow all update offers"
  ON offers FOR UPDATE USING (TRUE);

CREATE POLICY "Allow all delete offers"
  ON offers FOR DELETE USING (TRUE);

-- Contact messages: anon write
CREATE POLICY "Allow all insert contact"
  ON contact_messages FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Allow all read contact"
  ON contact_messages FOR SELECT USING (TRUE);

CREATE POLICY "Allow all update contact"
  ON contact_messages FOR UPDATE USING (TRUE);
