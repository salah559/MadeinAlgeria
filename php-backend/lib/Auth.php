<?php
/**
 * Authentication Class
 */

require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/JWT.php';
require_once __DIR__ . '/Mailer.php';

class Auth {
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }
    
    /**
     * Register new user
     */
    public function register($email, $password) {
        return $this->registerWithName($email, $password, '');
    }
    
    /**
     * Register new user with name
     */
    public function registerWithName($email, $password, $name = '') {
        // Validate email
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return ['status' => false, 'message' => 'البريد الإلكتروني غير صالح'];
        }
        
        // Validate password
        if (strlen($password) < 6) {
            return ['status' => false, 'message' => 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'];
        }
        
        // Check if email exists
        $stmt = $this->db->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        
        if ($stmt->fetch()) {
            return ['status' => false, 'message' => 'البريد الإلكتروني مستخدم مسبقاً'];
        }
        
        // Hash password
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);
        
        // Generate verification token
        $verificationToken = bin2hex(random_bytes(32));
        
        // Insert user with name
        $stmt = $this->db->prepare(
            "INSERT INTO users (email, password_hash, name, verification_token, is_verified, role, created_at) 
             VALUES (?, ?, ?, ?, 0, 'user', NOW())"
        );
        
        try {
            $stmt->execute([$email, $passwordHash, $name, $verificationToken]);
            $userId = $this->db->lastInsertId();
            
            // Send verification email
            $mailResult = Mailer::sendVerificationEmail($email, $verificationToken);
            
            if ($mailResult !== true) {
                // Email failed - delete the user so they can try again
                $deleteStmt = $this->db->prepare("DELETE FROM users WHERE id = ?");
                $deleteStmt->execute([$userId]);
                
                error_log("Failed to send verification email to $email: $mailResult");
                
                return [
                    'status' => false, 
                    'message' => 'فشل إرسال بريد التحقق. تأكد من صحة البريد الإلكتروني وحاول مرة أخرى'
                ];
            }
            
            return [
                'status' => true, 
                'message' => 'تم التسجيل بنجاح. يرجى التحقق من بريدك الإلكتروني'
            ];
        } catch (PDOException $e) {
            error_log("Registration DB error: " . $e->getMessage());
            return ['status' => false, 'message' => 'حدث خطأ أثناء التسجيل'];
        }
    }
    
    /**
     * Verify email with token
     */
    public function verify($token) {
        if (empty($token)) {
            return ['status' => false, 'message' => 'رمز التحقق مطلوب'];
        }
        
        $stmt = $this->db->prepare(
            "SELECT id FROM users WHERE verification_token = ? AND is_verified = 0"
        );
        $stmt->execute([$token]);
        $user = $stmt->fetch();
        
        if (!$user) {
            return ['status' => false, 'message' => 'رمز التحقق غير صالح أو مستخدم مسبقاً'];
        }
        
        // Update user
        $stmt = $this->db->prepare(
            "UPDATE users SET is_verified = 1, verification_token = NULL WHERE id = ?"
        );
        $stmt->execute([$user['id']]);
        
        return ['status' => true, 'message' => 'تم تأكيد البريد الإلكتروني بنجاح'];
    }
    
    /**
     * Login user
     */
    public function login($email, $password) {
        if (empty($email) || empty($password)) {
            return ['status' => false, 'message' => 'البريد الإلكتروني وكلمة المرور مطلوبان'];
        }
        
        $stmt = $this->db->prepare(
            "SELECT id, email, password_hash, is_verified FROM users WHERE email = ?"
        );
        $stmt->execute([$email]);
        $user = $stmt->fetch();
        
        if (!$user) {
            return ['status' => false, 'message' => 'البريد الإلكتروني أو كلمة المرور غير صحيحة'];
        }
        
        if (!password_verify($password, $user['password_hash'])) {
            return ['status' => false, 'message' => 'البريد الإلكتروني أو كلمة المرور غير صحيحة'];
        }
        
        if ($user['is_verified'] == 0) {
            return ['status' => false, 'message' => 'يرجى تأكيد بريدك الإلكتروني أولاً'];
        }
        
        // Generate JWT
        $token = JWT::encode([
            'user_id' => $user['id'],
            'email' => $user['email']
        ], JWT_SECRET);
        
        return [
            'status' => true,
            'message' => 'تم تسجيل الدخول بنجاح',
            'token' => $token,
            'user' => [
                'id' => $user['id'],
                'email' => $user['email']
            ]
        ];
    }
    
    /**
     * Get user from JWT token
     */
    public function getUser($authHeader) {
        if (empty($authHeader)) {
            return ['status' => false, 'message' => 'Authorization header مطلوب'];
        }
        
        // Extract token from "Bearer <token>"
        if (!preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            return ['status' => false, 'message' => 'صيغة التوكن غير صحيحة'];
        }
        
        $token = $matches[1];
        
        try {
            $payload = JWT::decode($token, JWT_SECRET);
            
            $stmt = $this->db->prepare(
                "SELECT id, email, is_verified, created_at FROM users WHERE id = ?"
            );
            $stmt->execute([$payload['user_id']]);
            $user = $stmt->fetch();
            
            if (!$user) {
                return ['status' => false, 'message' => 'المستخدم غير موجود'];
            }
            
            return [
                'status' => true,
                'user' => $user
            ];
        } catch (Exception $e) {
            return ['status' => false, 'message' => $e->getMessage()];
        }
    }
}
