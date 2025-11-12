<?php
session_start();

$lifetime = 300; // 5 minutes

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

$_SESSION['LAST_ACTIVITY'] = time(); // update activity

if (!isset($_SESSION['user_id'])) {
    echo json_encode([
        'success' => false,
        'error'   => 'NOT_LOGGED_IN',
        'message' => 'User not logged in'
    ]);
    exit();
}
