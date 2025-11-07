-- =======================================================
-- SQL لإنشاء قاعدة بيانات Supabase للمصانع الجزائرية
-- =======================================================
-- 
-- استخدام هذا الملف:
-- 1. افتح لوحة تحكم Supabase (https://supabase.com)
-- 2. اختر مشروعك
-- 3. اذهب إلى SQL Editor
-- 4. انسخ والصق هذا الكود وقم بتنفيذه
--
-- =======================================================

-- إنشاء جدول المصانع (Factories)
CREATE TABLE IF NOT EXISTS factories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  description TEXT NOT NULL,
  description_ar TEXT NOT NULL,
  wilaya TEXT NOT NULL,
  category TEXT NOT NULL,
  products TEXT[] NOT NULL,
  products_ar TEXT[] NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT NOT NULL,
  address_ar TEXT NOT NULL,
  logo_url TEXT,
  image_url TEXT,
  latitude TEXT,
  longitude TEXT
);

-- إنشاء فهرس للبحث السريع
CREATE INDEX IF NOT EXISTS idx_factories_wilaya ON factories(wilaya);
CREATE INDEX IF NOT EXISTS idx_factories_category ON factories(category);
CREATE INDEX IF NOT EXISTS idx_factories_name_ar ON factories(name_ar);

-- =======================================================
-- إضافة بيانات تجريبية (اختياري)
-- =======================================================

INSERT INTO factories (
  name, name_ar, description, description_ar, 
  wilaya, category, products, products_ar,
  phone, email, address, address_ar,
  logo_url, image_url
) VALUES 
(
  'Tizi Olive Oil Factory',
  'مصنع زيت الزيتون تيزي',
  'Premium olive oil production facility specializing in extra virgin and organic oils',
  'مصنع متخصص في إنتاج زيت الزيتون الفاخر بجودة عالية',
  'تيزي وزو',
  'food',
  ARRAY['Extra Virgin Olive Oil', 'Organic Olive Oil', 'Flavored Olive Oil'],
  ARRAY['زيت زيتون بكر ممتاز', 'زيت زيتون عضوي', 'زيت زيتون منكه'],
  '+213 26 12 34 56',
  'contact@tiziolive.dz',
  '123 Industrial Zone, Tizi Ouzou',
  'المنطقة الصناعية 123، تيزي وزو',
  null,
  null
),
(
  'Setif Textile Factory',
  'مصنع النسيج سطيف',
  'Modern textile manufacturing facility producing high-quality fabrics',
  'مصنع حديث لإنتاج المنسوجات عالية الجودة',
  'سطيف',
  'textile',
  ARRAY['Cotton Fabrics', 'Wool Textiles', 'Synthetic Materials', 'Industrial Fabrics'],
  ARRAY['أقمشة قطنية', 'منسوجات صوفية', 'مواد تركيبية', 'أقمشة صناعية'],
  '+213 36 78 90 12',
  'info@setiftextile.dz',
  '456 Industrial Park, Setif',
  'المنطقة الصناعية 456، سطيف',
  null,
  null
),
(
  'Constantine Pharmaceutical',
  'مصنع الأدوية قسنطينة',
  'Advanced pharmaceutical manufacturing facility producing quality medicines',
  'مصنع متقدم لإنتاج الأدوية عالية الجودة',
  'قسنطينة',
  'pharmaceutical',
  ARRAY['Generic Medicines', 'Antibiotics', 'Pain Relief', 'Vitamins'],
  ARRAY['أدوية جنيسة', 'مضادات حيوية', 'مسكنات', 'فيتامينات'],
  '+213 31 45 67 89',
  'contact@constpharma.dz',
  '789 Medical District, Constantine',
  'الحي الطبي 789، قسنطينة',
  null,
  null
),
(
  'Algiers Electronics',
  'مصنع الإلكترونيات الجزائر',
  'Electronics manufacturing and assembly plant',
  'مصنع لتصنيع وتجميع الأجهزة الإلكترونية',
  'الجزائر',
  'electronics',
  ARRAY['Consumer Electronics', 'LED Screens', 'Electronic Components'],
  ARRAY['إلكترونيات استهلاكية', 'شاشات LED', 'مكونات إلكترونية'],
  '+213 21 11 22 33',
  'info@algierselectronics.dz',
  'Industrial Zone 2, Algiers',
  'المنطقة الصناعية 2، الجزائر',
  null,
  null
),
(
  'Oran Steel Works',
  'مصنع الصلب وهران',
  'Steel production and metal fabrication facility',
  'مصنع لإنتاج الصلب والتشكيل المعدني',
  'وهران',
  'metallurgy',
  ARRAY['Steel Beams', 'Metal Sheets', 'Reinforcement Bars'],
  ARRAY['عوارض فولاذية', 'صفائح معدنية', 'قضبان التسليح'],
  '+213 41 55 66 77',
  'contact@oransteel.dz',
  'Heavy Industrial Zone, Oran',
  'المنطقة الصناعية الثقيلة، وهران',
  null,
  null
);

-- =======================================================
-- التحقق من البيانات المدخلة
-- =======================================================

SELECT COUNT(*) as total_factories FROM factories;
SELECT DISTINCT wilaya FROM factories ORDER BY wilaya;
SELECT DISTINCT category FROM factories ORDER BY category;
