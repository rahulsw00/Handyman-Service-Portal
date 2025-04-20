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

// Validate required fields
if (!isset($requestData['phoneNumber']) || !isset($requestData['password'])) {
    echo json_encode(["error" => "Phone number and password are required"]);
    exit;
}

try {
    $dsn = "pgsql:host=$host;dbname=$dbname";
    $pdo = new PDO($dsn, $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    switch ($requestData['action']) {
        case 'login':
            handleLogin($pdo, $requestData);
            break;
        case 'register':
            handleRegistration($pdo, $requestData);
            break;
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

function handleLogin($pdo, $requestData)
{
    // Get and sanitize phone number (remove any non-digit characters)
    $phoneNumber = preg_replace('/[^0-9]/', '', $requestData['phoneNumber']);
    $password = $requestData['password'];

    // Query to find user by phone number
    $stmt = $pdo->prepare("SELECT user_id, phone_number, password_hash, user_type FROM users WHERE phone_number = :phone_number");
    $stmt->bindParam(':phone_number', $phoneNumber);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Check if user exists
    if (!$user) {
        echo json_encode([
            "email_error" => "Phone number not registered"
        ]);
        exit;
    }

    // Verify password
    if ($password === $user['password_hash']) {
        // Generate a token
        $token = bin2hex(random_bytes(16));

        // Removed unused $currentTime variable
        $tokenExpiry = date('Y-m-d H:i:s', strtotime('+1 day'));

        // Store token in database
        $tokenStmt = $pdo->prepare("UPDATE users SET token = :token, token_expiry = :expiry WHERE user_id = :user_id");
        $tokenStmt->bindParam(':token', $token);
        $tokenStmt->bindParam(':expiry', $tokenExpiry);
        $tokenStmt->bindParam(':user_id', $user['user_id']);
        $tokenStmt->execute();


        // Return success response with token
        echo json_encode([
            "success" => true,
            "message" => "Login successful",
            "user" => [
                "user_id" => $user['user_id'],
                "phoneNumber" => $user['phone_number']
            ],
            "token" => $token
        ]);

        setcookie('accessToken', $token, [
            'expires' => time() + 86400, // 1 day
            'path' => '/',
            'secure' => true,      // HTTPS only
            'httponly' => false, // Accessible via JavaScript (if needed)
            'samesite' => 'Strict' // Prevents CSRF
        ]);
    } else {
        // Password incorrect
        echo json_encode([
            "password_error" => "Password is incorrect"
        ]);
    }
}


function handleRegistration($pdo, $requestData)
{

    //sanitize inputs
    $firstName = filter_var($requestData['firstName'], FILTER_UNSAFE_RAW);
    $lastName = filter_var($requestData['lastName']);
    $phoneNumber = preg_replace('/[^0-9]/', '', $requestData['phoneNumber']);
    $password = filter_var($requestData['password']);
    $address = filter_var($requestData['address']);
    $city = filter_var($requestData['city']);
    $state = filter_var($requestData['state']);
    $postalCode = preg_replace('/[^0-9]/', '', $requestData['postalCode']);
    $userType = filter_var($requestData['userType']);

    $verify = $pdo->prepare('SELECT phone_number FROM users WHERE phone_number = :phone_number');
    $verify->bindParam(':phone_number', $phoneNumber);
    $verify->execute();
    $user = $verify->FETCH(PDO::FETCH_ASSOC);

    if (!$user) {
        $stmt = $pdo->prepare("INSERT INTO users (first_name, last_name, password_hash,  phone_number, address, city, state, postal_code, user_type)
VALUES (:first_name, :last_name, :password_hash,  :phone_number, :address, :city, :state, :postal_code, :user_type)");
        $stmt->bindParam(':first_name', $firstName);
        $stmt->bindParam(':last_name', $lastName);
        $stmt->bindParam(':password_hash', $password);
        $stmt->bindParam(':phone_number', $phoneNumber);
        $stmt->bindParam(':address', $address);
        $stmt->bindParam(':city', $city);
        $stmt->bindParam(':state', $state);
        $stmt->bindParam(':postal_code', $postalCode);
        $stmt->bindParam(':user_type', $userType);
        $stmt->execute();

        echo json_encode([
            "success" => true,
            "message" => "Account Created!",
        ]);
    } else {
        echo json_encode([
            "existing_user_error" => "User already exist"
        ]);
    }
}
