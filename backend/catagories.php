<?php
// Set headers for CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

// Database configuration
$dbConfig = [
    'host' => 'localhost',
    'user' => 'postgres',
    'password' => 'root',
    'dbname' => 'handyman',
    'port' => 5432
];

// Connect to PostgreSQL
function connectDB($config) {
    $connectionString = sprintf(
        "host=%s port=%d dbname=%s user=%s password=%s",
        $config['host'],
        $config['port'],
        $config['dbname'],
        $config['user'],
        $config['password']
    );
    
    $conn = pg_connect($connectionString);
    
    if (!$conn) {
        http_response_code(500);
        echo json_encode(['message' => 'Database connection failed', 'error' => pg_last_error()]);
        exit;
    }
    
    return $conn;
}

// Get request URI and method
$requestUri = $_SERVER['REQUEST_URI'];
$requestMethod = $_SERVER['REQUEST_METHOD'];

// Parse the URI to get the path and query parameters
$uriParts = parse_url($requestUri);
$path = $uriParts['path'];

// Connect to the database
$dbConnection = connectDB($dbConfig);

// Router
if ($requestMethod === 'GET') {
    // Get all service categories
    if ($path === '/api/categories') {
        try {
            $result = pg_query($dbConnection, 'SELECT * FROM service_categories');
            if (!$result) {
                throw new Exception(pg_last_error($dbConnection));
            }
            
            $categories = pg_fetch_all($result);
            echo json_encode($categories);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['message' => 'Error fetching categories', 'error' => $e->getMessage()]);
        }
    }
    // Get services by category ID
    elseif (preg_match('/^\/api\/services\/(\d+)$/', $path, $matches)) {
        try {
            $categoryId = $matches[1];
            $result = pg_query_params(
                $dbConnection, 
                'SELECT * FROM services WHERE category_id = $1', 
                [$categoryId]
            );
            
            if (!$result) {
                throw new Exception(pg_last_error($dbConnection));
            }
            
            $services = pg_fetch_all($result);
            echo json_encode($services);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['message' => 'Error fetching services', 'error' => $e->getMessage()]);
        }
    }
    // Get a specific service by service ID
    elseif (preg_match('/^\/api\/service\/(\d+)$/', $path, $matches)) {
        try {
            $serviceId = $matches[1];
            $result = pg_query_params(
                $dbConnection,
                'SELECT s.*, sc.name as category_name FROM services s ' .
                'JOIN service_categories sc ON s.category_id = sc.category_id ' .
                'WHERE s.service_id = $1',
                [$serviceId]
            );
            
            if (!$result) {
                throw new Exception(pg_last_error($dbConnection));
            }
            
            $services = pg_fetch_all($result);
            
            if (empty($services)) {
                http_response_code(404);
                echo json_encode(['message' => 'Service not found']);
                exit;
            }
            
            echo json_encode($services[0]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['message' => 'Error fetching service', 'error' => $e->getMessage()]);
        }
    }
    // Search services
    elseif ($path === '/api/search' && isset($_GET['query'])) {
        try {
            $query = $_GET['query'];
            $result = pg_query_params(
                $dbConnection,
                'SELECT s.*, sc.name as category_name FROM services s ' .
                'JOIN service_categories sc ON s.category_id = sc.category_id ' .
                'WHERE s.name ILIKE $1 OR s.description ILIKE $1',
                ['%' . $query . '%']
            );
            
            if (!$result) {
                throw new Exception(pg_last_error($dbConnection));
            }
            
            $services = pg_fetch_all($result);
            echo json_encode($services);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['message' => 'Error searching services', 'error' => $e->getMessage()]);
        }
    }
    // Get category by service ID
    elseif (preg_match('/^\/api\/category\/(\d+)$/', $path, $matches)) {
        try {
            $serviceId = $matches[1];
            
            if (!$serviceId || $serviceId === 'undefined') {
                http_response_code(400);
                echo json_encode(['message' => 'Invalid service ID']);
                exit;
            }
            
            $result = pg_query_params(
                $dbConnection,
                'SELECT * FROM services WHERE service_id = $1',
                [$serviceId]
            );
            
            if (!$result) {
                throw new Exception(pg_last_error($dbConnection));
            }
            
            $services = pg_fetch_all($result);
            
            if (empty($services)) {
                http_response_code(404);
                echo json_encode(['message' => 'Category not found']);
                exit;
            }
            
            echo json_encode($services[0]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['message' => 'Error fetching category details', 'error' => $e->getMessage()]);
        }
    }
    else {
        http_response_code(404);
        echo json_encode(['message' => 'Endpoint not found']);
    }
}
else {
    http_response_code(405);
    echo json_encode(['message' => 'Method not allowed']);
}

// Close the database connection
pg_close($dbConnection);