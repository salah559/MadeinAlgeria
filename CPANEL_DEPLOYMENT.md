# دليل رفع المشروع على cPanel

## المتطلبات
- حساب cPanel مع دعم Node.js (يجب أن يكون الإصدار 18 أو أحدث)
- قاعدة بيانات MySQL
- وصول SSH (اختياري لكن مفيد)

---

## الخطوة 1: إنشاء قاعدة البيانات MySQL

1. ادخل إلى **cPanel** > **MySQL Databases**
2. أنشئ قاعدة بيانات جديدة (مثلاً: `factory_db`)
3. أنشئ مستخدم جديد مع كلمة مرور قوية
4. أضف المستخدم إلى قاعدة البيانات مع **جميع الصلاحيات**

### تشغيل SQL Schema
1. ادخل إلى **phpMyAdmin**
2. اختر قاعدة البيانات التي أنشأتها
3. انتقل إلى تبويب **SQL**
4. انسخ محتوى ملف `database/schema.sql` والصقه
5. اضغط **Go** لتنفيذ الأوامر

---

## الخطوة 2: تجهيز الملفات للرفع

### الملفات المطلوبة:
```
cpanel-upload/
├── dist/               # ملفات البناء (npm run build)
├── server/             # ملفات السيرفر
├── shared/             # الملفات المشتركة
├── package.json        # ملف الحزم
├── package-lock.json   # قفل الحزم
└── .env               # متغيرات البيئة (أنشئه)
```

### بناء المشروع:
```bash
npm run build
```

---

## الخطوة 3: إعداد متغيرات البيئة

أنشئ ملف `.env` في المجلد الرئيسي:

```env
NODE_ENV=production
PORT=3000

# MySQL Database
DB_HOST=localhost
DB_USER=your_cpanel_username_dbuser
DB_PASSWORD=your_database_password
DB_NAME=your_cpanel_username_factory_db

# Firebase (إذا كنت تستخدم المصادقة)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# ImgBB (لرفع الصور)
IMGBB_API_KEY=your_imgbb_api_key
```

---

## الخطوة 4: رفع الملفات

### باستخدام File Manager:
1. ادخل **cPanel** > **File Manager**
2. انتقل إلى مجلد التطبيق (عادة `/home/username/public_html/app` أو مجلد مخصص)
3. ارفع جميع الملفات

### باستخدام FTP:
1. استخدم برنامج FTP مثل FileZilla
2. اتصل باستخدام بيانات FTP من cPanel
3. ارفع الملفات إلى المجلد المناسب

---

## الخطوة 5: إعداد Node.js في cPanel

1. ادخل **cPanel** > **Setup Node.js App**
2. اضغط **Create Application**
3. اختر:
   - **Node.js version**: 18.x أو أحدث
   - **Application mode**: Production
   - **Application root**: مسار مجلد التطبيق
   - **Application URL**: الدومين أو المسار
   - **Application startup file**: `start.js` (سننشئه في الخطوة التالية)
4. اضغط **Create**

### إنشاء ملف بدء التشغيل

أنشئ ملف `start.js` في المجلد الرئيسي:

```javascript
// start.js - Production startup script for cPanel
require('tsx/cjs');
require('./server/index.ts');
```

**ملاحظة مهمة**: هذا المشروع يستخدم TypeScript، لذا نحتاج `tsx` لتشغيل الكود مباشرة. تأكد من تثبيت الحزم أولاً.

---

## الخطوة 6: تثبيت الحزم

### من واجهة cPanel:
1. في صفحة Node.js App، اضغط **Run NPM Install**

### باستخدام SSH:
```bash
cd /home/username/path-to-app
source /home/username/nodevenv/app/18/bin/activate
npm install --production
```

---

## الخطوة 7: التبديل لاستخدام MySQL

في ملف `server/firebase-routes.ts`، غير الاستيراد:

```typescript
// قبل (Firebase)
import { storage } from "./firebase-storage";

// بعد (MySQL)
import { mysqlStorage as storage } from "./mysql-storage";
```

---

## الخطوة 8: إعادة تشغيل التطبيق

1. ادخل **Setup Node.js App**
2. اضغط **Restart** بجانب تطبيقك

---

## ملاحظات مهمة

### تحويل TypeScript:
إذا لم يدعم السيرفر TypeScript مباشرة، تحتاج لتحويل الملفات:
```bash
npx tsc
```

### أو استخدم tsx:
```bash
npx tsx server/index.ts
```

### إعداد .htaccess للتوجيه:
إذا كنت تستخدم Apache، أضف ملف `.htaccess`:
```apache
RewriteEngine On
RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
```

---

## استكشاف الأخطاء

### خطأ في الاتصال بقاعدة البيانات:
- تأكد من صحة اسم المستخدم وكلمة المرور
- تأكد أن المستخدم لديه صلاحيات على قاعدة البيانات

### التطبيق لا يعمل:
- راجع سجلات الأخطاء في **cPanel** > **Errors**
- تأكد من أن المنفذ صحيح

### مشاكل في الترميز العربي:
- تأكد أن قاعدة البيانات تستخدم `utf8mb4`
- تأكد أن الاتصال يستخدم `charset: 'utf8mb4'`

---

## الهيكل النهائي

```
/home/username/
├── public_html/
│   └── app/                    # أو المجلد الذي اخترته
│       ├── dist/               # ملفات الإنتاج
│       ├── node_modules/       # الحزم (بعد npm install)
│       ├── server/
│       ├── shared/
│       ├── package.json
│       └── .env
└── nodevenv/                   # بيئة Node.js
```

---

## للمساعدة

إذا واجهت مشاكل، تأكد من:
1. إصدار Node.js متوافق (18+)
2. MySQL يعمل ويمكن الوصول إليه
3. جميع متغيرات البيئة معدة بشكل صحيح
4. الملفات مرفوعة بالكامل
