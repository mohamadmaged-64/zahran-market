-- ========================================
-- Zahran Market - Seed Data
-- ========================================

-- Insert categories
INSERT INTO categories (name, name_en, slug, image_url, description) VALUES
  ('خضروات', 'Vegetables', 'خضروات', 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=400&q=80', 'أفضل الخضروات الطازجة'),
  ('فواكه', 'Fruits', 'فواكه', 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&q=80', 'فواكه موسمية طازجة'),
  ('لحوم', 'Meat', 'لحوم', 'https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=400&q=80', 'لحوم طازجة'),
  ('دواجن', 'Poultry', 'دواجن', 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400&q=80', 'دجاج وبيض طازج'),
  ('ألبان', 'Dairy', 'ألبان', 'https://images.unsplash.com/photo-1628088062854-b1870b58a8b5?w=400&q=80', 'منتجات الألبان'),
  ('مخبوزات', 'Bakery', 'مخبوزات', 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=400&q=80', 'خبز ومخبوزات طازجة'),
  ('مشروبات', 'Beverages', 'مشروبات', 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80', 'مشروبات باردة وساخنة'),
  ('مواد غذائية', 'Groceries', 'مواد-غذائية', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=80', 'جميع المواد الغذائية'),
  ('منظفات', 'Cleaning', 'منظفات', 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=400&q=80', 'منتجات التنظيف'),
  ('عناية شخصية', 'Personal Care', 'عناية-شخصية', 'https://images.unsplash.com/photo-1556228578-392cc034cf11?w=400&q=80', 'منتجات العناية الشخصية'),
  ('أطفال', 'Baby', 'أطفال', 'https://images.unsplash.com/photo-1584828289989-5a37c0d2cfee?w=400&q=80', 'منتجات الأطفال'),
  ('حلويات', 'Sweets', 'حلويات', 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80', 'حلويات وشوكولاتة')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
WITH cat AS (SELECT id, slug FROM categories)
INSERT INTO products (name, name_en, description, price, compare_price, image_url, category_id, unit, stock, is_featured, is_offer, is_available, rating, rating_count)
SELECT * FROM (VALUES
  ('طماطم', 'Tomato', 'طماطم طازجة مستوردة', 4.99, 6.99, 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&q=80', (SELECT id FROM cat WHERE slug = 'خضروات'), 'كجم', 100, TRUE, FALSE, TRUE, 4.5, 120),
  ('خيار', 'Cucumber', 'خيار طازج', 3.50, NULL, 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=400&q=80', (SELECT id FROM cat WHERE slug = 'خضروات'), 'كجم', 80, FALSE, FALSE, TRUE, 4.2, 85),
  ('بصل أحمر', 'Red Onion', 'بصل أحمر طازج', 3.00, 4.50, 'https://images.unsplash.com/photo-1508747703725-719777637510?w=400&q=80', (SELECT id FROM cat WHERE slug = 'خضروات'), 'كجم', 120, FALSE, FALSE, TRUE, 4.0, 60),
  ('بطاطس', 'Potato', 'بطاطس طازجة', 3.99, 5.99, 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&q=80', (SELECT id FROM cat WHERE slug = 'خضروات'), 'كجم', 150, TRUE, TRUE, TRUE, 4.3, 95),
  ('تفاح أحمر', 'Red Apple', 'تفاح أحمر فاخر', 8.99, 12.99, 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&q=80', (SELECT id FROM cat WHERE slug = 'فواكه'), 'كجم', 60, TRUE, FALSE, TRUE, 4.7, 200),
  ('برتقال', 'Orange', 'برتقال بلدي', 5.99, 7.99, 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400&q=80', (SELECT id FROM cat WHERE slug = 'فواكه'), 'كجم', 90, FALSE, TRUE, TRUE, 4.4, 150),
  ('موز', 'Banana', 'موز طازج', 6.50, 8.50, 'https://images.unsplash.com/photo-1603833665858-e61d17a8628a?w=400&q=80', (SELECT id FROM cat WHERE slug = 'فواكه'), 'كجم', 70, TRUE, FALSE, TRUE, 4.6, 180),
  ('لحم بقري مفروم', 'Ground Beef', 'لحم بقري مفروم طازج', 45.00, 55.00, 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=400&q=80', (SELECT id FROM cat WHERE slug = 'لحوم'), 'كجم', 30, TRUE, TRUE, TRUE, 4.8, 250),
  ('دجاج كامل', 'Whole Chicken', 'دجاج طازج كامل', 22.00, NULL, 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400&q=80', (SELECT id FROM cat WHERE slug = 'دواجن'), 'حبة', 40, TRUE, FALSE, TRUE, 4.3, 110),
  ('حليب طازج', 'Fresh Milk', 'حليب طازج كامل الدسم', 5.50, 7.00, 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&q=80', (SELECT id FROM cat WHERE slug = 'ألبان'), 'لتر', 200, TRUE, FALSE, TRUE, 4.5, 160),
  ('زبادي', 'Yogurt', 'زبادي طبيعي', 3.00, NULL, 'https://images.unsplash.com/photo-1571212515416-f18088cedec6?w=400&q=80', (SELECT id FROM cat WHERE slug = 'ألبان'), 'علبة', 180, FALSE, FALSE, TRUE, 4.2, 90),
  ('جبنة بيضاء', 'White Cheese', 'جبنة بيضاء طازجة', 15.00, 19.00, 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&q=80', (SELECT id FROM cat WHERE slug = 'ألبان'), 'كجم', 50, TRUE, TRUE, TRUE, 4.6, 130),
  ('خبز عربي', 'Arabic Bread', 'خبز عربي طازج', 2.00, NULL, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80', (SELECT id FROM cat WHERE slug = 'مخبوزات'), 'ربطة', 300, FALSE, FALSE, TRUE, 4.1, 75),
  ('مياه معدنية', 'Mineral Water', 'مياه معدنية طبيعية', 1.50, NULL, 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400&q=80', (SELECT id FROM cat WHERE slug = 'مشروبات'), 'لتر', 500, FALSE, FALSE, TRUE, 4.0, 50),
  ('بيبسي', 'Pepsi', 'مشروب غازي', 3.00, 4.00, 'https://images.unsplash.com/photo-1629203851122-3726ecb08080?w=400&q=80', (SELECT id FROM cat WHERE slug = 'مشروبات'), 'علبة', 400, FALSE, TRUE, TRUE, 3.8, 40),
  ('عصير برتقال', 'Orange Juice', 'عصير برتقال طبيعي', 7.00, 9.00, 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80', (SELECT id FROM cat WHERE slug = 'مشروبات'), 'لتر', 60, TRUE, FALSE, TRUE, 4.4, 100)
) AS v
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = v.column1);

-- Insert sample offers
INSERT INTO offers (title, description, discount_percentage, image_url, start_date, end_date, is_active) VALUES
  ('تخفيضات نهاية الأسبوع', 'خصم يصل إلى 30% على الخضروات والفواكه', 30, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80', NOW(), NOW() + INTERVAL '30 days', TRUE),
  ('عرض اللحوم الطازجة', 'خصم خاص على اللحوم الطازجة', 20, 'https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=400&q=80', NOW(), NOW() + INTERVAL '14 days', TRUE),
  ('تخفيضات الألبان', 'اشتر 2 واحصل على الثالث مجاناً', 33, 'https://images.unsplash.com/photo-1628088062854-b1870b58a8b5?w=400&q=80', NOW(), NOW() + INTERVAL '7 days', TRUE);
