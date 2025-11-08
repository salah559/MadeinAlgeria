# دليل النشر على Vercel

## المتطلبات الأساسية

1. **حساب على Vercel**: قم بإنشاء حساب على [vercel.com](https://vercel.com)
2. **قاعدة بيانات Neon**: تأكد من أن لديك قاعدة بيانات Neon PostgreSQL

## خطوات النشر

### 1. ربط المشروع مع GitHub

1. قم برفع المشروع إلى GitHub repository
2. سجل دخولك على Vercel
3. انقر على **"Add New Project"**
4. اختر repository من GitHub

### 2. إعدادات المشروع في Vercel

في صفحة إعدادات المشروع، قم بالتالي:

#### Framework Preset
- اختر: **Vite**

#### Build & Development Settings
- **Build Command**: `npm run build` (يتم تعيينه تلقائياً)
- **Output Directory**: `dist` (يتم تعيينه تلقائياً)
- **Install Command**: `npm install` (يتم تعيينه تلقائياً)

#### Root Directory
- اتركها كما هي: `./` (الجذر)

### 3. Google OAuth Setup

قبل النشر، يجب إعداد Google OAuth:

1. اذهب إلى [Google Cloud Console](https://console.cloud.google.com/)
2. انتقل إلى **APIs & Services** > **Credentials**
3. أنشئ **OAuth 2.0 Client ID**:
   - نوع التطبيق: **Web application**
   - Authorized JavaScript origins:
     ```
     https://your-project-name.vercel.app
     ```
   - Authorized redirect URIs:
     ```
     https://your-project-name.vercel.app/api/auth/google/callback
     ```
4. احفظ `Client ID` و `Client Secret`

### 4. إضافة Neon Database في Vercel

بدلاً من إضافة `DATABASE_URL` يدويًا، استخدم تكامل Vercel مع Neon:

1. في صفحة إعدادات المشروع في Vercel، اذهب إلى تبويب **Storage**
2. اضغط على **Connect Store**
3. اختر **Neon Postgres**
4. اتبع التعليمات لإنشاء أو ربط قاعدة بيانات Neon
5. Vercel سيضيف `DATABASE_URL` تلقائيًا في Environment Variables ✅

**فائدة هذه الطريقة:**
- ✅ لا حاجة لنسخ `DATABASE_URL` يدويًا
- ✅ Vercel يدير الاتصال تلقائيًا
- ✅ متغيرات البيئة تُضاف تلقائيًا لجميع البيئات (Production, Preview, Development)

### 5. إضافة باقي متغيرات البيئة

الآن أضف المتغيرات المتبقية يدويًا في **Environment Variables**:

```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=random_secure_string_minimum_32_characters
NODE_ENV=production
```

**ملاحظات مهمة**: 
- `SESSION_SECRET` يجب أن يكون نصًا عشوائيًا طويلاً وآمنًا (32 حرف على الأقل)
- `GOOGLE_CLIENT_ID` و `GOOGLE_CLIENT_SECRET` من Google Cloud Console

### 6. إنشاء الجداول في قاعدة البيانات

بعد ربط Neon Database وإضافة Environment Variables، يمكنك إنشاء الجداول بطريقتين:

#### الطريقة 1: من خلال Neon Dashboard (الأسهل)
1. اذهب إلى [Neon Console](https://console.neon.tech/)
2. افتح قاعدة البيانات المرتبطة بـ Vercel
3. اذهب إلى **SQL Editor**
4. قم بتشغيل الكود التالي:

```sql
CREATE TABLE users (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  google_id TEXT UNIQUE,
  picture TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE factories (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
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

CREATE TABLE session (
  sid VARCHAR PRIMARY KEY,
  sess TEXT NOT NULL,
  expire TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_session_expire ON session(expire);
```

#### الطريقة 2: باستخدام Drizzle محليًا
```bash
# احصل على DATABASE_URL من Vercel Environment Variables
# أضفه في ملف .env محلي
echo "DATABASE_URL=your_neon_connection_string" > .env

# قم بإنشاء الجداول
npm run db:push
```

### 7. انقر على Deploy

بعد إضافة جميع الإعدادات، انقر على **"Deploy"**

Vercel سيقوم بـ:
1. تثبيت الحزم (`npm install`)
2. بناء Frontend (`npm run build`)
3. نشر الـ API كـ Serverless Functions
4. نشر Frontend كـ Static Files

### 7. بعد النشر

بعد اكتمال النشر:
- ستحصل على رابط مثل: `https://your-project.vercel.app`
- تأكد من عمل الموقع بشكل صحيح
- جرّب صفحة المصانع `/factories` والبحث

## البنية المعمارية على Vercel

### Frontend (Static Files)
- يتم بناؤها بواسطة Vite
- تُنشر في مجلد `dist/`
- يتم تقديمها كملفات ثابتة (Static)

### Backend (Serverless Functions)
- موجودة في مجلد `/api`
- كل ملف `.ts` في `/api` يصبح Serverless Function
- تعمل حسب الطلب (on-demand) وليست دائمة

### Database
- Neon PostgreSQL (Serverless)
- تعمل مع WebSockets للاتصال السريع
- متوافقة تماماً مع Vercel

## المسارات (Routes)

### مسارات المصادقة:
- `GET /api/auth/google` - بدء تسجيل الدخول عبر Google
- `GET /api/auth/google/callback` - معالجة العودة من Google
- `GET /api/auth/user` - الحصول على بيانات المستخدم الحالي
- `POST /api/auth/logout` - تسجيل الخروج

### مسارات المصانع:
- `GET /api/factories` - جلب جميع المصانع (عام)
- `GET /api/factories/:id` - جلب مصنع واحد (عام)
- `POST /api/factories` - إنشاء مصنع جديد (المسؤول فقط)
- `PATCH /api/factories/:id` - تحديث مصنع (المسؤول فقط)
- `DELETE /api/factories/:id` - حذف مصنع (المسؤول فقط)

**ملاحظة**: المسؤول الوحيد هو `bouazzasalah120120@gmail.com`

## الملفات المهمة

- `vercel.json` - إعدادات Vercel للتوجيه والرؤوس
- `api/index.ts` - Serverless Function الرئيسية
- `.vercelignore` - الملفات المستبعدة من النشر

## استكشاف الأخطاء

### الموقع لا يعمل بعد النشر

1. **تحقق من Logs**: افتح لوحة Vercel → اذهب للمشروع → Functions → اضغط على أي function → شاهد Logs
2. **تحقق من Environment Variables**: تأكد من إضافة `DATABASE_URL` بشكل صحيح
3. **تحقق من Build**: تأكد من أن الـ Build نجح بدون أخطاء

### خطأ 500 Internal Server Error

- تحقق من أن `DATABASE_URL` صحيح
- تحقق من أن قاعدة البيانات تحتوي على الجداول اللازمة
- قم بتشغيل `npm run db:push` محلياً أولاً للتأكد من المخطط

### خطأ Google OAuth 403

إذا ظهر "403. Il s'agit d'une erreur" من Google:
1. تحقق من إضافة Redirect URI الصحيح في Google Cloud Console
2. يجب أن يكون بالضبط: `https://your-app.vercel.app/api/auth/google/callback`
3. انتظر 5 دقائق بعد إضافة Redirect URI (قد يستغرق بعض الوقت للتفعيل)
4. تأكد من أن `GOOGLE_CLIENT_ID` و `GOOGLE_CLIENT_SECRET` صحيحين

### لا تعمل الجلسات (Sessions)

- تأكد من إضافة `SESSION_SECRET` في Environment Variables
- تحقق من أن جدول `session` موجود في Neon
- امسح الـ cookies وحاول مرة أخرى

### CORS Errors

الإعدادات في `vercel.json` تحل مشاكل CORS. إذا ظهرت مشاكل:
- تحقق من أن `vercel.json` موجود في الجذر
- تأكد من أن الـ headers صحيحة

## التحديثات المستقبلية

كل مرة تقوم بـ push إلى GitHub:
- Vercel سيقوم بـ Build & Deploy تلقائياً
- يمكنك إيقاف هذا من إعدادات المشروع

## الدومين المخصص (Optional)

لإضافة دومين خاص:
1. اذهب لإعدادات المشروع
2. اختر **Domains**
3. أضف الدومين الخاص بك
4. اتبع التعليمات لتحديث DNS

## ملاحظات تقنية مهمة

- **أمر البناء**: `npm run build` يبني Frontend فقط باستخدام Vite. ملف `api/index.ts` يُعامل تلقائياً كـ serverless function من Vercel.
- **مسارات API**: جميع المسارات في `api/index.ts` **لا تحتوي** على بادئة `/api` (مثل `app.get("/factories")` بدلاً من `app.get("/api/factories")`) لأن Vercel يضيفها تلقائياً.
- **CORS**: مُعد بشكل صحيح في `vercel.json` مع معالج OPTIONS في `api/index.ts`.
- **الملفات المستبعدة**: `.vercelignore` يستبعد الملفات غير الضرورية من النشر.

## الدعم

إذا واجهت مشاكل:
- [Vercel Documentation](https://vercel.com/docs)
- [Neon Documentation](https://neon.tech/docs)
- تحقق من Logs في لوحة Vercel
