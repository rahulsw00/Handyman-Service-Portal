<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
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
            break;

        case 'get_user_type':
            // Get user type based on token
            $token = filter_var($requestData['token']);
            $stmt = $pdo->prepare("SELECT user_type FROM users WHERE token = :token");
            $stmt->bindParam(':token', $token);
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($row) {
                echo json_encode($row, JSON_PRETTY_PRINT);
            } else {
                echo json_encode(["error" => "User not found"], JSON_PRETTY_PRINT);
            }
            break;
        default:
            echo json_encode(["error" => "Invalid action"], JSON_PRETTY_PRINT);
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
    $token = filter_var($requestData['token']);

    // Query to get user profile
    //$stmt = $pdo->prepare("SELECT user_id, first_name, last_name, phone_number, address, city, state, postal_code, user_type,created_at FROM users WHERE token = :token");
    $stmt = $pdo->prepare("SELECT * FROM users WHERE token = :token");
    $stmt->bindParam(':token', $token);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$row) {
        echo json_encode([
            "error" => "User not found"
        ], JSON_PRETTY_PRINT);
        exit;
    }


    $tokenExpiry = $row['token_expiry'];
    $currentTime = date('Y-m-d H:i:s');

    if ($tokenExpiry < $currentTime) {
        echo json_encode([
            "error" => "Token expired"
        ], JSON_PRETTY_PRINT);
        exit;
    }

    if ($row['user_type'] == 'handyman') {
        fetchHandymanProfile($pdo, $row);
    } else {
        echo json_encode($row, JSON_PRETTY_PRINT);
    }
}

function fetchHandymanProfile($pdo, $row)
{
    $stmt = $pdo->prepare("SELECT * FROM handyman_profiles WHERE user_id = :user_id");
    $stmt->bindParam(':user_id', $row['user_id']);
    $stmt->execute();
    $handymanProfile = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode(array_merge($row, $handymanProfile), JSON_PRETTY_PRINT);
}
