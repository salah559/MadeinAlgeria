<?php
/**
 * Configuration File
 * Replace these values with your cPanel credentials
 */

// Database Configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'your_db_user');
define('DB_PASS', 'your_db_password');
define('DB_NAME', 'your_db_name');

// SMTP Configuration (cPanel Mail)
define('SMTP_HOST', 'mail.yourdomain.com');
define('SMTP_PORT', 465);
define('SMTP_USER', 'noreply@yourdomain.com');
define('SMTP_PASS', 'your_email_password');
define('SMTP_FROM_NAME', 'Your App Name');

// JWT Configuration
define('JWT_SECRET', 'your-super-secret-key-change-this-32-chars');
define('JWT_EXPIRY', 86400); // 24 hours in seconds

// Application URL - Base URL where API files are located
// Example: https://yourdomain.com/api
define('APP_URL', 'https://yourdomain.com/api');

// Frontend URL - Where to redirect users after verification
define('FRONTEND_URL', 'https://yourdomain.com');
