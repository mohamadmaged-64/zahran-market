# زهران ماركت - Zahran Market

منصة تجارة إلكترونية متكاملة للسوبر ماركت، تم تطويرها باستخدام Next.js و Supabase.

## المميزات

- **واجهة مستخدم عربية** - تصميم RTL كامل
- **الوضع الليلي والنهاري** - دعم كامل للوضع المظلم
- **متجاوب بالكامل** - Mobile, Tablet, Desktop
- **سلة تسوق** - إدارة كاملة للسلة
- **الطلب بدون حساب** - تجربة شراء سريعة
- **لوحة تحكم كاملة** - إدارة المنتجات والطلبات والتصنيفات
- **تحديد موقع التوصيل** - باستخدام الخريطة
- **طرق دفع متعددة** - كاش، بطاقة ائتمان، استلام من المتجر
- **العروض والتخفيضات** - نظام عروض متكامل
- **البحث المتقدم** - بحث فوري عن المنتجات

## التقنيات المستخدمة

- **Frontend:** Next.js 15, React 19, Tailwind CSS 3
- **Backend:** Supabase (PostgreSQL, Storage, APIs)
- **Language:** TypeScript
- **Maps:** Leaflet + OpenStreetMap
- **Charts:** Recharts
- **Icons:** Lucide React

## متطلبات التشغيل

- Node.js 18+
- npm 9+
- حساب Supabase (مجاني)

## الإعداد والتشغيل

### 1. إنشاء مشروع Supabase

1. سجل في [supabase.com](https://supabase.com)
2. أنشئ مشروع جديد
3. اذهب إلى SQL Editor
4. نفذ الملفات بالترتيب:
   - `supabase/schema.sql`
   - `supabase/seed.sql` (اختياري - بيانات تجريبية)
   - `supabase/policies.sql`

### 2. إعداد Supabase Storage

1. اذهب إلى Storage في Supabase Dashboard
2. أنشئ bucket جديد باسم `products`
3. اجعله Public
4. الصق سياسات التخزين من ملف `schema.sql`

### 3. إعداد المتغيرات البيئية

انسخ ملف `.env.local.example` إلى `.env.local` واملأ القيم:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. تشغيل المشروع

```bash
# تثبيت الاعتماديات
npm install

# تشغيل في وضع التطوير
npm run dev

# بناء للإنتاج
npm run build

# تشغيل نسخة الإنتاج
npm start
```

### 5. فتح المتصفح

افتح [http://localhost:3000](http://localhost:3000)

## هيكل المشروع

```
zahran-market/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # الصفحة الرئيسية
│   │   ├── admin/             # لوحة التحكم
│   │   ├── products/          # صفحة المنتجات
│   │   ├── categories/        # التصنيفات
│   │   ├── cart/              # سلة التسوق
│   │   ├── checkout/          # إتمام الطلب
│   │   ├── contact/           # اتصل بنا
│   │   ├── offers/            # العروض
│   │   ├── search/            # البحث
│   │   └── api/               # API Routes
│   ├── components/
│   │   ├── layout/            # مكونات الهيكل
│   │   ├── home/              # مكونات الصفحة الرئيسية
│   │   └── ui/                # مكونات مشتركة
│   ├── context/               # سياقات (Cart, Theme, Store)
│   ├── lib/                   # مكتبات (supabase, utils, types)
│   └── styles/                # ملفات CSS
├── supabase/                  # ملفات قاعدة البيانات
│   ├── schema.sql
│   ├── seed.sql
│   └── policies.sql
├── public/                    # الملفات الثابتة
└── README.md
```

## النشر على Vercel

1. ارفع المشروع إلى GitHub
2. اذهب إلى [vercel.com](https://vercel.com)
3. أنشئ مشروع جديد واربطه بالمستودع
4. أضف المتغيرات البيئية
5. انشر! 🚀

## API Endpoints

| المسار | الطريقة | الوصف |
|--------|---------|-------|
| `/api/products` | GET | جلب المنتجات |
| `/api/products` | POST | إضافة منتج |
| `/api/products` | PUT | تحديث منتج |
| `/api/products?id=` | DELETE | حذف منتج |
| `/api/categories` | GET | جلب التصنيفات |
| `/api/categories` | POST | إضافة تصنيف |
| `/api/orders` | GET | جلب الطلبات |
| `/api/orders` | POST | إنشاء طلب |
| `/api/orders` | PUT | تحديث طلب |
| `/api/orders?id=` | DELETE | حذف طلب |
| `/api/offers` | GET | جلب العروض |
| `/api/offers` | POST | إضافة عرض |
| `/api/contact` | POST | إرسال رسالة |
| `/api/upload` | POST | رفع صورة |

## الترخيص

جميع الحقوق محفوظة لزهران ماركت © 2024
