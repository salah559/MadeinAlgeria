# نظام المصادقة بـ PHP
# PHP Authentication Backend

## المتطلبات | Requirements
- PHP 8.0+
- MySQL 5.7+
- cPanel with SMTP mail configured

## هيكل الملفات | File Structure
```
php-backend/
├── config/
│   └── config.php          # إعدادات قاعدة البيانات والبريد
├── lib/
│   ├── Database.php        # اتصال PDO
│   ├── Auth.php            # وظائف المصادقة
│   ├── JWT.php             # تشفير وفك تشفير JWT
│   └── Mailer.php          # إرسال البريد عبر SMTP
├── register.php            # نقطة نهاية التسجيل
├── verify.php              # نقطة نهاية التحقق
├── login.php               # نقطة نهاية تسجيل الدخول
├── me.php                  # نقطة نهاية بيانات المستخدم
├── database.sql            # أوامر إنشاء الجداول
└── README.md               # هذا الملف
```

## التثبيت على cPanel | Installation on cPanel

### 1. رفع الملفات | Upload Files
رفع محتويات مجلد php-backend إلى:
```
public_html/api/
```

**هيكل الملفات بعد الرفع:**
```
public_html/
└── api/
    ├── config/
    │   └── config.php
    ├── lib/
    │   ├── Database.php
    │   ├── Auth.php
    │   ├── JWT.php
    │   └── Mailer.php
    ├── register.php
    ├── verify.php
    ├── login.php
    └── me.php
```

### 2. إنشاء قاعدة البيانات | Create Database
1. افتح phpMyAdmin من cPanel
2. أنشئ قاعدة بيانات جديدة
3. نفذ محتوى ملف `database.sql`

### 3. تعديل الإعدادات | Configure Settings
عدل ملف `config/config.php`:

```php
// بيانات قاعدة البيانات
define('DB_HOST', 'localhost');
define('DB_USER', 'cpanel_user');      // اسم المستخدم من cPanel
define('DB_PASS', 'your_password');     // كلمة المرور
define('DB_NAME', 'cpanel_dbname');     // اسم قاعدة البيانات

// إعدادات البريد SMTP
define('SMTP_HOST', 'mail.yourdomain.com');
define('SMTP_PORT', 465);
define('SMTP_USER', 'noreply@yourdomain.com');
define('SMTP_PASS', 'email_password');
define('SMTP_FROM_NAME', 'اسم تطبيقك');

// رابط API (مع /api)
define('APP_URL', 'https://yourdomain.com/api');

// مفتاح JWT (غيره لمفتاح عشوائي قوي)
define('JWT_SECRET', 'your-super-secret-random-key-32-chars-minimum');
```

### 4. إعداد SMTP على cPanel | Configure SMTP
1. افتح Email Accounts في cPanel
2. أنشئ حساب بريد (مثل noreply@yourdomain.com)
3. استخدم بيانات هذا الحساب في config.php

### 5. إعدادات PHP | PHP Settings
تأكد من:
- PHP 8.0 أو أحدث
- تفعيل extension: pdo_mysql
- تفعيل extension: openssl

## استخدام API | API Usage

### التسجيل | Register
```bash
POST https://yourdomain.com/api/register.php
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "secret123"
}
```

**الاستجابة الناجحة:**
```json
{
    "status": true,
    "message": "تم التسجيل بنجاح. يرجى التحقق من بريدك الإلكتروني"
}
```

**الاستجابة الفاشلة:**
```json
{
    "status": false,
    "message": "البريد الإلكتروني مستخدم مسبقاً"
}
```

### تسجيل الدخول | Login
```bash
POST https://yourdomain.com/api/login.php
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "secret123"
}
```

**الاستجابة الناجحة:**
```json
{
    "status": true,
    "message": "تم تسجيل الدخول بنجاح",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
        "id": 1,
        "email": "user@example.com"
    }
}
```

### الحصول على بيانات المستخدم | Get User Data
```bash
GET https://yourdomain.com/api/me.php
Authorization: Bearer <token>
```

**الاستجابة الناجحة:**
```json
{
    "status": true,
    "user": {
        "id": 1,
        "email": "user@example.com",
        "is_verified": 1,
        "created_at": "2024-01-01 12:00:00"
    }
}
```

### التحقق من البريد | Verify Email
```
GET https://yourdomain.com/api/verify.php?token=<verification_token>
```
يعرض صفحة HTML جميلة بنتيجة التحقق.

## Postman Collection

استورد هذا JSON في Postman:

```json
{
    "info": {
        "name": "PHP Auth API",
        "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    "item": [
        {
            "name": "Register",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n    \"email\": \"test@example.com\",\n    \"password\": \"123456\"\n}"
                },
                "url": {
                    "raw": "{{base_url}}/register.php",
                    "host": ["{{base_url}}"],
                    "path": ["register.php"]
                }
            }
        },
        {
            "name": "Login",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n    \"email\": \"test@example.com\",\n    \"password\": \"123456\"\n}"
                },
                "url": {
                    "raw": "{{base_url}}/login.php",
                    "host": ["{{base_url}}"],
                    "path": ["login.php"]
                }
            }
        },
        {
            "name": "Get Current User",
            "request": {
                "method": "GET",
                "header": [
                    {
                        "key": "Authorization",
                        "value": "Bearer {{token}}"
                    }
                ],
                "url": {
                    "raw": "{{base_url}}/me.php",
                    "host": ["{{base_url}}"],
                    "path": ["me.php"]
                }
            }
        }
    ],
    "variable": [
        {
            "key": "base_url",
            "value": "https://yourdomain.com/api"
        },
        {
            "key": "token",
            "value": ""
        }
    ]
}
```

## الأمان | Security Notes

1. **غير JWT_SECRET** لمفتاح عشوائي قوي (32 حرف على الأقل)
2. **استخدم HTTPS** دائماً
3. **لا تشارك ملف config.php** أو ترفعه لـ git
4. **أضف rate limiting** للحماية من هجمات القوة الغاشمة
5. **تأكد من صلاحيات الملفات** على الخادم

## استكشاف الأخطاء | Troubleshooting

### البريد لا يصل
- تأكد من بيانات SMTP صحيحة
- تحقق من سجلات الأخطاء في cPanel
- تأكد من تفعيل port 465 للـ SSL

### خطأ في قاعدة البيانات
- تأكد من صحة بيانات الاتصال
- تحقق من وجود جدول users
- تأكد من صلاحيات المستخدم على قاعدة البيانات

### خطأ 500
- تحقق من سجلات الأخطاء في cPanel
- تأكد من نسخة PHP 8.0+
- تأكد من تفعيل pdo_mysql
