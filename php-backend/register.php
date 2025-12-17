<?php
/**
 * User Registration Endpoint
 * POST /register.php
 * Body: { "email": "user@example.com", "password": "secret123", "name": "User Name" }
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
    require_once __DIR__ . '/lib/Auth.php';
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    $email = trim($input['email'] ?? '');
    $password = $input['password'] ?? '';
    $name = trim($input['name'] ?? '');
    
    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['status' => false, 'message' => 'البريد الإلكتروني غير صالح']);
        exit;
    }
    
    // Validate password
    if (strlen($password) < 6) {
        http_response_code(400);
        echo json_encode(['status' => false, 'message' => 'كلمة المرور يجب أن تكون 6 أحرف على الأقل']);
        exit;
    }
    
    $auth = new Auth();
    $result = $auth->registerWithName($email, $password, $name);
    
    if ($result['status']) {
        http_response_code(201);
    } else {
        http_response_code(400);
    }
    
    echo json_encode($result);
    
} catch (Exception $e) {
    error_log("Registration error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => false, 'message' => 'حدث خطأ غير متوقع']);
}
