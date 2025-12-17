<?php
/**
 * Mailer Class using SMTP
 * Uses socket-based SMTP for cPanel compatibility
 */

class Mailer {
    private static $lastError = '';
    
    /**
     * Get last error message
     */
    public static function getLastError() {
        return self::$lastError;
    }
    
    /**
     * Send verification email
     * @return bool|string Returns true on success, error message on failure
     */
    public static function sendVerificationEmail($toEmail, $token) {
        $verifyUrl = APP_URL . "/verify.php?token=" . $token;
        
        $subject = "Verify Your Email Address";
        
        $htmlBody = "
        <!DOCTYPE html>
        <html dir='rtl' lang='ar'>
        <head>
            <meta charset='UTF-8'>
        </head>
        <body style='font-family: Arial, sans-serif; direction: rtl;'>
            <div style='max-width: 600px; margin: 0 auto; padding: 20px;'>
                <h2 style='color: #333;'>تأكيد البريد الإلكتروني</h2>
                <p>مرحباً،</p>
                <p>شكراً لتسجيلك. يرجى النقر على الزر أدناه لتأكيد بريدك الإلكتروني:</p>
                <p style='text-align: center;'>
                    <a href='{$verifyUrl}' 
                       style='display: inline-block; padding: 12px 24px; background-color: #4CAF50; 
                              color: white; text-decoration: none; border-radius: 5px;'>
                        تأكيد البريد الإلكتروني
                    </a>
                </p>
                <p>أو انسخ الرابط التالي:</p>
                <p style='word-break: break-all; color: #666;'>{$verifyUrl}</p>
                <hr style='border: none; border-top: 1px solid #eee; margin: 20px 0;'>
                <p style='color: #999; font-size: 12px;'>
                    إذا لم تقم بإنشاء حساب، يمكنك تجاهل هذا البريد.
                </p>
            </div>
        </body>
        </html>
        ";
        
        $result = self::sendSmtp($toEmail, $subject, $htmlBody);
        
        if ($result === true) {
            return true;
        }
        
        return self::$lastError ?: 'فشل إرسال البريد الإلكتروني';
    }
    
    /**
     * Send email using SMTP
     */
    private static function sendSmtp($to, $subject, $htmlBody) {
        self::$lastError = '';
        
        try {
            $socket = @fsockopen('ssl://' . SMTP_HOST, SMTP_PORT, $errno, $errstr, 30);
            
            if (!$socket) {
                self::$lastError = "SMTP Connection failed: $errstr";
                error_log(self::$lastError);
                return false;
            }
            
            $response = fgets($socket, 512);
            if (substr($response, 0, 3) != '220') {
                self::$lastError = "SMTP Server not ready";
                fclose($socket);
                return false;
            }
            
            fputs($socket, "EHLO " . SMTP_HOST . "\r\n");
            self::getResponse($socket);
            
            fputs($socket, "AUTH LOGIN\r\n");
            self::getResponse($socket);
            
            fputs($socket, base64_encode(SMTP_USER) . "\r\n");
            self::getResponse($socket);
            
            fputs($socket, base64_encode(SMTP_PASS) . "\r\n");
            $authResponse = self::getResponse($socket);
            
            if (substr($authResponse, 0, 3) != '235') {
                self::$lastError = "SMTP Authentication failed";
                fclose($socket);
                return false;
            }
            
            fputs($socket, "MAIL FROM:<" . SMTP_USER . ">\r\n");
            self::getResponse($socket);
            
            fputs($socket, "RCPT TO:<" . $to . ">\r\n");
            $rcptResponse = self::getResponse($socket);
            
            if (substr($rcptResponse, 0, 3) != '250') {
                self::$lastError = "Recipient rejected";
                fclose($socket);
                return false;
            }
            
            fputs($socket, "DATA\r\n");
            self::getResponse($socket);
            
            $headers = "From: " . SMTP_FROM_NAME . " <" . SMTP_USER . ">\r\n";
            $headers .= "To: <" . $to . ">\r\n";
            $headers .= "Subject: " . $subject . "\r\n";
            $headers .= "MIME-Version: 1.0\r\n";
            $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
            $headers .= "\r\n";
            
            fputs($socket, $headers . $htmlBody . "\r\n.\r\n");
            $dataResponse = self::getResponse($socket);
            
            fputs($socket, "QUIT\r\n");
            fclose($socket);
            
            if (substr($dataResponse, 0, 3) == '250') {
                return true;
            }
            
            self::$lastError = "Message not accepted by server";
            return false;
            
        } catch (Exception $e) {
            self::$lastError = "SMTP Error: " . $e->getMessage();
            error_log(self::$lastError);
            return false;
        }
    }
    
    private static function getResponse($socket) {
        $response = '';
        while ($line = fgets($socket, 512)) {
            $response .= $line;
            if (substr($line, 3, 1) == ' ') break;
        }
        return $response;
    }
}
