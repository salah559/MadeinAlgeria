<?php
/**
 * User Login Endpoint
 * POST /login.php
 * Body: { "email": "user@example.com", "password": "secret123" }
 */

require_once __DIR__ . '/config/config.php';

// Session configuration - must be set before session_start()
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
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    $email = trim($input['email'] ?? '');
    $password = $input['password'] ?? '';
    
    if (empty($email) || empty($password)) {
        http_response_code(400);
        echo json_encode(['status' => false, 'message' => 'البريد الإلكتروني وكلمة المرور مطلوبان']);
        exit;
    }
    
    $db = Database::getInstance()->getConnection();
    
    $stmt = $db->prepare(
        "SELECT id, email, name, password_hash, is_verified, role FROM users WHERE email = ?"
    );
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user) {
        http_response_code(401);
        echo json_encode(['status' => false, 'message' => 'البريد الإلكتروني أو كلمة المرور غير صحيحة']);
        exit;
    }
    
    if (!password_verify($password, $user['password_hash'])) {
        http_response_code(401);
        echo json_encode(['status' => false, 'message' => 'البريد الإلكتروني أو كلمة المرور غير صحيحة']);
        exit;
    }
    
    if ($user['is_verified'] == 0) {
        http_response_code(401);
        echo json_encode(['status' => false, 'message' => 'يرجى تأكيد بريدك الإلكتروني أولاً']);
        exit;
    }
    
    // Regenerate session ID for security
    session_regenerate_id(true);
    
    // Store user data in session
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['email'] = $user['email'];
    $_SESSION['name'] = $user['name'] ?? '';
    $_SESSION['role'] = $user['role'] ?? 'user';
    $_SESSION['logged_in'] = true;
    
    http_response_code(200);
    echo json_encode([
        'status' => true,
        'message' => 'تم تسجيل الدخول بنجاح',
        'user' => [
            'id' => (string)$user['id'],
            'email' => $user['email'],
            'name' => $user['name'] ?? '',
            'role' => $user['role'] ?? 'user',
            'isVerified' => true,
            'createdAt' => null
        ]
    ]);
    
} catch (Exception $e) {
    error_log("Login error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => false, 'message' => 'حدث خطأ غير متوقع']);
}
