# دليل إعداد Google OAuth في Supabase

## الخطوة الأولى: إنشاء مشروع في Google Cloud Console

1. **انتقل إلى Google Cloud Console**
   - افتح [Google Cloud Console](https://console.cloud.google.com)
   - سجل الدخول بحسابك في Google

2. **إنشاء مشروع جديد (أو اختيار مشروع موجود)**
   - اضغط على القائمة المنسدلة للمشاريع في الأعلى
   - اضغط "New Project" (مشروع جديد)
   - اختر اسماً للمشروع (مثل: "Made in Algeria")
   - اضغط "Create"

## الخطوة الثانية: إعداد OAuth Consent Screen

1. **انتقل إلى OAuth Consent Screen**
   - من القائمة الجانبية، اختر: **APIs & Services** → **OAuth consent screen**

2. **اختر نوع المستخدم**
   - اختر **External** (لجميع المستخدمين)
   - اضغط "Create"

3. **املأ معلومات التطبيق**
   - **App name**: Made in Algeria (أو اسم تطبيقك)
   - **User support email**: بريدك الإلكتروني
   - **Developer contact email**: بريدك الإلكتروني
   
4. **أضف النطاقات المسموحة (Authorized domains)**
   - اضغط "Add Domain"
   - أضف: `supabase.co`
   - أضف نطاقك الخاص إذا كان لديك (اختياري)

5. **احفظ وتابع**
   - اضغط "Save and Continue" في كل خطوة
   - يمكنك تخطي خطوة Scopes
   - أضف نفسك كـ Test User إذا كان التطبيق في مرحلة Testing

## الخطوة الثالثة: إنشاء OAuth Credentials

1. **انتقل إلى Credentials**
   - من القائمة الجانبية: **APIs & Services** → **Credentials**

2. **إنشاء OAuth Client ID**
   - اضغط "+ CREATE CREDENTIALS"
   - اختر **OAuth client ID**

3. **اختر نوع التطبيق**
   - **Application type**: Web application
   - **Name**: Made in Algeria Web Client (أو أي اسم)

4. **احصل على Callback URL من Supabase**
   - افتح [Supabase Dashboard](https://app.supabase.com)
   - اختر مشروعك (hydtiskblituulfdrmzk)
   - انتقل إلى: **Authentication** → **Providers** → **Google**
   - انسخ الـ **Callback URL** (سيكون شكله: `https://hydtiskblituulfdrmzk.supabase.co/auth/v1/callback`)

5. **أضف الـ Authorized redirect URIs**
   - في Google Cloud Console، في قسم "Authorized redirect URIs"
   - اضغط "ADD URI"
   - الصق الـ Callback URL من Supabase
   - مثال: `https://hydtiskblituulfdrmzk.supabase.co/auth/v1/callback`

6. **أضف الـ Authorized JavaScript origins (اختياري)**
   - اضغط "ADD URI" في قسم "Authorized JavaScript origins"
   - أضف: `https://hydtiskblituulfdrmzk.supabase.co`
   - للتطوير المحلي، يمكنك إضافة: `http://localhost:3000` (لكن ليس ضرورياً في Replit)

7. **احفظ وانسخ المفاتيح**
   - اضغط "Create"
   - ستظهر نافذة بها:
     - **Client ID**: انسخه (سيبدأ بـ `xxxxxx.apps.googleusercontent.com`)
     - **Client Secret**: انسخه (سلسلة عشوائية)
   - **احتفظ بهما في مكان آمن!**

## الخطوة الرابعة: إعداد Google OAuth في Supabase

1. **افتح Supabase Dashboard**
   - اذهب إلى [Supabase Dashboard](https://app.supabase.com)
   - اختر مشروعك (hydtiskblituulfdrmzk)

2. **انتقل إلى Authentication Providers**
   - من القائمة الجانبية: **Authentication** → **Providers**
   - ابحث عن **Google** في القائمة

3. **فعّل Google Provider**
   - اضغط على **Google**
   - فعّل الخيار: **Enable Sign in with Google**

4. **أدخل Client ID و Client Secret**
   - **Client ID**: الصق الـ Client ID من Google Cloud Console
   - **Client Secret**: الصق الـ Client Secret من Google Cloud Console

5. **احفظ الإعدادات**
   - اضغط **Save** في الأسفل

## الخطوة الخامسة: اختبار التكامل

1. **أعد تشغيل التطبيق**
   - في Replit، تأكد من أن التطبيق يعمل

2. **جرّب تسجيل الدخول**
   - افتح صفحة Login في تطبيقك
   - اضغط على زر "تسجيل الدخول بواسطة Google"
   - يجب أن يفتح نافذة تسجيل الدخول بـ Google
   - اختر حساب Google وسجل الدخول
   - يجب أن يتم إعادة توجيهك إلى الصفحة الرئيسية بنجاح

## ملاحظات مهمة

### عند نشر التطبيق في الإنتاج (Production)
1. أضف نطاق موقعك الفعلي إلى:
   - **Authorized domains** في OAuth consent screen
   - **Authorized redirect URIs** في Credentials
   - **Site URL** في Supabase → Authentication → URL Configuration

2. قد تحتاج إلى إرسال التطبيق للمراجعة من Google إذا كنت تطلب بيانات حساسة

### استكشاف الأخطاء
- ❌ **"redirect_uri_mismatch"**: تأكد من أن Callback URL في Google يطابق تماماً الـ URL في Supabase
- ❌ **"Unsupported provider: missing OAuth secret"**: تأكد من حفظ Client ID و Secret في Supabase
- ❌ **"Access blocked"**: تأكد من إضافة نفسك كـ Test User في OAuth consent screen

### الأمان
- ✅ لا تشارك Client Secret مع أي شخص
- ✅ لا تضع Client Secret في الكود المصدري
- ✅ Supabase يدير المفاتيح بشكل آمن على الخادم

---

## ملخص سريع

```
1. Google Cloud Console → إنشاء مشروع
2. OAuth consent screen → إعداد معلومات التطبيق
3. Credentials → إنشاء OAuth Client ID
4. نسخ Client ID و Client Secret
5. Supabase → Authentication → Providers → Google → إدخال المفاتيح
6. حفظ وتجربة!
```

إذا واجهت أي مشاكل، تحقق من:
- الـ Callback URL صحيح في كلا المكانين
- Client ID و Secret محفوظان في Supabase
- OAuth consent screen مكتمل
