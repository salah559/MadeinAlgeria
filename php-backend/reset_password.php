<?php
/**
 * Password Reset Request Endpoint
 * POST /reset_password.php
 * Body: { "email": "user@example.com" }
 */

require_once __DIR__ . '/config/config.php';

// Session configuration
session_set_cookie_params([
    'lifetime' => 86400,
    'path' => '/',
    'domain' => '',
    'secure' => isset($_SERVER['HTTPS']),
    'httponly' => true,
    'samesite' => 'Lax'
]);

session_start();

// CORS headers - allow credentials (must have specific origin, not *)
if (!defined('FRONTEND_URL') || FRONTEND_URL === '') {
    http_response_code(500);
    echo json_encode(['status' => false, 'message' => 'FRONTEND_URL not configured']);
    exit;
}
header('Access-Control-Allow-Origin: ' . FRONTEND_URL);
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => false, 'message' => 'Method not allowed']);
    exit;
}

try {
    require_once __DIR__ . '/lib/Database.php';
    require_once __DIR__ . '/lib/Mailer.php';
    
    $input = json_decode(file_get_contents('php://input'), true);
    $email = trim($input['email'] ?? '');
    
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['status' => false, 'message' => 'البريد الإلكتروني غير صالح']);
        exit;
    }
    
    $db = Database::getInstance()->getConnection();
    
    // Check if user exists
    $stmt = $db->prepare("SELECT id, email FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Always return success to prevent email enumeration
    if (!$user) {
        http_response_code(200);
        echo json_encode([
            'status' => true,
            'message' => 'إذا كان البريد الإلكتروني مسجلاً، سيتم إرسال رابط إعادة تعيين كلمة المرور'
        ]);
        exit;
    }
    
    // Generate reset token
    $resetToken = bin2hex(random_bytes(32));
    $expiry = date('Y-m-d H:i:s', strtotime('+1 hour'));
    
    // Save reset token
    $stmt = $db->prepare(
        "UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?"
    );
    $stmt->execute([$resetToken, $expiry, $user['id']]);
    
    // Send reset email
    $resetUrl = (defined('FRONTEND_URL') ? FRONTEND_URL : APP_URL) . "/reset-password?token=" . $resetToken;
    
    $mailResult = Mailer::sendPasswordResetEmail($email, $resetToken, $resetUrl);
    
    if ($mailResult !== true) {
        error_log("Failed to send password reset email to $email: $mailResult");
    }
    
    http_response_code(200);
    echo json_encode([
        'status' => true,
        'message' => 'إذا كان البريد الإلكتروني مسجلاً، سيتم إرسال رابط إعادة تعيين كلمة المرور'
    ]);

} catch (Exception $e) {
    error_log("Password reset error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => false, 'message' => 'حدث خطأ غير متوقع']);
}
