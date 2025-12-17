<?php
/**
 * Email Verification Endpoint
 * GET /verify.php?token=xyz
 * Returns HTML page (not JSON)
 */

require_once __DIR__ . '/config/config.php';

// Set HTML headers for this endpoint
header('Content-Type: text/html; charset=utf-8');

// Use FRONTEND_URL for redirects
$frontendUrl = defined('FRONTEND_URL') ? FRONTEND_URL : str_replace('/api', '', APP_URL);

try {
    require_once __DIR__ . '/lib/Auth.php';
    
    $token = $_GET['token'] ?? '';
    
    $auth = new Auth();
    $result = $auth->verify($token);
    
} catch (DatabaseException $e) {
    $result = ['status' => false, 'message' => 'خطأ في الاتصال بقاعدة البيانات. حاول لاحقاً'];
} catch (Exception $e) {
    $result = ['status' => false, 'message' => 'حدث خطأ غير متوقع'];
}
?>
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تأكيد البريد الإلكتروني</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            direction: rtl;
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 15px 35px rgba(0,0,0,0.2);
            text-align: center;
            max-width: 400px;
        }
        .icon {
            font-size: 60px;
            margin-bottom: 20px;
        }
        .success .icon { color: #4CAF50; }
        .error .icon { color: #f44336; }
        h1 {
            color: #333;
            margin-bottom: 15px;
            font-size: 24px;
        }
        p {
            color: #666;
            line-height: 1.6;
        }
        .btn {
            display: inline-block;
            margin-top: 25px;
            padding: 12px 30px;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            transition: background 0.3s;
        }
        .btn:hover {
            background: #5a6fd6;
        }
    </style>
</head>
<body>
    <div class="container <?php echo $result['status'] ? 'success' : 'error'; ?>">
        <?php if ($result['status']): ?>
            <div class="icon">&#10004;</div>
            <h1>تم التأكيد بنجاح!</h1>
            <p><?php echo htmlspecialchars($result['message']); ?></p>
            <a href="<?php echo htmlspecialchars($frontendUrl); ?>" class="btn">الذهاب للتطبيق</a>
        <?php else: ?>
            <div class="icon">&#10008;</div>
            <h1>فشل التأكيد</h1>
            <p><?php echo htmlspecialchars($result['message']); ?></p>
            <a href="<?php echo htmlspecialchars($frontendUrl); ?>" class="btn">العودة للرئيسية</a>
        <?php endif; ?>
    </div>
</body>
</html>
