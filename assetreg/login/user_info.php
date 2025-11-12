<?php
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
    header("Access-Control-Allow-Credentials: true");
}
header("Content-Type: application/json");

//session_start();
require 'session_middleware.php';

$lifetime = 300; // 5 minutes

//  Check if session has expired based on last activity
if (isset($_SESSION['LAST_ACTIVITY']) && (time() - $_SESSION['LAST_ACTIVITY'] > $lifetime)) {
    session_unset();
    session_destroy();
    echo json_encode([
        'success' => false,
        'error'   => 'SESSION_EXPIRED',
        'message' => 'User session has expired. Please login again.'
    ]);
    exit();
}

// Update activity time
$_SESSION['LAST_ACTIVITY'] = time();

if (isset($_SESSION['user_id'])) {
    echo json_encode([
        'success' => true,
        'user' => [
            'id' => $_SESSION['user_id'],
            'name' => $_SESSION['user_name'],
            'role' => $_SESSION['user_type'],
            'user_section' => $_SESSION['user_section']
        ]
    ]);
} else {
    echo json_encode([
        'success' => false,
        'error'   => 'NOT_LOGGED_IN',
        'message' => 'User not logged in'
    ]);
}
