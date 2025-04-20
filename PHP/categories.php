<?php
// Enable CORS
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
// Database configuration
$host = 'localhost';
$dbname = 'handyman';
$user = 'postgres';
$password = 'root';
$port = 5432;

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

// echo json_encode($requestData, JSON_PRETTY_PRINT);

// Check if request data exists
if (!$requestData) {
    echo json_encode(["error" => "Invalid request format"]);
    exit;
}

try {
    $dsn = "pgsql:host=$host;dbname=$dbname";
    $pdo = new PDO($dsn, $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Route the request based on method and parameters
    switch ($requestData['action']) {
        case 'category':
            // Get all service categories
            $result = fetchCategory($pdo);
            echo json_encode($result, JSON_PRETTY_PRINT);
            break;

        case 'categories':
            $result = fetchCategories($pdo);
            echo json_encode($result, JSON_PRETTY_PRINT);
            break;

        case 'service':
            $result = fetchService($pdo, $requestData['service_id']);
            echo json_encode($result, JSON_PRETTY_PRINT);
            break;

        default:
            // Method not supported
            http_response_code(405);
            $result = ["error" => "Method not allowed"];
            break;
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}

/**
 * Fetch all categories from the database
 * 
 * @param PDO $pdo Database connection
 * @return array Array of categories
 */
function fetchCategory($pdo)
{
    try {
        $stmt = $pdo->query('SELECT * FROM service_categories');
        $stmt->execute();
        $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if (count($categories) === 0) {
            http_response_code(404);
            return ['error' => 'No categories found'];
        }
        return $categories;
    } catch (PDOException $e) {
        http_response_code(500);
        return ['error' => 'Error fetching categories: ' . $e->getMessage()];
    }
}

function fetchCategories($pdo)
{
    try {
        $stmt = $pdo->prepare('SELECT * FROM services');
        $stmt->execute();
        $category = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if (!$category) {
            http_response_code(404);
            return ['error' => 'Category not found'];
        }
        return $category;
    } catch (PDOException $e) {
        http_response_code(500);
        return ['error' => 'Error fetching category: ' . $e->getMessage()];
    }
}

function fetchService($pdo, $serviceId)
{
    try {
        $stmt = $pdo->prepare('SELECT * FROM services WHERE service_id = ?');
        $stmt->execute([$serviceId]);
        $service = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$service) {
            http_response_code(404);
            return ['error' => 'Service not found'];
        }
        return $service;
    } catch (PDOException $e) {
        http_response_code(500);
        return ['error' => 'Error fetching service: ' . $e->getMessage()];
    }
}
