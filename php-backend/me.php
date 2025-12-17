<?php
/**
 * Get Current User Endpoint (Protected)
 * GET /me.php
 * Header: Authorization: Bearer <token>
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

// Only accept GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['status' => false, 'message' => 'Method not allowed']);
    exit;
}

try {
    require_once __DIR__ . '/lib/Auth.php';
    
    // Get Authorization header
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    
    // Some servers use different header
    if (empty($authHeader) && function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    }
    
    $auth = new Auth();
    $result = $auth->getUser($authHeader);
    
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
