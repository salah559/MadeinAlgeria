# 🔧 حل مشكلة 500 Error على Vercel

## المشكلة التي كانت موجودة ✅ تم الحل
**خطأ**: `FUNCTION_INVOCATION_FAILED`

**السبب**: Vercel Serverless Functions لا تدعم WebSockets بشكل كامل.

**الحل**: تم تحديث الكود لاستخدام Neon في "fetch mode" بدلاً من WebSocket mode.

---

## ✅ التحديثات التي تم إجراؤها:

### 1. `api/index.ts`
```typescript
// ✅ تم التغيير من:
import ws from "ws";
neonConfig.webSocketConstructor = ws;

// إلى:
neonConfig.fetchConnectionCache = true;
```

### 2. `server/storage.ts`
```typescript
// ✅ الآن يتعرف تلقائياً على البيئة
if (process.env.VERCEL) {
  neonConfig.fetchConnectionCache = true; // للـ Vercel
} else {
  // WebSocket للتطوير المحلي
}
```

---

## 📋 خطوات التحقق الآن:

### 1️⃣ تأكد من Environment Variables في Vercel
اذهب إلى **Vercel Dashboard** → مشروعك → **Settings** → **Environment Variables**

يجب أن يكون لديك:
```
✅ DATABASE_URL (من Neon integration)
✅ GOOGLE_CLIENT_ID
✅ GOOGLE_CLIENT_SECRET
✅ SESSION_SECRET
✅ NODE_ENV=production
```

### 2️⃣ تأكد من إنشاء الجداول في Neon
اذهب إلى [Neon Console](https://console.neon.tech/):
- افتح قاعدة البيانات المرتبطة بـ Vercel
- اذهب إلى **Tables** في القائمة الجانبية
- يجب أن ترى:
  - ✅ `users`
  - ✅ `factories`
  - ✅ `session`

**إذا لم تكن موجودة**، اذهب إلى **SQL Editor** ونفّذ:
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

### 3️⃣ Redeploy المشروع
بعد التعديلات:
```bash
git add .
git commit -m "Fix: Use Neon fetch mode for Vercel"
git push
```

أو من Vercel Dashboard:
- اذهب إلى **Deployments**
- اضغط على **⋯** بجانب آخر deployment
- اختر **Redeploy**

---

## 🔍 كيفية التحقق من Logs في Vercel

1. اذهب إلى **Vercel Dashboard**
2. اختر مشروعك
3. اذهب إلى **Deployments**
4. اضغط على آخر deployment
5. اذهب إلى **Functions**
6. اضغط على `/api/index`
7. شاهد **Logs** للتحقق من الأخطاء

---

## ⚠️ مشاكل شائعة أخرى

### المشكلة: Database Connection Failed
**الحل**:
- تحقق من أن `DATABASE_URL` موجود
- تحقق من أن قاعدة البيانات Neon تعمل
- تأكد من أن IP غير محظور في Neon

### المشكلة: Google OAuth 403
**الحل**:
- تحقق من Redirect URI في Google Cloud Console
- يجب أن يكون: `https://madein-algeria.vercel.app/api/auth/google/callback`

### المشكلة: Session not persisting
**الحل**:
- تأكد من وجود جدول `session` في Neon
- تحقق من `SESSION_SECRET` في Environment Variables
- امسح Cookies وحاول مرة أخرى

---

## 📞 إذا استمرت المشكلة

1. **تحقق من Logs** في Vercel
2. **تحقق من Database** في Neon Console
3. **تحقق من Environment Variables**
4. **أعد النشر** بعد التأكد من كل شيء

**الموقع يجب أن يعمل الآن!** ✨
