<?php
/**
 * Session Verification Endpoint
 * GET /auth_verify.php
 * Returns current user data if session is valid
 */

require_once __DIR__ . '/config/config.php';

// Session configuration must be set before session_start()
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
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['status' => false, 'message' => 'Method not allowed']);
    exit;
}

try {
    // Check if session has user data
    if (!isset($_SESSION['user_id']) || !isset($_SESSION['email'])) {
        http_response_code(401);
        echo json_encode(['status' => false, 'message' => 'Not authenticated']);
        exit;
    }

    require_once __DIR__ . '/lib/Database.php';
    
    $db = Database::getInstance()->getConnection();
    
    // Fetch fresh user data from database
    $stmt = $db->prepare(
        "SELECT id, email, name, is_verified, role, created_at FROM users WHERE id = ?"
    );
    $stmt->execute([$_SESSION['user_id']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user) {
        // User no longer exists, destroy session
        session_destroy();
        http_response_code(401);
        echo json_encode(['status' => false, 'message' => 'User not found']);
        exit;
    }
    
    http_response_code(200);
    echo json_encode([
        'status' => true,
        'user' => [
            'id' => (string)$user['id'],
            'email' => $user['email'],
            'name' => $user['name'] ?? '',
            'role' => $user['role'] ?? 'user',
            'isVerified' => (bool)$user['is_verified'],
            'createdAt' => $user['created_at']
        ]
    ]);

} catch (Exception $e) {
    error_log("Auth verify error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => false, 'message' => 'Server error']);
}
