<?php
/**
 * User Login Endpoint
 * POST /login.php
 * Body: { "email": "user@example.com", "password": "secret123" }
 */

require_once __DIR__ . '/config/config.php';

// Set JSON headers for this endpoint
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => false, 'message' => 'Method not allowed']);
    exit;
}

try {
    require_once __DIR__ . '/lib/Auth.php';
    
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';
    
    $auth = new Auth();
    $result = $auth->login($email, $password);
    
    if ($result['status']) {
        http_response_code(200);
    } else {
        http_response_code(401);
    }
    
    echo json_encode($result);
    
} catch (DatabaseException $e) {
    http_response_code(500);
    echo json_encode(['status' => false, 'message' => 'خطأ في الاتصال بقاعدة البيانات']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => false, 'message' => 'حدث خطأ غير متوقع']);
}
