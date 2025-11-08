# دليل نشر التطبيق على Vercel

## 📋 المتطلبات

- حساب على [Vercel](https://vercel.com)
- حساب على [GitHub](https://github.com) (لرفع المشروع)
- قاعدة بيانات Neon (يمكن إنشاؤها من Vercel مباشرة)

## 🚀 خطوات النشر

### 1. رفع المشروع إلى GitHub

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. ربط المشروع بـ Vercel

1. سجل دخول إلى [Vercel Dashboard](https://vercel.com/dashboard)
2. اضغط "Add New" → "Project"
3. اختر مستودع GitHub الخاص بك
4. Vercel سيكتشف إعدادات المشروع تلقائياً

### 3. إعداد قاعدة بيانات Neon

**الطريقة الأولى: من Vercel (موصى بها)**

1. في صفحة إعدادات المشروع، اذهب إلى "Storage"
2. اضغط "Create Database" → "Neon PostgreSQL"
3. اتبع التعليمات لإنشاء قاعدة بيانات
4. سيتم إضافة `DATABASE_URL` تلقائياً إلى Environment Variables

**الطريقة الثانية: من Neon مباشرة**

1. سجل دخول إلى [Neon Console](https://console.neon.tech)
2. أنشئ مشروعاً جديداً
3. انسخ Connection String من لوحة التحكم
4. أضفه كـ Environment Variable في Vercel (انظر الخطوة 4)

### 4. إعداد Environment Variables

في Vercel Dashboard → Settings → Environment Variables، أضف:

```
DATABASE_URL=postgresql://...
```

### 5. إعداد قاعدة البيانات

بعد النشر الأول، قم بتشغيل:

```bash
npm run db:push
```

هذا الأمر سيُنشئ جميع الجداول في قاعدة بيانات Neon.

### 6. إعادة النشر

اضغط "Redeploy" في Vercel Dashboard لتطبيق التغييرات.

## 📝 ملاحظات مهمة

### Build Settings في Vercel

Vercel سيكتشف هذه الإعدادات تلقائياً، لكن للتأكد:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist/public`
- **Install Command**: `npm install`

### Database Migration

عند تحديث schema في `shared/schema.ts`:

```bash
# في بيئة التطوير المحلية
npm run db:push

# أو في Vercel (عبر Console)
vercel env pull
npm run db:push
```

### إضافة بيانات تجريبية

يمكنك إضافة مصانع تجريبية من خلال:

1. صفحة Admin: `/admin`
2. أو استخدام API مباشرة:

```bash
curl -X POST https://your-app.vercel.app/api/factories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Factory Name",
    "nameAr": "اسم المصنع",
    "description": "Description",
    "descriptionAr": "الوصف",
    "wilaya": "Alger",
    "category": "food",
    "products": ["Product 1"],
    "productsAr": ["منتج 1"],
    "phone": "+213...",
    "email": "factory@example.com",
    "address": "Address",
    "addressAr": "العنوان"
  }'
```

## 🔧 استكشاف الأخطاء

### خطأ: "Cannot connect to database"

- تأكد من إضافة `DATABASE_URL` في Environment Variables
- تحقق من صحة Connection String
- تأكد من تشغيل `npm run db:push`

### خطأ: Build Failed

- تحقق من Build Logs في Vercel
- تأكد من عدم وجود أخطاء TypeScript: `npm run build` محلياً
- تأكد من تثبيت جميع Dependencies

### خطأ: 404 Not Found

- تأكد من إعداد routing بشكل صحيح
- تحقق من Output Directory = `dist/public`

## 📦 النشر التلقائي

بعد الإعداد الأولي، Vercel سيقوم بنشر تلقائي عند:

- Push إلى branch `main`
- فتح Pull Request (سيُنشئ Preview Deployment)

## 🌐 Custom Domain

لإضافة نطاق خاص:

1. اذهب إلى Settings → Domains
2. أضف النطاق الخاص بك
3. اتبع تعليمات إعداد DNS

---

**جاهز للنشر! 🚀**

لأي مشاكل، راجع [Vercel Documentation](https://vercel.com/docs)
