<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

$host = 'localhost';
$port = '5432';
$dbname = 'handyman';
$user = 'postgres';
$password = 'root';

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Only allow POST requests for login
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

// Get JSON request body
$requestData = json_decode(file_get_contents("php://input"), true);

// Check if request data exists
if (!$requestData) {
    echo json_encode(["error" => "Invalid request format"]);
    exit;
}
try {
    $dsn = "pgsql:host=$host;dbname=$dbname";
    $pdo = new PDO($dsn, $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    switch ($requestData['action']) {
        case 'profile':
            handleProfile($pdo, $requestData);
        default:
            echo json_encode(["error" => "Invalid action"]);
            exit;
    }
} catch (Exception $e) {
    echo json_encode(array("error" => "An error occurred: " . $e->getMessage()));
} finally {
    if (isset($dbconn)) {
        pg_close($dbconn);
    }
}

function handleProfile($pdo, $requestData)
{
    // Get and sanitize token
    $token = filter_var($requestData['token'], FILTER_SANITIZE_NUMBER_INT);

    // Query to get user profile
    $stmt = $pdo->prepare("SELECT first_name, last_name, phone_number, address, city, state, postal_code, token_expiry FROM users WHERE token = :token");
    $stmt->bindParam(':token', $token);
    $stmt->execute();
    $tokenExpiry = $stmt->fetchColumn('token_expiry');
    $currentTime = date('Y-m-d H:i:s');
    $profile = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($tokenExpiry < $currentTime) {
        echo json_encode([
            "error" => "Token expired"
        ]);
        exit;
    }
    if ($profile) {
        echo json_encode([
            "success" => true,
            "profile" => $profile
        ]);
    } else {
        echo json_encode([
            "error" => "User not found"
        ]);
    }
}
