<?php
if (isset($_SERVER['HTTP_ORIGIN'])) {
header("Access-Control-Allow-Origin: ". $_SERVER['HTTP_ORIGIN']);
header("Access-Control-Allow-Credentials: true"); 
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
}
header("Content-Type: application/json");
$lifetime = 300;//3600; // 1 hour

// Set session lifetime BEFORE session_start()
ini_set('session.gc_maxlifetime', $lifetime);
session_set_cookie_params($lifetime);

session_start();
include_once '../connection.php';
include_once("../class/class.validation.php");
$objVal = new validate();
include_once("login.class.php");
$cmnobj = new Login();

try {

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Read raw POST body
$data = json_decode(file_get_contents("php://input"), true);


if ($data === null) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid JSON or no input received.',
    ]);
    exit();
}

$username = isset($data['username']) ? $data['username'] : '';
$password = isset($data['password']) ? $data['password'] : '';

    if ($objVal->chkblank('User Name', $username)) {
        if ($objVal->sqlInject($objVal->chkalphanummail($username))) {
            $res = $cmnobj->getUserData($username, $password);
            $userid = 0;        
            if ($res) {
                while ($row = $asset_connObj->db_fetch_assoc($res)) {                    
                    $userid = $row['user_id'];   
                    $_SESSION['user_name']  = $row['username'];
                    $_SESSION['user_type']  = $row['user_type'];
                    $_SESSION['user_id'] = $userid;
                    $_SESSION['user_section']  = $row['linked_section'];
                }                
            }
            if($userid > 0)
            { 
                    echo json_encode(['success' => true]);
            }
            else {
                echo json_encode(['success' => false, 'message' => 'Username or password is incorrect.']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Username or password is incorrect.']);
        }
    }
} catch (Exception $e) {
    $message = 'Message: ' . $e->getMessage();
	echo json_encode(['success' => false, 'message' =>  $e->getMessage()]);
}


