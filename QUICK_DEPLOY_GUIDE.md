# دليل النشر السريع على Vercel ⚡

## خطوات سريعة (5 دقائق)

### 1️⃣ Google OAuth Setup
اذهب إلى [Google Cloud Console](https://console.cloud.google.com/):
- أنشئ OAuth 2.0 Client ID
- أضف Redirect URI: `https://your-app.vercel.app/api/auth/google/callback`
- احفظ Client ID و Client Secret

### 2️⃣ رفع المشروع إلى GitHub
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push
```

### 3️⃣ النشر على Vercel
1. اذهب إلى [vercel.com](https://vercel.com)
2. **New Project** → اختر repository من GitHub
3. Framework: **Vite** (يختار تلقائيًا)

### 4️⃣ ربط Neon Database (تلقائي!)
في صفحة المشروع:
- اذهب إلى **Storage** tab
- **Connect Store** → **Neon Postgres**
- سيضيف `DATABASE_URL` تلقائيًا ✅

### 5️⃣ إضافة Environment Variables
في **Settings** → **Environment Variables**:
```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=any_random_32_character_string
NODE_ENV=production
```

### 6️⃣ إنشاء الجداول
اذهب إلى [Neon Console](https://console.neon.tech/):
- افتح قاعدة البيانات
- **SQL Editor**
- نفذ هذا الكود:

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

CREATE INDEX idx_session_expire ON session(expire);
```

### 7️⃣ Deploy!
اضغط **Deploy** في Vercel - وانتهى! 🎉

---

## 🔧 حل المشاكل السريع

### Google OAuth Error 403
- ✅ تأكد من Redirect URI: `https://your-exact-app-name.vercel.app/api/auth/google/callback`
- ✅ انتظر 5 دقائق بعد إضافة URI

### الموقع لا يعمل
- ✅ تحقق من Environment Variables
- ✅ تأكد من إنشاء الجداول في Neon
- ✅ شاهد Logs في Vercel Dashboard

---

## 📝 الملاحظات

- **المسؤول الوحيد**: `bouazzasalah120120@gmail.com`
- **التحديثات**: كل push لـ GitHub = deploy تلقائي
- **التكلفة**: مجاني للبدء!

للمزيد من التفاصيل، راجع `VERCEL_DEPLOYMENT.md`
